import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

import styles from './EditProfile.module.css'

import { ReactComponent as IconBack } from '../../../../../assets/icon-back.svg'

import { Header } from '../../../../../components/Header'
import { Footer } from '../../../../../components/Footer'
import { Breadcrumb } from '../../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../../components/Profiles/Avatar'

import { Input } from '../../../../../components/Forms/Input'
import { Select } from '../../../../../components/Forms/Select'
import { TextArea } from '../../../../../components/Forms/TextArea'
import { Button } from '../../../../../components/Forms/Button'
import { Profile } from '../Profile'
import { useForm } from 'react-hook-form'
import { Login } from '../../../../Login'
import useAuth from '../../../../../hooks/useAuth'

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

export function EditProfile() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [userShelter, setUserShelter] = useState(false)
  const [userDonor, setUserDonor] = useState(false)
  const [userPartner, setUserPartner] = useState(false)

  if (!user) {
    return <Login />
  }

  useEffect(() => {
    if (user) {
      if (user.role == 'Shelter') {
        setUserShelter(true)
      } else if (user.role == 'Donor') {
        setUserDonor(true)
      } else if (user.role == 'Partner') {
        setUserPartner(true)
      }
    }
  }, [])

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          {userShelter && (
            <Breadcrumb type={user.role} to={user.shelter.fantasyName} />
          )}
          {userDonor && <Breadcrumb type={user.role} to={user.person.name} />}
          {userPartner && (
            <Breadcrumb type={user.role} to={user.partner.fantasyName} />
          )}
          <Avatar
            type={user.person.profilePictureMimeType}
            src={user.person.profilePicture}
          />
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <Link to="/meuperfil">
              <IconBack />
            </Link>
            <h1>Editar perfil</h1>
          </div>

          {userShelter && <ShelterForm />}
          {userDonor && <DonorForm />}
          {userPartner && <PartnerForm />}
        </div>
      </div>
      <Footer />
    </>
  )
}
