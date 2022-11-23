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

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

export function ShelterSignIn() {
  const navigate = useNavigate()

  const [shelterName, setShelterName] = useState('')
  const [shelterCNPJ, setShelterCNPJ] = useState('')

  const [shelterOwnerName, setShelterOwnerName] = useState('')
  const [shelterOwnerCPF, setShelterOwnerCPF] = useState('')

  const [shelterCEP, setShelterCEP] = useState('')
  const [shelterStreet, setShelterStreet] = useState('')
  const [shelterStreetNumber, setShelterStreetNumber] = useState('')
  const [shelterDistrict, setShelterDistrict] = useState('')
  const [shelterComplement, setShelterComplement] = useState('')

  const [shelterEmail, setShelterEmail] = useState('')
  const [shelterPassword, setShelterPassword] = useState('')

  const [acceptTerms, setAcceptTerms] = useState(false)

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

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
    event.preventDefault()

    const data = new FormData()

    data.append('corporateName', shelterName)
    data.append('cnpj', shelterCNPJ)

    data.append('name', shelterOwnerName)
    data.append('cpf', shelterOwnerCPF)

    data.append('uf', selectedUf)
    data.append('city', selectedCity)
    data.append('cep', shelterCEP)
    data.append('street', shelterStreet)
    data.append('streetNumber', shelterStreetNumber)
    data.append('district', shelterDistrict)
    data.append('complement', shelterComplement)

    data.append('email', shelterEmail)
    data.append('password', shelterPassword)

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
                value={shelterName}
                onChange={({ target }) => {
                  setShelterName(target.value)
                }}
              />

              <Input
                label="CNPJ"
                type="text"
                name="cnpj"
                width="100%"
                value={shelterCNPJ}
                onChange={({ target }) => {
                  setShelterCNPJ(target.value)
                }}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="Nome do responsável"
                type="text"
                name="nomeResponsavelAbrigo"
                value={shelterOwnerName}
                onChange={({ target }) => {
                  setShelterOwnerName(target.value)
                }}
              />

              <Input
                label="CPF"
                type="text"
                name="cpf"
                width="100%"
                value={shelterOwnerCPF}
                onChange={({ target }) => {
                  setShelterOwnerCPF(target.value)
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
                value={shelterCEP}
                onChange={({ target }) => {
                  setShelterCEP(target.value)
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
                value={shelterStreet}
                onChange={({ target }) => {
                  setShelterStreet(target.value)
                }}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Número"
                type="text"
                name="enderecoNumero"
                width="30%"
                value={shelterStreetNumber}
                onChange={({ target }) => {
                  setShelterStreetNumber(target.value)
                }}
              />

              <Input
                label="Bairro"
                type="text"
                name="enderecoBairro"
                value={shelterDistrict}
                onChange={({ target }) => {
                  setShelterDistrict(target.value)
                }}
              />

              <Input
                label="Complemento"
                type="text"
                name="enderecoComplemento"
                value={shelterComplement}
                onChange={({ target }) => {
                  setShelterComplement(target.value)
                }}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="E-mail"
                type="email"
                name="email"
                value={shelterEmail}
                onChange={({ target }) => {
                  setShelterEmail(target.value)
                }}
              />

              <Input
                label="Senha"
                type="password"
                name="senha"
                value={shelterPassword}
                onChange={({ target }) => {
                  setShelterPassword(target.value)
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
