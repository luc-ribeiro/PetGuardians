import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as yup from 'yup'
import { api } from '../../../services/api'

import styles from './Shelter.module.css'

import imgSignIn from '../../../assets/Sheltersignin-img.jpg'
import { ReactComponent as IconBack } from '../../../assets/icon-back.svg'
import logo from '../../../assets/logo.svg'

import { Input } from '../../../components/Forms/Input'
import { Select } from '../../../components/Forms/Select'
import { Checkbox } from '../../../components/Forms/Checkbox'
import { Button } from '../../../components/Forms/Button'

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

export function ShelterSignUp() {
  const navigate = useNavigate()

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [cleanCnpj, setCleanCnpj] = useState('')

  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  const [shelter, setShelter] = useState({
    name: '',
    CNPJ: '',
    ownerName: '',
    ownerCPF: '',
    CEP: '',
    street: '',
    streetNumber: '',
    district: '',
    complement: '',
    uf: '',
    city: '',
    email: '',
    password: '',
  })

  const valueInput = (e: any) =>
    setShelter({ ...shelter, [e.target.name]: e.target.value })

  useEffect(() => {
    axios
      .get<CNPJQueryResponse>(
        `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`,
      )
      .then(response => {
        setShelter({
          ...shelter,
          ['name']: response.data.razao_social,
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
    // Carregar as cidades sempre que a UF mudar
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
      password: yup
        .string()
        .required('Erro: Necessário preencher o campo senha')
        .min(6, 'Erro: A senha deve ter no mínimo 6 caracteres'),

      email: yup
        .string()
        .required('Erro: Necessário preencher o campo e-mail')
        .email('Erro: Necessário preencher o campo com e-mail válido'),

      name: yup.string().required('Erro: Necessário preencher o campo nome'),
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

  function handleCpfChange(event: ChangeEvent<HTMLInputElement>) {
    const notFormattedCpf = event.target.value
    const formattedCpf = notFormattedCpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
    setShelter({ ...shelter, ['ownerCPF']: formattedCpf })
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

    console.log(shelter)

    //const data = new FormData()

    // data.append('corporateName', shelter.name)
    // data.append('cnpj', shelter.CNPJ)

    // data.append('name', shelter.ownerName)
    // data.append('cpf', shelter.ownerCPF)

    // data.append('cep', shelter.CEP)
    // data.append('street', shelter.street)
    // data.append('streetNumber', shelter.streetNumber)
    // data.append('district', shelter.district)
    // data.append('complement', shelter.complement)
    // data.append('uf', shelter.uf)
    // data.append('city', shelter.city)

    // data.append('email', shelter.email)
    // data.append('password', shelter.password)

    // try {
    //   await api.post('shelter', data, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //   alert('Cadastro realizado com sucesso')
    //   navigate('/login')
    // } catch (e) {
    //   console.log(e)
    // }
  }

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formImage}>
        <img src={imgSignIn} alt="" />
      </div>
      <div className={styles.formArea}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="" />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <Link to="/cadastrar">
              <IconBack />
            </Link>
            <h1>Cadastro de Abrigo</h1>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <Input
                label="Nome do abrigo"
                type="text"
                name="name"
                onChange={valueInput}
                value={shelter.name}
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

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="Nome do responsável"
                type="text"
                name="ownerName"
                onChange={valueInput}
                value={shelter.ownerName}
              />

              <Input
                label="CPF"
                type="text"
                name="ownerCPF"
                width="100%"
                onChange={handleCpfChange}
                value={shelter.ownerCPF}
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
                label="E-mail"
                type="email"
                name="email"
                onChange={valueInput}
                value={shelter.email}
              />

              <Input
                label="Senha"
                type="password"
                name="password"
                onChange={valueInput}
                value={shelter.password}
              />
            </div>

            <div className={styles.row}>
              <Checkbox
                label="Concordo com os termos e condições"
                name="termos"
                // onClick={() => setAcceptTerms(true)}
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
    </div>
  )
}
