import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as yup from 'yup'

import useAuth from '../../../../../hooks/useAuth'
import usePrivateApi from '../../../../../hooks/useAxiosPrivate'

import styles from './EditDonor.module.css'

import { ReactComponent as IconBack } from '../../../../../assets/icon-back.svg'
import { Header } from '../../../../../components/Header'
import { Footer } from '../../../../../components/Footer'
import { Breadcrumb } from '../../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../../components/Profiles/Avatar'
import { Input } from '../../../../../components/Forms/Input'
import { Select } from '../../../../../components/Forms/Select'
import { Button } from '../../../../../components/Forms/Button'

import { Login } from '../../../../Login'

import { DonorType } from '../../../../../types/Donor'
import { CNPJQueryResponse } from '../../../../../types/CNPJ'
import { CEPQueryResponse } from '../../../../../types/CEP'
import { IBGEUFResponse } from '../../../../../types/UF'
import { IBGECityResponse } from '../../../../../types/City'
import { formatTelephone } from '../../../../../utils/Telephone'
import { formatCep } from '../../../../../utils/cep'
import { formatCpf } from '../../../../../utils/cpf'

export function EditDonorProfile() {
  const { auth } = useAuth()
  const api = usePrivateApi()
  const navigate = useNavigate()

  const [user, setUser] = useState({} as DonorType)

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

  const [donor, setDonor] = useState({
    name: user.name,
    telephone: user.telephone,
    gcg: user.gcg,
    birthday: user.birthday,
    cep: user.cep,
    street: user.street,
    streetNumber: user.streetNumber,
    district: user.district,
    complement: user.complement,
    uf: user.uf,
    city: user.city,
    profilePicture: user.profilePicture,
    // image: user.image,
    // newImage: '',
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
    setDonor({ ...donor, [e.target.name]: e.target.value })

  useEffect(() => {
    if (cleanCnpj.length == 14) {
      axios
        .get<CNPJQueryResponse>(
          `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`,
        )
        .then(response => {
          setDonor({
            ...donor,
            ['name']: response.data.razao_social,
          } as any)
        })
    }
  }, [donor.gcg])

  useEffect(() => {
    if (user.cep?.length == 9) {
      axios
        .get<CEPQueryResponse>(
          `https://brasilapi.com.br/api/cep/v2/${user.cep}`,
        )
        .then(response => {
          setDonor({
            ...donor,
            ['street']: response.data.street,
            ['district']: response.data.neighborhood,
            ['uf']: response.data.state,
            ['city']: response.data.city,
          } as any)
          setSelectedUf(response.data.state)
          setSelectedCity(response.data.city)
        })
    }
  }, [donor.cep])

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

  function handleCpfChange(event: ChangeEvent<HTMLInputElement>) {
    const formattedCpf = formatCpf(event.target.value)
    setDonor({ ...donor, ['gcg']: formattedCpf })
  }

  function handleTelephoneChange(event: ChangeEvent<HTMLInputElement>) {
    const formattedTelephone = formatTelephone(event.target.value)
    setDonor({ ...donor, ['telephone']: formattedTelephone })
  }

  function handleCepChange(event: ChangeEvent<HTMLInputElement>) {
    const formattedCep = formatCep(event.target.value)
    setDonor({ ...donor, ['cep']: formattedCep })
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

    const selectedImagePreview = selectedImage.map(image => {
      return URL.createObjectURL(image)
    })
    setPreviewImage(selectedImagePreview)
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
      await schema.validate(donor)
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

    Object.entries(donor).forEach(([key, value]) => {
      if (['gcg', 'cep', 'telephone'].includes(key)) {
        value = value.replace(/\D/g, '')
      }
      data.append(key, value)
    })

    data.append('profilePicture', image[0])

    try {
      await api.patch('donor', data)
      alert('Cadastro atualizado com sucesso')
      navigate(`profile/${auth?.role}/${auth?.id}`)
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
          <Breadcrumb type="Doador" to={user.name} />
          <Avatar />
          <button className={styles.button}>Trocar foto</button>
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <Link to={`/profile/${auth?.role}/${auth?.id}`}>
              <IconBack />
            </Link>
            <h1>Editar perfil</h1>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Nome completo"
              type="text"
              name="name"
              value={donor.name}
              onChange={valueInput}
            />

            <Input
              label="CPF"
              type="text"
              width="100%"
              name="gcg"
              value={donor.gcg}
              onChange={handleCpfChange}
            />

            <div className={styles.row}>
              <Input
                label="Data de nascimento"
                type="date"
                width="40%"
                name="birthday"
                value={donor.birthday}
                onChange={valueInput}
              />

              <Input
                label="Telefone"
                type="text"
                name="telephone"
                onChange={handleTelephoneChange}
                value={donor.telephone}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="CEP"
                type="text"
                width="28%"
                name="cep"
                value={donor.cep}
                onChange={valueInput}
              />

              <Select
                label="UF"
                name="UF"
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
                value={donor.street}
                onChange={valueInput}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Número"
                type="text"
                width="30%"
                name="streetNumber"
                value={donor.streetNumber}
                onChange={valueInput}
              />

              <Input
                label="Bairro"
                type="text"
                name="district"
                value={donor.district}
                onChange={valueInput}
              />

              <Input
                label="Complemento"
                type="text"
                name="complement"
                value={donor.complement}
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
