import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as yup from 'yup'
import useAuth from '../../../../../hooks/useAuth'
import usePrivateApi from '../../../../../hooks/useAxiosPrivate'

import styles from './EditPartner.module.css'

import { Header } from '../../../../../components/Header'
import { Breadcrumb } from '../../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../../components/Profiles/Avatar'
import { ReactComponent as IconBack } from '../../../../../assets/icon-back.svg'
import { Input } from '../../../../../components/Forms/Input'
import { Select } from '../../../../../components/Forms/Select'
import { Button } from '../../../../../components/Forms/Button'
import { Footer } from '../../../../../components/Footer'
import { Login } from '../../../../Login'

import { PartnerType } from '../../../../../types/Partner'
import { CEPQueryResponse } from '../../../../../types/CEP'
import { CNPJQueryResponse } from '../../../../../types/CNPJ'
import { IBGEUFResponse } from '../../../../../types/UF'
import { IBGECityResponse } from '../../../../../types/City'
import { formatCnpj } from '../../../../../utils/CNPJ'
import { formatTelephone } from '../../../../../utils/Telephone'
import { formatCep } from '../../../../../utils/cep'

interface Cities {
  [key: string]: string[]
}
export function EditPartnerProfile() {
  const { auth } = useAuth()
  const api = usePrivateApi()
  const profileRef = useRef<HTMLInputElement>(null)

  const navigate = useNavigate()

  const [partner, setPartner] = useState({} as PartnerType)

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<Cities>({})

  const [cleanCnpj, setCleanCnpj] = useState('')
  const [cleanCep, setCleanCep] = useState('')
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  const [previewImage, setPreviewImage] = useState('')

  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  useEffect(() => {
    var isMounted = true
    const abortController = new AbortController()
    const fetchProfile = async () => {
      try {
        const response = await api.get(`partner/${auth?.id}`, {
          signal: abortController.signal,
        })
        isMounted && setPartner(response.data)
      } catch (error) {}
    }
    const fetchEstados = async () => {
      const response = (
        await axios.get<IBGEUFResponse[]>(
          'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
          { signal: abortController.signal },
        )
      ).data
      isMounted && setUfs(response.map(uf => uf.sigla))
    }
    fetchProfile()
    fetchEstados()
    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  const valueInput = (e: any) =>
    setPartner({ ...partner, [e.target.name]: e.target.value })

  useEffect(() => {
    var isMounted = true
    const abort = new AbortController()
    const fetchRazaoSocial = async () => {
      const response = (
        await axios.get<CNPJQueryResponse>(
          `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`,
          { signal: abort.signal },
        )
      ).data
      isMounted &&
        setPartner(prev => ({
          ...prev,
          name: response?.razao_social,
          fantasyName: response?.nome_fantasia,
        }))
    }
    cleanCnpj.length == 14 && fetchRazaoSocial()
    return () => {
      isMounted = false
      abort.abort()
    }
  }, [cleanCnpj])

  useEffect(() => {
    var isMounted = true
    const abort = new AbortController()
    const fetchAddress = async () => {
      const response = (
        await axios.get<CEPQueryResponse>(
          `https://brasilapi.com.br/api/cep/v2/${cleanCep}`,
          { signal: abort.signal },
        )
      ).data
      isMounted &&
        setPartner(prev => ({
          ...prev,
          street: response.street,
          district: response.neighborhood,
          uf: response.state,
          city: response.city,
        }))
    }
    cleanCep.length == 8 && fetchAddress()
    return () => {
      isMounted = false
      abort.abort()
    }
  }, [cleanCep])

  useEffect(() => {
    if (!partner.uf || cities[partner.uf]) {
      return
    }
    var isMounted = true
    const abort = new AbortController()
    const fetchCities = async () => {
      const response = (
        await axios.get<IBGECityResponse[]>(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${partner.uf}/municipios`,
          { signal: abort.signal },
        )
      ).data
      isMounted &&
        setCities(prev => ({
          ...prev,
          [partner.uf]: response.map(city => city.nome),
        }))
    }
    fetchCities()
    return () => {
      isMounted = false
      abort.abort()
    }
  }, [partner.uf])

  function handleCnpjChange(event: ChangeEvent<HTMLInputElement>) {
    const [cleanCnpj, formattedCnpj] = formatCnpj(event.target.value)
    setCleanCnpj(cleanCnpj)
    setPartner({ ...partner, gcg: formattedCnpj })
  }
  function handleCepChange(event: ChangeEvent<HTMLInputElement>) {
    const [cleanCep, formatetedCep] = formatCep(event.target.value)
    setCleanCep(cleanCep)
    setPartner(prev => ({ ...prev, cep: formatetedCep }))
  }

  function handleTelephoneChange(event: ChangeEvent<HTMLInputElement>) {
    const formattedTelephone = formatTelephone(event.target.value)
    setPartner({ ...partner, ['telephone']: formattedTelephone })
  }

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    setPartner(prev => ({ ...prev, uf: event.target.value }))
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    setPartner(prev => ({ ...prev, city: event.target.value }))
  }

  function handleSelectImage(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }
    const selectedImage = event.target.files.item(0)
    if (selectedImage) {
      setProfilePicture(selectedImage)
      setPreviewImage(URL.createObjectURL(selectedImage))
      console.log(URL.createObjectURL(selectedImage))
    }
  }

  async function validate() {
    let schema = yup.object().shape({
      street: yup.string().required('Erro: Necessário preencher o nome da rua'),
      cep: yup.string().required('Erro: Necessário preencher o CEP'),
      telephone: yup.string().required('Erro: Necessário preencher o telefone'),
      fantasyName: yup
        .string()
        .required('Erro: Necessário preencher o nome fantasia'),
      gcg: yup.string().required('Erro: Necessário preencher o CNPJ'),
      name: yup.string().required('Erro: Necessário preencher o campo nome'),
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!(await validate())) return

    const data = new FormData()

    Object.entries(partner).forEach(([key, value]) => {
      if (
        ![
          'cep',
          'uf',
          'city',
          'street',
          'streetNumber',
          'district',
          'complement',
          'telephone',
          'fantasyName',
          'linkSite',
        ].includes(key)
      ) {
        return
      }
      if (['gcg', 'cep', 'telephone'].includes(key)) {
        value = value.replace(/\D/g, '')
      }
      data.append(key, value)
    })
    data.append('profilePicture', profilePicture as Blob)

    try {
      await api.patch('partner', data, {
        headers: { 'Content-Type': 'application/x-www-url-formencoded' },
      })
      alert('Cadastro atualizado com sucesso')
      navigate(`/profile/partner/${auth?.id}`)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Abrigos" to={partner.fantasyName} />
          <Avatar
            src={
              partner?.profilePicture &&
              `data:${partner?.profilePictureMimeType};base64,${partner?.profilePicture}`
            }
          />
          <input
            ref={profileRef}
            onChange={handleSelectImage}
            style={{ display: 'none' }}
            type="file"
            id="input_profile_picture"
            accept=".jpeg, .png, .jpg"
          />
          <button
            className={styles.button}
            onClick={() => profileRef?.current?.click()}
          >
            Trocar foto
          </button>
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <Link to={`/profile/${auth?.role}/${auth?.id}`}>
              <IconBack />
            </Link>
            <h1>Editar perfil</h1>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <Input
                label="Razão Social"
                type="text"
                name="name"
                value={partner.name}
                onChange={valueInput}
              />

              <Input
                label="CNPJ"
                type="text"
                width="100%"
                name="gcg"
                value={partner.gcg}
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
                value={partner.cep}
                onChange={handleCepChange}
              />

              <Select
                label="UF"
                name="uf"
                value={partner.uf}
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
                value={partner.city}
                onChange={handleSelectedCity}
                options={
                  !cities[partner.uf]
                    ? [{ value: '', label: 'Selecione um Estado' }]
                    : cities[partner.uf].map(city => ({
                        label: city,
                        value: city,
                      }))
                }
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
      <Footer />
    </>
  )
}
