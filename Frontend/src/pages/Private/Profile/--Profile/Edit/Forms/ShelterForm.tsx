import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { api } from '../../../../../../services/api'
import * as yup from 'yup'

import styles from './ShelterForm.module.css'

import { Input } from '../../../../../../components/Forms/Input'
import { Select } from '../../../../../../components/Forms/Select'
import { TextArea } from '../../../../../../components/Forms/TextArea'
import { Button } from '../../../../../../components/Forms/Button'
import { AuthContext } from '../../../../../../contexts/Auth/AuthContext'
import { Login } from '../../../../../Login'

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

export function ShelterForm() {
  const auth = useContext(AuthContext)
  const { user } = auth
  const navigate = useNavigate()

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [cleanCnpj, setCleanCnpj] = useState('')

  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  if (!user) {
    return <Login />
  }

  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  const [shelter, setShelter] = useState({
    fantasyName: user.shelter.fantasyName,
    corporateName: user.person.name,
    CNPJ: user.person.gcg,
    telephone: user.person.telephone,
    CEP: user.person.cep,
    street: user.person.street,
    streetNumber: user.person.streetNumber,
    district: user.person.district,
    complement: user.person.complement,
    uf: user.person.uf,
    city: user.person.city,

    about: user.shelter.about,
    keyPIX: user.shelter.keyPIX,

    profilePicture: user.person.profilePicture,
    images: user.person.images,
    newImages: [],
  })

  // useEffect(() => {
  //   await api.get('')
  // })

  useEffect(() => {
    const selectedImagesPreview = images.map(image => {
      return URL.createObjectURL(image)
    })
    setPreviewImages(selectedImagesPreview)
  }, [images])

  const valueInput = (e: any) =>
    setShelter({ ...shelter, [e.target.name]: e.target.value })

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }
    const selectedImages = Array.from(event.target.files)

    setImages([...selectedImages, ...images])
  }

  useEffect(() => {
    if (cleanCnpj.length == 14) {
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
    }
  }, [shelter.CNPJ])

  useEffect(() => {
    if (shelter.CEP.length == 9) {
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
    }
  }, [shelter.CEP])

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

    Object.entries(shelter).forEach(([key, value]) => {
      if (['CNPJ', 'CEP', 'telephone'].includes(key)) {
        value = value.replace(/\D/g, '')
      }
      data.append(key, value)
    })

    // data.append('profilePicture', images[0])

    images.forEach(image => {
      data.append('newImages', image)
    })

    try {
      await api.patch('shelter', data, {
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
          name="keyPIX"
          onChange={valueInput}
          value={shelter.keyPIX}
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
          Fotos do abrigo
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
  )
}