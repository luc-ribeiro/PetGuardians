import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as yup from 'yup'
import { api } from '../../../services/api'

import styles from './Partner.module.css'

import imgSignIn from '../../../assets/partnersignin-img.jpg'
import { ReactComponent as IconBack } from '../../../assets/icon-back.svg'
import logo from '../../../assets/logo.svg'

import { Input } from '../../../components/Forms/Input'
import { Select } from '../../../components/Forms/Select'
import { Checkbox } from '../../../components/Forms/Checkbox'
import { Button } from '../../../components/Forms/Button'

interface CNPJQueryResponse {
  razao_social: string
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

export function PartnerSignUp() {
  const navigate = useNavigate()

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [cleanCnpj, setCleanCnpj] = useState('')

  const [terms, setTerms] = useState(false)

  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  const [partner, setPartner] = useState({
    corporateName: '',
    fantasyName: '',
    telephone: '',
    linkSite: '',
    CNPJ: '',
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
    setPartner({ ...partner, [e.target.name]: e.target.value })

  useEffect(() => {
    axios
      .get<CNPJQueryResponse>(
        `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`,
      )
      .then(response => {
        setPartner({
          ...partner,
          ['corporateName']: response.data.razao_social,
        } as any)
      })
  }, [partner.CNPJ])

  useEffect(() => {
    axios
      .get<CEPQueryResponse>(
        `https://brasilapi.com.br/api/cep/v2/${partner.CEP}`,
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
  }, [partner.CEP])

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
      street: yup.string().required('Erro: Necessário preencher o nome da rua'),
      CEP: yup.string().required('Erro: Necessário preencher o CEP'),
      telephone: yup.string().required('Erro: Necessário preencher o telefone'),
      urlSite: yup
        .string()
        .required('Erro: Necessário preencher a URL do site'),
      fantasyName: yup
        .string()
        .required('Erro: Necessário preencher o nome fantasia'),
      CNPJ: yup.string().required('Erro: Necessário preencher o CNPJ'),
      corporateName: yup
        .string()
        .required('Erro: Necessário preencher o campo nome'),
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

  function handleTerms(event: ChangeEvent<HTMLInputElement>) {
    setTerms(event.target.checked)
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
    setPartner({ ...partner, ['CNPJ']: formattedCnpj })
  }

  function handleTelephoneChange(event: ChangeEvent<HTMLInputElement>) {
    const phoneNumber = event.target.value
    const formattedPhoneNumber = phoneNumber
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{5})\d+?$/, '$1')
    setPartner({ ...partner, ['telephone']: formattedPhoneNumber })
  }

  function handleCepChange(event: ChangeEvent<HTMLInputElement>) {
    const notFormattedCep = event.target.value
    const formattedCep = notFormattedCep
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1')
    setPartner({ ...partner, ['CEP']: formattedCep })
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

    try {
      await api.post(
        'partner',
        {
          corporateName: partner.corporateName,
          fantasyName: partner.fantasyName,
          cnpj: partner.CNPJ.replace(/\D/g, ''),
          telephone: partner.telephone.replace(/\D/g, ''),
          linkSite: partner.linkSite,
          cep: partner.CEP.replace(/\D/g, ''),
          street: partner.street,
          streetNumber: partner.streetNumber,
          district: partner.district,
          complement: partner.complement,
          uf: partner.uf,
          city: partner.city,
          email: partner.email,
          password: partner.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      alert('Cadastro realizado com sucesso')
      navigate('/login')
    } catch (e) {
      setStatus({
        type: 'error',
        message: 'Erro: Cadastro não realizado',
      })
    }
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
                name="corporateName"
                value={partner.corporateName}
                onChange={valueInput}
              />

              <Input
                label="CNPJ"
                type="text"
                width="100%"
                name="CNPJ"
                value={partner.CNPJ}
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
                value={partner.CEP}
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

            <div className={styles.row}>
              <Input
                label="E-mail"
                type="email"
                name="email"
                value={partner.email}
                onChange={valueInput}
              />

              <Input
                label="Senha"
                type="password"
                value={partner.password}
                onChange={valueInput}
                name="password"
              />
            </div>

            {/* <div className={styles.row}>
              <Checkbox
                label="Concordo com os termos e condições"
                name="termos"
                onClick={() => setAcceptTerms(true)}
              />
            </div> */}

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
