import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as yup from 'yup'
import useAuth from '../../../../../hooks/useAuth'
import usePrivateApi from '../../../../../hooks/useAxiosPrivate'

import styles from './EditPartner.module.css'

import { Header } from '../../../../../components/Header'
import { Breadcrumb } from '../../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../../components/Profiles/Avatar'
import { ReactComponent as IconBack } from '../../../../../assets/icon-back.svg'
import { Input } from '../../../../../components/Forms/Input'
import { Select } from '../../../../../components/Forms/Select'
import { Button } from '../../../../../components/Forms/Button'
import { Footer } from '../../../../../components/Footer'
import { Login } from '../../../../Login'

import { PartnerType } from '../../../../../types/Partner'
import { CEPQueryResponse } from '../../../../../types/CEP'
import { CNPJQueryResponse } from '../../../../../types/CNPJ'
import { IBGEUFResponse } from '../../../../../types/UF'
import { IBGECityResponse } from '../../../../../types/City'
import { formatCnpj } from '../../../../../utils/CNPJ'
import { formatTelephone } from '../../../../../utils/Telephone'
import { formatCep } from '../../../../../utils/cep'

export function EditPartnerProfile() {
  const { auth } = useAuth()
  const api = usePrivateApi()
  const navigate = useNavigate()

  const [user, setUser] = useState({} as PartnerType)

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [cleanCnpj, setCleanCnpj] = useState('')

  const [image, setImage] = useState<File[]>([])
  const [previewImage, setPreviewImage] = useState<string[]>([])

  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  const [partner, setPartner] = useState({
    fantasyName: user.fantasyName,
    name: user.name,
    gcg: user.gcg,
    telephone: user.telephone,
    cep: user.cep,
    street: user.street,
    streetNumber: user.streetNumber,
    district: user.district,
    complement: user.complement,
    uf: user.uf,
    city: user.city,

    linkSite: user.linkSite,

    profilePicture: user.profilePicture,
  })

  useEffect(() => {
    var isMounted = true
    const abortController = new AbortController()

    const fetchProfile = async () => {
      try {
        const response = await api.get(
          `${auth?.role.toLowerCase()}/${auth?.id}`,
          { signal: abortController.signal },
        )
        isMounted && setUser(response.data)
      } catch (error) {}
    }

    fetchProfile()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  const valueInput = (e: any) =>
    setPartner({ ...partner, [e.target.name]: e.target.value })

  useEffect(() => {
    if (cleanCnpj.length == 14) {
      axios
        .get<CNPJQueryResponse>(
          `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`,
        )
        .then(response => {
          setPartner({
            ...partner,
            ['name']: response.data.razao_social,
          } as any)
        })
    }
  }, [partner.gcg])

  useEffect(() => {
    if (user.cep?.length == 9) {
      axios
        .get<CEPQueryResponse>(
          `https://brasilapi.com.br/api/cep/v2/${user.cep}`,
        )
        .then(response => {
          setPartner({
            ...partner,
            ['street']: response.data.street,
            ['district']: response.data.neighborhood,
            ['uf']: response.data.state,
            ['city']: response.data.city,
          } as any)
          setSelectedUf(response.data.state)
          setSelectedCity(response.data.city)
        })
    }
  }, [partner.cep])

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

  function handleCnpjChange(event: ChangeEvent<HTMLInputElement>) {
    const [cleanCnpj, formattedCnpj] = formatCnpj(event.target.value)

    setCleanCnpj(cleanCnpj)
    setPartner({ ...partner, ['gcg']: formattedCnpj })
  }

  function handleTelephoneChange(event: ChangeEvent<HTMLInputElement>) {
    const formattedTelephone = formatTelephone(event.target.value)
    setPartner({ ...partner, ['telephone']: formattedTelephone })
  }

  function handleCepChange(event: ChangeEvent<HTMLInputElement>) {
    const formattedCep = formatCep(event.target.value)
    setPartner({ ...partner, ['cep']: formattedCep })
  }

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value
    setSelectedUf(uf)
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value
    setSelectedCity(city)
  }

  function handleSelectImage(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }
    const selectedImage = Array.from(event.target.files)

    setImage(selectedImage)

    const selectedImagesPreview = selectedImage.map(image => {
      return URL.createObjectURL(image)
    })
    setPreviewImage(selectedImagesPreview)
  }

  async function validate() {
    let schema = yup.object().shape({
      street: yup.string().required('Erro: Necessário preencher o nome da rua'),
      cep: yup.string().required('Erro: Necessário preencher o CEP'),
      telephone: yup.string().required('Erro: Necessário preencher o telefone'),
      fantasyName: yup
        .string()
        .required('Erro: Necessário preencher o nome fantasia'),
      gcg: yup.string().required('Erro: Necessário preencher o CNPJ'),
      name: yup.string().required('Erro: Necessário preencher o campo nome'),
    })

    try {
      await schema.validate(partner)
      return true
    } catch (err) {
      setStatus({
        type: 'error',
        message: (err as any).errors,
      })
      return false
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!(await validate())) return

    const saveDataForm = true

    if (saveDataForm) {
      setStatus({
        type: 'success',
        message: 'Cadastro atualizado com sucesso',
      })
    } else {
      setStatus({
        type: 'error',
        message: 'Erro: Cadastro não atualizado',
      })
    }

    const data = new FormData()

    Object.entries(partner).forEach(([key, value]) => {
      if (['gcg', 'cep', 'telephone'].includes(key)) {
        value = value.replace(/\D/g, '')
      }
      data.append(key, value)
    })

    data.append('profilePicture', image[0])

    try {
      await api.patch('partner', data)
      alert('Cadastro atualizado com sucesso')
      navigate(`profile/${auth.role}/${auth.id}`)
    } catch (e) {
      console.log(e)
    }
  }

  if (!user) {
    return <Login />
  }

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Parceiros" to={user.fantasyName} />

          <Avatar src={user.profilePicture} />
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <Link to={`/profile/${auth?.role}/${auth?.id}`}>
              <IconBack />
            </Link>
            <h1>Editar perfil</h1>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <Input
                label="Razão Social"
                type="text"
                name="name"
                value={partner.name}
                onChange={valueInput}
              />

              <Input
                label="CNPJ"
                type="text"
                width="100%"
                name="gcg"
                value={partner.gcg}
                onChange={handleCnpjChange}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Nome Fantasia"
                type="text"
                name="fantasyName"
                value={partner.fantasyName}
                onChange={valueInput}
              />

              <Input
                label="Telefone"
                type="text"
                name="telephone"
                onChange={handleTelephoneChange}
                value={partner.telephone}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="URL do seu site"
                type="url"
                name="linkSite"
                onChange={valueInput}
                value={partner.linkSite}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="CEP"
                type="text"
                width="28%"
                name="CEP"
                value={partner.cep}
                onChange={handleCepChange}
              />

              <Select
                label="UF"
                name="uf"
                value={selectedUf}
                onChange={handleSelectedUf}
                options={ufs.map(uf => ({
                  label: uf,
                  value: uf,
                }))}
                width="20%"
              />

              <Select
                label="Cidade"
                name="city"
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
                value={partner.street}
                onChange={valueInput}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Número"
                type="text"
                width="30%"
                name="streetNumber"
                value={partner.streetNumber}
                onChange={valueInput}
              />

              <Input
                label="Bairro"
                type="text"
                name="district"
                value={partner.district}
                onChange={valueInput}
              />

              <Input
                label="Complemento"
                type="text"
                name="complement"
                value={partner.complement}
                onChange={valueInput}
              />
            </div>

            <div className={styles.divider}></div>

            <div className="input-block">
              <label className={styles.label} htmlFor="images">
                Foto de perfil
              </label>

              <div className={styles.imageContainer}>
                {previewImage.map(image => {
                  return <img key={image} src={image} alt=""></img>
                })}
                {previewImage.length < 1 && (
                  <label htmlFor="image[]" className={styles.newImage}>
                    +
                  </label>
                )}
              </div>
              <input
                multiple
                onChange={handleSelectImage}
                type="file"
                name="image"
                accept=".jpeg, .png, .jpg"
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
