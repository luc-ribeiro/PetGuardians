import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { api } from '../../services/api'

import styles from './Shelter.module.css'

import imgSignIn from '../../assets/Sheltersignin-img.jpg'
import { ReactComponent as IconBack } from '../../assets/icon-back.svg'
import logo from '../../assets/logo.svg'

import { Input } from '../../components/Forms/Input'
import { Select } from '../../components/Forms/Select'
import { Checkbox } from '../../components/Forms/Checkbox'
import { Button } from '../../components/Forms/Button'

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

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

export function ShelterSignIn() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [CNPJ, setCNPJ] = useState('')

  const [ownerName, setOwnerName] = useState('')
  const [ownerCPF, setOwnerCPF] = useState('')

  const [CEP, setCEP] = useState('')
  const [street, setStreet] = useState('')
  const [streetNumber, setStreetNumber] = useState('')
  const [district, setDistrict] = useState('')
  const [complement, setComplement] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [acceptTerms, setAcceptTerms] = useState(false)

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  useEffect(() => {
    axios
      .get<CNPJQueryResponse>(`https://brasilapi.com.br/api/cnpj/v1/${CNPJ}`)
      .then(response => {
        setName(response.data.razao_social)
        setCEP(response.data.cep)
        setStreet(response.data.logradouro)
        setStreetNumber(response.data.numero)
        setDistrict(response.data.bairro)
        setComplement(response.data.complemento)
        setSelectedUf(response.data.uf)
        setSelectedCity(response.data.municipio)
      })
  }, [CNPJ])

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

  async function handleSubmit(event: FormEvent) {
    if (acceptTerms) {
      event.preventDefault()

      const data = new FormData()

      data.append('corporateName', name)
      data.append('cnpj', CNPJ)

      data.append('name', ownerName)
      data.append('cpf', ownerCPF)

      data.append('uf', selectedUf)
      data.append('city', selectedCity)
      data.append('cep', CEP)
      data.append('street', street)
      data.append('streetNumber', streetNumber)
      data.append('district', district)
      data.append('complement', complement)

      data.append('email', email)
      data.append('password', password)

      try {
        await api.post('shelter', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        alert('Cadastro realizado com sucesso')
        navigate('/login')
      } catch (e) {
        console.log(e)
      }
    }
  }

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value
    setSelectedUf(uf)
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value
    setSelectedCity(city)
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
                name="nomeAbrigo"
                value={name}
                onChange={({ target }) => {
                  setName(target.value)
                }}
              />

              <Input
                label="CNPJ"
                type="text"
                name="cnpj"
                width="100%"
                value={CNPJ}
                onChange={({ target }) => {
                  setCNPJ(target.value)
                }}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="Nome do responsável"
                type="text"
                name="nomeResponsavelAbrigo"
                value={ownerName}
                onChange={({ target }) => {
                  setOwnerName(target.value)
                }}
              />

              <Input
                label="CPF"
                type="text"
                name="cpf"
                width="100%"
                value={ownerCPF}
                onChange={({ target }) => {
                  setOwnerCPF(target.value)
                }}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="CEP"
                type="text"
                name="cep"
                width="28%"
                value={CEP}
                onChange={({ target }) => {
                  setCEP(target.value)
                }}
              />

              <Select
                name="uf"
                label="UF"
                value={selectedUf}
                onChange={handleSelectedUf}
                options={ufs.map(uf => ({ label: uf, value: uf }))}
                width="20%"
              />

              <Select
                name="city"
                label="Cidade"
                value={selectedCity}
                onChange={handleSelectedCity}
                options={cities.map(city => ({ label: city, value: city }))}
                width="50%"
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Endereço"
                type="text"
                name="endereco"
                value={street}
                onChange={({ target }) => {
                  setStreet(target.value)
                }}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Número"
                type="text"
                name="enderecoNumero"
                width="30%"
                value={streetNumber}
                onChange={({ target }) => {
                  setStreetNumber(target.value)
                }}
              />

              <Input
                label="Bairro"
                type="text"
                name="enderecoBairro"
                value={district}
                onChange={({ target }) => {
                  setDistrict(target.value)
                }}
              />

              <Input
                label="Complemento"
                type="text"
                name="enderecoComplemento"
                value={complement}
                onChange={({ target }) => {
                  setComplement(target.value)
                }}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="E-mail"
                type="email"
                name="email"
                value={email}
                onChange={({ target }) => {
                  setEmail(target.value)
                }}
              />

              <Input
                label="Senha"
                type="password"
                name="senha"
                value={password}
                onChange={({ target }) => {
                  setPassword(target.value)
                }}
              />
            </div>

            <div className={styles.row}>
              <Checkbox
                label="Concordo com os termos e condições"
                name="termos"
                onClick={() => setAcceptTerms(true)}
              />
            </div>

            <Button type="submit">Cadastrar</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
