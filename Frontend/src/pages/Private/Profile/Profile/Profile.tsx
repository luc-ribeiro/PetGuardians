import styles from './Profile.module.css'
import { api } from '../../../../services/api'

import { Link, useParams } from 'react-router-dom'

import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { Breadcrumb } from '../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../components/Profiles/Avatar'
import { AboutShelter } from '../../../../components/Profiles/AboutShelter'
import { ProductTable } from '../../../../components/Profiles/ProductTable'
import { PartnerTable } from '../../../../components/Profiles/PartnerTable'
import { DonationsTable } from '../../../../components/Profiles/DonationsTable'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../contexts/Auth/AuthContext'
import { Login } from '../../../Login'
import { CouponTable } from '../--Partner/Coupon/CouponTable'
import { DonationsCounter } from '../../../../components/Profiles/DonationsCounter'

export function Profile() {
  const auth = useContext(AuthContext)
  const { user } = auth

  const [userShelter, setUserShelter] = useState(false)
  const [userDonor, setUserDonor] = useState(false)
  const [userPartner, setUserPartner] = useState(false)
  const [type, setType] = useState('')

  if (!user) {
    return <Login />
  }

  useEffect(() => {
    if (user) {
      if (user.role == 'Shelter') {
        setUserShelter(true)
        setType('Abrigo')
      } else if (user.role == 'Donor') {
        setUserDonor(true)
        setType('Doador')
      } else if (user.role == 'Partner') {
        setUserPartner(true)
        setType('Parceiro')
      }
    }
  }, [])

  console.log(user)

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          {userShelter && (
            <Breadcrumb type={type} to={user.shelter.fantasyName} />
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
            <h1 className={styles.userName}>
              {userShelter && user.shelter.fantasyName}
              {userDonor && user.person.name}
              {userPartner && user.partner.fantasyName}
            </h1>
            <p className={styles.userCity}>
              {user.person.street} {user.person.streetNumber},{' '}
              {user.person.district}, CEP {user.person.cep}, {user.person.city}{' '}
              - {user.person.uf}
              {userPartner && (
                <Link className={styles.linkPartner} to={user.partner.linkSite}>
                  Site: {user.partner.linkSite}
                </Link>
              )}
            </p>

            <Link className={styles.button} to="editar">
              Editar perfil
            </Link>
          </div>
          <div className={styles.qtdDonationsContainer}>
            {!userPartner && <DonationsCounter />}
          </div>
          {userShelter && (
            <AboutShelter
              about={user.shelter.about}
              images={user.person.images}
              // type={user.person.images.mimeType}
            />
          )}

          {!userPartner && <DonationsTable />}
          {userPartner && <CouponTable />}
        </div>
      </div>
      <Footer />
    </>
  )
}
