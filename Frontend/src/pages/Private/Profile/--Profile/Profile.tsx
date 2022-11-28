import styles from './Profile.module.css'

import { Link } from 'react-router-dom'

import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { Breadcrumb } from '../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../components/Profiles/Avatar'
import { AboutShelter } from '../../../../components/Profiles/AboutShelter'
import { ProductTable } from '../../../../components/Profiles/ProductTable'
import { PartnerTable } from '../../../../components/Profiles/PartnerTable'
import { Table } from '../../../../components/Profiles/Table'
import useAuth from '../../../../hooks/useAuth'
import { useEffect, useState } from 'react'
import usePrivateApi from '../../../../hooks/useAxiosPrivate'
import { PersonType } from '../../../../types/Person'

export function Profile() {
  const { auth } = useAuth()
  const api = usePrivateApi()
  const [user, setUser] = useState({} as PersonType)

  useEffect(() => {
    var isMounted = true
    const abortController = new AbortController()

    const fetchProfile = async () => {
      try {
        const response = await api.get(
          `${auth?.role.toLowerCase()}/${auth?.id}`,
          { signal: abortController.signal },
        )
        isMounted && setUser(response.data)
      } catch (error) {}
    }

    fetchProfile()

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Abrigos" to={user.name} />
          <Avatar />
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <h1 className={styles.userName}>{user.name}</h1>
            <p className={styles.userCity}>
              {user.street} {user.streetNumber}, {user.district}, CEP {user.cep}
              , {user.city} - {user.uf}
            </p>

            <Link className={styles.button} to="editar">
              Editar perfil
            </Link>
          </div>
          <div className={styles.qtdDonationsContainer}>
            {!userPartner && <DonationsCounter />}
          </div>

          <AboutShelter about={user.about} />

          {user.name == 'Abrigo' && (
            <>
              <ProductTable />
              <PartnerTable />
            </>
          )}

          {!userPartner && <DonationsTable />}
          {userPartner && <CouponTable />}
        </div>
      </div>
      <Footer />
    </>
  )
}
