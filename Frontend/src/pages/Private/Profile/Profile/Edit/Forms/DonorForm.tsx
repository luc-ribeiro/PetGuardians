import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { api } from '../../../../../../services/api'
import * as yup from 'yup'

import styles from './donorForm.module.css'

import { ReactComponent as IconBack } from '../../../../../../assets/icon-back.svg'

import { Input } from '../../../../../../components/Forms/Input'
import { Select } from '../../../../../../components/Forms/Select'
import { TextArea } from '../../../../../../components/Forms/TextArea'
import { Button } from '../../../../../../components/Forms/Button'
import { Profile } from '../../Profile'
import { AuthContext } from '../../../../../../contexts/Auth/AuthContext'
import { Login } from '../../../../../Login'

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

export function DonorForm() {
  const auth = useContext(AuthContext)
  const { user } = auth
  const navigate = useNavigate()

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  if (!user) {
    return <Login />
  }

  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  const [donor, setDonor] = useState({
    name: user.person.name,
    telephone: user.person.telephone,
    CPF: user.person.gcg,
    birthday: '',
    CEP: user.person.cep,
    street: user.person.street,
    streetNumber: user.person.streetNumber,
    district: user.person.district,
    complement: user.person.complement,
    uf: user.person.uf,
    city: user.person.city,
    profilePicture: user.person.profilePicture,
    images: user.person.images,
    newImages: '',
  })

  const valueInput = (e: any) =>
    setDonor({ ...donor, [e.target.name]: e.target.value })

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
    if (donor.CEP.length == 9) {
      axios
        .get<CEPQueryResponse>(
          `https://brasilapi.com.br/api/cep/v2/${donor.CEP}`,
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
  }, [donor.CEP])

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

      CPF: yup.string().required('Erro: Necessário preencher o CPF'),
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

  function handleCpfChange(event: ChangeEvent<HTMLInputElement>) {
    const notFormattedCpf = event.target.value
    const formattedCpf = notFormattedCpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
    setDonor({ ...donor, ['CPF']: formattedCpf })
  }

  function handleTelephoneChange(event: ChangeEvent<HTMLInputElement>) {
    const phoneNumber = event.target.value
    const formattedPhoneNumber = phoneNumber
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{5})\d+?$/, '$1')
    setDonor({ ...donor, ['telephone']: formattedPhoneNumber })
  }

  function handleCepChange(event: ChangeEvent<HTMLInputElement>) {
    const notFormattedCep = event.target.value
    const formattedCep = notFormattedCep
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
    setDonor({ ...donor, ['CEP']: formattedCep })
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
        message: 'Cadastro atualizado com sucesso',
      })
    } else {
      setStatus({
        type: 'error',
        message: 'Erro: Cadastro não atualizado',
      })
    }

    const accessToken = localStorage.getItem('authToken')

    const data = new FormData()

    Object.entries(donor).forEach(([key, value]) => {
      if (['CPF', 'CEP', 'telephone'].includes(key)) {
        value = value.replace(/\D/g, '')
      }
      data.append(key, value)
    })

    try {
      await api.patch('donor', data, {
        headers: {
          'Content-Type': 'application/x-www-url-formencoded',
          Authorization: 'Bearer ' + accessToken,
        },
      })
      alert('Cadastro atualizado com sucesso')
      navigate('/meuperfil')
    } catch (e) {
      console.log(e)
    }
  }

  return (
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
        name="CPF"
        value={donor.CPF}
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
          name="CEP"
          value={donor.CEP}
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
  )
}
