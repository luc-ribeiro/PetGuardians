import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'

import styles from './EditProfile.module.css'

import { ReactComponent as IconBack } from '../../../../../assets/icon-back.svg'

import { Login } from '../../../../Login'

import { Header } from '../../../../../components/Header'
import { Footer } from '../../../../../components/Footer'
import { Breadcrumb } from '../../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../../components/Profiles/Avatar'

import { AuthContext } from '../../../../../contexts/Auth/AuthContext'
import { ShelterForm } from './Forms/ShelterForm'
import { DonorForm } from './Forms/DonorForm'
import { PartnerForm } from './Forms/PartnerForm'

export function EditProfile() {
  const auth = useContext(AuthContext)
  const { user } = auth

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
          <button className={styles.button}>Trocar foto</button>
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
