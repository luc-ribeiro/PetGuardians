import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { api } from '../../../services/api'
import * as yup from 'yup'

import styles from './EditProfile.module.css'

import { ReactComponent as IconBack } from '../../../assets/icon-back.svg'

import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { Breadcrumb } from '../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../components/Profiles/Avatar'

import { Input } from '../../../components/Forms/Input'
import { Select } from '../../../components/Forms/Select'
import { TextArea } from '../../../components/Forms/TextArea'
import { Button } from '../../../components/Forms/Button'
import { Profile } from '../Profile'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../../contexts/Auth/AuthContext'
import { Login } from '../../Login'

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

export function EditProfile() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  if (!auth.user) {
    return <Login />
  }

  const [name, setName] = useState(auth.user.name)
  const [nameOwner, setOwnerName] = useState('')
  const [CNPJ, setCNPJ] = useState(auth.user.cnpj)
  const [CPF, setCPF] = useState(auth.user.cpf)
  const [Birthday, setBirthday] = useState('')

  const [CEP, setCEP] = useState(auth.user.cep)
  const [street, setStreet] = useState(auth.user.street)
  const [streetNumber, setStreetNumber] = useState(auth.user.streetNumber)
  const [district, setDistrict] = useState(auth.user.district)
  const [complement, setComplement] = useState(auth.user.complement)

  const [email, setEmail] = useState(auth.user.email)
  const [password, setPassword] = useState('')

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState(auth.user.uf)
  const [selectedCity, setSelectedCity] = useState(auth.user.city)

  const [about, setAbout] = useState(auth.user.about)

  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const data = new FormData()

    data.append('corporateName', name)
    data.append('name', name)
    data.append('cnpj', CNPJ)
    // data.append('cpf', CPF)
    // data.append('uf', selectedUf)
    // data.append('city', selectedCity)
    // data.append('cep', CEP)
    // data.append('street', street)
    // data.append('streetNumber', streetNumber)
    // data.append('district', district)
    // data.append('complement', complement)
    // data.append('email', email)
    // data.append('password', password)
    data.append('about', about)

    const accessToken = localStorage.getItem('authToken')

    try {
      if (auth.user) {
        await api.patch(`shelter/${auth.user.id}`, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        })
        alert('Atualização realizada com sucesso')
        navigate('meuperfil')
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Abrigos" to={auth.user.name} />
          <Avatar />
          <button className={styles.button}>Trocar foto</button>
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <Link to="/meuperfil">
              <IconBack />
            </Link>
            <h1>Editar perfil</h1>
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

            <div className={styles.row}>
              <Input
                label="Nome completo do responsável pelo abrigo"
                type="text"
                name="nomeResponsavelAbrigo"
                value={nameOwner}
                onChange={({ target }) => {
                  setOwnerName(target.value)
                }}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="CPF do responsável"
                type="text"
                name="cpf"
                width="100%"
                value={CPF}
                onChange={({ target }) => {
                  setCPF(target.value)
                }}
              />
              {/* <Input
                label="Data de nascimento"
                type="date"
                name="dataNascimento"
                width="40%"
                value={.birthday}
                onChange={({ target }) => {
                  setBirthday(target.value)
                }}
              /> */}
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

            <div className={styles.divider}></div>

            <TextArea
              label="Sobre"
              name="sobre"
              value={about}
              onChange={({ target }) => {
                setAbout(target.value)
              }}
            />

            <div className="input-block">
              <label className={styles.label} htmlFor="images">
                Fotos
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
                id="image[]"
              />
            </div>

            <Button type="submit">Salvar</Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
