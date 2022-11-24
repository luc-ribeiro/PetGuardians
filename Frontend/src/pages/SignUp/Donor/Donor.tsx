import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import * as yup from 'yup'
import axios from 'axios'

import styles from './Donor.module.css'

import imgDonorSignIn from '../../../assets/donorsignin-img.jpg'
import { ReactComponent as IconBack } from '../../../assets/icon-back.svg'
import logo from '../../../assets/logo.svg'

import { Input } from '../../../components/Forms/Input'
import { Select } from '../../../components/Forms/Select'
import { Checkbox } from '../../../components/Forms/Checkbox'
import { Button } from '../../../components/Forms/Button'
import { api } from '../../../services/api'

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

export function DonorSignUp() {
  const navigate = useNavigate()

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  const [donor, setDonor] = useState({
    name: '',
    CPF: '',
    birthday: '',
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
    setDonor({ ...donor, [e.target.name]: e.target.value })

  useEffect(() => {
    axios
      .get<CEPQueryResponse>(`https://brasilapi.com.br/api/cep/v2/${donor.CEP}`)
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

    console.log(donor)

    // const data = new FormData();

    // data.append("name", donor.name);
    // data.append("cpf", donor.CPF);
    // data.append("birthday", donor.birthday);

    // data.append("cep", donor.CEP);
    // data.append("street", donor.street);
    // data.append("streetNumber", donor.streetNumber);
    // data.append("district", donor.district);
    // data.append("complement", donor.complement);
    // data.append("uf", donor.uf);
    // data.append("city", donor.city);

    // data.append("email", donor.email);
    // data.append("password", donor.password);

    // try {
    // 	await api.post("donor", data, {
    // 		headers: {
    // 			"Content-Type": "application/json",
    // 		},
    // 	});
    // 	alert("Cadastro realizado com sucesso");
    // 	navigate("/login");
    // } catch (e) {
    // 	console.log(e);
    // }
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

          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Nome completo"
              type="text"
              name="name"
              value={donor.name}
              onChange={valueInput}
            />

            <div className={styles.row}>
              <Input
                label="CPF"
                type="text"
                width="100%"
                name="CPF"
                value={donor.CPF}
                onChange={handleCpfChange}
              />
              <Input
                label="Data de nascimento"
                type="date"
                width="40%"
                name="birthday"
                value={donor.birthday}
                onChange={valueInput}
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
                onChange={handleCepChange}
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

            <div className={styles.row}>
              <Input
                label="E-mail"
                type="email"
                name="email"
                value={donor.email}
                onChange={valueInput}
              />

              <Input
                label="Senha"
                type="password"
                name="password"
                value={donor.password}
                onChange={valueInput}
              />
            </div>

            <div className={styles.row}>
              <Checkbox
                label="Concordo com os termos e condições"
                name="termos"
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
