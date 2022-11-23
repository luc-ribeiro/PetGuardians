import { useState, useEffect, ChangeEvent } from 'react'
import axios from 'axios'

import styles from './Donor.module.css'

import { Link } from 'react-router-dom'
import imgDonorSignIn from '../../assets/donorsignin-img.jpg'
import { ReactComponent as IconBack } from '../../assets/icon-back.svg'
import logo from '../../assets/logo.svg'

import { Input } from '../../components/Forms/Input'
import { Select } from '../../components/Forms/Select'
import { Checkbox } from '../../components/Forms/Checkbox'
import { Button } from '../../components/Forms/Button'

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

export function DonorSignIn() {
  const [name, setName] = useState('')

  const [CPF, setCPF] = useState('')
  const [birthday, setBirthday] = useState('')
  const [CEP, setCEP] = useState('')
  const [street, setStreet] = useState('')
  const [streetNumber, setStreetNumber] = useState('')
  const [district, setDistrict] = useState('')
  const [complement, setComplement] = useState('')

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    axios
      .get<CEPQueryResponse>(`https://brasilapi.com.br/api/cep/v2/${CEP}`)
      .then(response => {
        setStreet(response.data.street)
        setDistrict(response.data.neighborhood)
        setSelectedUf(response.data.state)
        setSelectedCity(response.data.city)
      })
  }, [CEP])

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
        <img src={imgDonorSignIn} alt="" />
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
            <h1>Cadastro de Doador</h1>
          </div>

          <form className={styles.form}>
            <Input
              label="Nome completo"
              type="text"
              value={name}
              onChange={({ target }) => {
                setName(target.value)
              }}
            />

            <div className={styles.row}>
              <Input label="CPF" type="text" name="cpf" width="100%" />
              <Input
                label="Data de nascimento"
                type="date"
                width="40%"
                value={birthday}
                onChange={({ target }) => {
                  setBirthday(target.value)
                }}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="CEP"
                type="text"
                width="28%"
                value={CEP}
                onChange={({ target }) => {
                  setCEP(target.value)
                }}
              />

              <Select
                label="UF"
                value={selectedUf}
                onChange={handleSelectedUf}
                options={ufs.map(uf => ({ label: uf, value: uf }))}
                width="20%"
              />

              <Select
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
                width="30%"
                value={streetNumber}
                onChange={({ target }) => {
                  setStreetNumber(target.value)
                }}
              />

              <Input
                label="Bairro"
                type="text"
                value={district}
                onChange={({ target }) => {
                  setDistrict(target.value)
                }}
              />

              <Input
                label="Complemento"
                type="text"
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
                value={email}
                onChange={({ target }) => {
                  setEmail(target.value)
                }}
              />

              <Input
                label="Senha"
                type="password"
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
              />
            </div>

            <Button type="submit">Cadastrar</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
