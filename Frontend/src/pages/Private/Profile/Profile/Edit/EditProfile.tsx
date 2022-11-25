import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { api } from '../../../../../services/api'
import * as yup from 'yup'

import styles from './EditProfile.module.css'

import { ReactComponent as IconBack } from '../../../../../assets/icon-back.svg'

import { Header } from '../../../../../components/Header'
import { Footer } from '../../../../../components/Footer'
import { Breadcrumb } from '../../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../../components/Profiles/Avatar'

import { Input } from '../../../../../components/Forms/Input'
import { Select } from '../../../../../components/Forms/Select'
import { TextArea } from '../../../../../components/Forms/TextArea'
import { Button } from '../../../../../components/Forms/Button'
import { Profile } from '../Profile'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../../../../contexts/Auth/AuthContext'
import { Login } from '../../../../Login'

interface CNPJQueryResponse {
  razao_social: string
  nome_fantasia: string
  bairro: string
  cep: string
  complemento: string
  logradouro: string
  numero: string
  uf: string
  municipio: string
}

interface CEPQueryResponse {
  state: string
  city: string
  neighborhood: string
  street: string
}

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

export function EditProfile() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [cleanCnpj, setCleanCnpj] = useState('')

  if (!auth.user) {
    return <Login />
  }

  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  const [shelter, setShelter] = useState({
    corporateName: auth.user.name,
    fantasyName: auth.user.fantasyName,
    CNPJ: auth.user.gcg,
    telephone: auth.user.telephone,
    CEP: auth.user.cep,
    street: auth.user.street,
    streetNumber: auth.user.streetNumber,
    district: auth.user.district,
    complement: auth.user.complement,
    uf: auth.user.uf,
    city: auth.user.city,

    about: auth.user.about,
    keyPix: auth.user.keyPix,
    profilePicture: null,
    newImages: [],
  })

  const valueInput = (e: any) =>
    setShelter({ ...shelter, [e.target.name]: e.target.value })

  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }
    const selectedImages = Array.from(event.target.files)

    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    })
    setPreviewImages(selectedImagesPreview)
  }

  useEffect(() => {
    axios
      .get<CNPJQueryResponse>(
        `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`,
      )
      .then(response => {
        setShelter({
          ...shelter,
          ['corporateName']: response.data.razao_social,
        } as any)
      })
  }, [shelter.CNPJ])

  useEffect(() => {
    axios
      .get<CEPQueryResponse>(
        `https://brasilapi.com.br/api/cep/v2/${shelter.CEP}`,
      )
      .then(response => {
        setShelter({
          ...shelter,
          ['street']: response.data.street,
          ['district']: response.data.neighborhood,
          ['uf']: response.data.state,
          ['city']: response.data.city,
        } as any)
        setSelectedUf(response.data.state)
        setSelectedCity(response.data.city)
      })
  }, [shelter.CNPJ, shelter.CEP])

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      )
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla)
        setUfs(ufInitials)
      })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
      )
      .then(response => {
        const cityNames = response.data.map(city => city.nome)
        setCities(cityNames)
      })
  }, [selectedUf])

  async function validate() {
    let schema = yup.object().shape({
      street: yup.string().required('Erro: Necessário preencher o nome da rua'),
      CEP: yup.string().required('Erro: Necessário preencher o CEP'),
      telephone: yup.string().required('Erro: Necessário preencher o telefone'),
      fantasyName: yup
        .string()
        .required('Erro: Necessário preencher o nome fantasia'),
      CNPJ: yup.string().required('Erro: Necessário preencher o CNPJ'),
      corporateName: yup
        .string()
        .required('Erro: Necessário preencher o campo nome'),
    })

    try {
      await schema.validate(shelter)
      return true
    } catch (err) {
      setStatus({
        type: 'error',
        message: (err as any).errors,
      })
      return false
    }
  }

  function handleCnpjChange(event: ChangeEvent<HTMLInputElement>) {
    const notFormattedCnpj = event.target.value

    const formattedCnpj = notFormattedCnpj
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')

    const cleanCnpj = formattedCnpj.replace(/\D/g, '')

    setCleanCnpj(cleanCnpj)
    setShelter({ ...shelter, ['CNPJ']: formattedCnpj })
  }

  function handleTelephoneChange(event: ChangeEvent<HTMLInputElement>) {
    const phoneNumber = event.target.value
    const formattedPhoneNumber = phoneNumber
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{5})\d+?$/, '$1')
    setShelter({ ...shelter, ['telephone']: formattedPhoneNumber })
  }

  function handleCepChange(event: ChangeEvent<HTMLInputElement>) {
    const notFormattedCep = event.target.value
    const formattedCep = notFormattedCep
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
    setShelter({ ...shelter, ['CEP']: formattedCep })
  }

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value
    setSelectedUf(uf)
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value
    setSelectedCity(city)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!(await validate())) return

    const saveDataForm = true

    if (saveDataForm) {
      setStatus({
        type: 'success',
        message: 'Cadastro realizado com sucesso',
      })
    } else {
      setStatus({
        type: 'error',
        message: 'Erro: Cadastro não realizado',
      })
    }

    const accessToken = localStorage.getItem('authToken')

    try {
      await api.patch(
        'shelter',
        {
          corporateName: shelter.corporateName,
          fantasyName: shelter.fantasyName,
          cnpj: shelter.CNPJ.replace(/\D/g, ''),
          telephone: shelter.telephone.replace(/\D/g, ''),

          cep: shelter.CEP.replace(/\D/g, ''),
          street: shelter.street,
          streetNumber: shelter.streetNumber,
          district: shelter.district,
          complement: shelter.complement,
          uf: shelter.uf,
          city: shelter.city,

          about: shelter.about,
          keyPix: shelter.keyPix,
          profilePicture: shelter.profilePicture,
          newImages: [...shelter.newImages],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        },
      )
      alert('Cadastro atualizado com sucesso')
      navigate('/meuperfil')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Abrigos" to={auth.user.name} />
          <Avatar />
          <button className={styles.button}>Trocar foto</button>
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <Link to="/meuperfil">
              <IconBack />
            </Link>
            <h1>Editar perfil</h1>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <Input
                label="Razão Social"
                type="text"
                name="corporateName"
                onChange={valueInput}
                value={shelter.corporateName}
              />

              <Input
                label="CNPJ"
                type="text"
                name="CNPJ"
                width="100%"
                onChange={handleCnpjChange}
                value={shelter.CNPJ}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Nome fantasia"
                type="text"
                name="fantasyName"
                onChange={valueInput}
                value={shelter.fantasyName}
              />

              <Input
                label="Telefone"
                type="text"
                name="telephone"
                onChange={handleTelephoneChange}
                value={shelter.telephone}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="CEP"
                type="text"
                name="CEP"
                width="28%"
                onChange={handleCepChange}
                value={shelter.CEP}
              />

              <Select
                name="uf"
                label="UF"
                value={selectedUf}
                onChange={handleSelectedUf}
                options={ufs.map(uf => ({
                  label: uf,
                  value: uf,
                }))}
                width="20%"
              />

              <Select
                name="city"
                label="Cidade"
                value={selectedCity}
                onChange={handleSelectedCity}
                options={cities.map(city => ({
                  label: city,
                  value: city,
                }))}
                width="50%"
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Endereço"
                type="text"
                name="street"
                onChange={valueInput}
                value={shelter.street}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Número"
                type="text"
                name="streetNumber"
                width="30%"
                onChange={valueInput}
                value={shelter.streetNumber}
              />

              <Input
                label="Bairro"
                type="text"
                name="district"
                onChange={valueInput}
                value={shelter.district}
              />

              <Input
                label="Complemento"
                type="text"
                name="complement"
                onChange={valueInput}
                value={shelter.complement}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="Chave PIX"
                type="text"
                name="keyPix"
                onChange={valueInput}
                value={shelter.keyPix}
              />
            </div>

            <div className={styles.divider}></div>

            <TextArea
              label="Sobre"
              name="about"
              value={shelter.about}
              onChange={valueInput}
            />

            <div className="input-block">
              <label className={styles.label} htmlFor="images">
                Fotos
              </label>

              <div className={styles.imageContainer}>
                {previewImages.map(image => {
                  return <img key={image} src={image} alt=""></img>
                })}
                <label htmlFor="image[]" className={styles.newImage}>
                  +
                </label>
              </div>
              <input
                multiple
                onChange={handleSelectImages}
                type="file"
                id="image[]"
              />
            </div>

            {status.type === 'success' ? (
              <p style={{ color: 'green' }}>{status.message}</p>
            ) : (
              ''
            )}
            {status.type === 'error' ? (
              <p style={{ color: '#ff0000' }}>{status.message}</p>
            ) : (
              ''
            )}

            <Button type="submit">Cadastrar</Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
