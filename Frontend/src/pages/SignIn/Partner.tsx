import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

import api from '../../services/api'

import styles from './partner.module.css'

import imgSignIn from '../../assets/partnersignin-img.jpg'
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

export function PartnerSignIn() {
  const navigate = useNavigate()

  const [partnerName, setPartnerName] = useState('')
  const [partnerFantasyName, setPartnerFantasyName] = useState('')
  const [partnerCNPJ, setPartnerCNPJ] = useState('')

  const [partnerCEP, setPartnerCEP] = useState('')
  const [partnerStreet, setPartnerStreet] = useState('')
  const [partnerStreetNumber, setPartnerStreetNumber] = useState('')
  const [partnerDistrict, setPartnerDistrict] = useState('')
  const [partnerComplement, setPartnerComplement] = useState('')

  const [partnerEmail, setPartnerEmail] = useState('')
  const [partnerPassword, setPartnerPassword] = useState('')

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

    data.append('corporateName', partnerName)
    data.append('nameFantasy', partnerFantasyName)
    data.append('cnpj', partnerCNPJ)

    data.append('uf', selectedUf)
    data.append('city', selectedCity)
    data.append('cep', partnerCEP)
    data.append('street', partnerStreet)
    data.append('streetNumber', partnerStreetNumber)
    data.append('district', partnerDistrict)
    data.append('complement', partnerComplement)

    data.append('email', partnerEmail)
    data.append('password', partnerPassword)

    try {
      await api.post('partner', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      alert('Cadastro realizado com sucesso')
      navigate('/perfil/parceiro')
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
            <h1>Cadastro de Parceiro</h1>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <Input
                label="Razão Social"
                type="text"
                name="nomeParceiro"
                value={partnerName}
                onChange={({ target }) => {
                  setPartnerName(target.value)
                }}
              />

              <Input
                label="CNPJ"
                type="text"
                name="cnpj"
                width="100%"
                value={partnerCNPJ}
                onChange={({ target }) => {
                  setPartnerCNPJ(target.value)
                }}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Nome Fantasia"
                type="text"
                name="nomeFantasia"
                value={partnerFantasyName}
                onChange={({ target }) => {
                  setPartnerFantasyName(target.value)
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
                value={partnerCEP}
                onChange={({ target }) => {
                  setPartnerCEP(target.value)
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
                value={partnerStreet}
                onChange={({ target }) => {
                  setPartnerStreet(target.value)
                }}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Número"
                type="text"
                name="enderecoNumero"
                width="30%"
                value={partnerStreetNumber}
                onChange={({ target }) => {
                  setPartnerStreetNumber(target.value)
                }}
              />

              <Input
                label="Bairro"
                type="text"
                name="enderecoBairro"
                value={partnerDistrict}
                onChange={({ target }) => {
                  setPartnerDistrict(target.value)
                }}
              />

              <Input
                label="Complemento"
                type="text"
                name="enderecoComplemento"
                value={partnerComplement}
                onChange={({ target }) => {
                  setPartnerComplement(target.value)
                }}
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input
                label="E-mail"
                type="email"
                name="email"
                value={partnerEmail}
                onChange={({ target }) => {
                  setPartnerEmail(target.value)
                }}
              />

              <Input
                label="Senha"
                type="password"
                name="senha"
                value={partnerPassword}
                onChange={({ target }) => {
                  setPartnerPassword(target.value)
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
