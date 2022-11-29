import styles from './Shelter.module.css'

import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { Breadcrumb } from '../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../components/Profiles/Avatar'
import { DonationsTable } from './Donation/DonationsTable'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'

import usePrivateApi from '../../../../hooks/useAxiosPrivate'

import { ShelterType } from '../../../../types/Shelter'
import { AboutShelter } from '../../../../components/Profiles/AboutShelter'
import { DonationsCounter } from '../../../../components/Profiles/DonationsCounter'

export function ShelterProfile() {
  const { auth } = useAuth()
  const api = usePrivateApi()
  const [user, setUser] = useState<ShelterType>()

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
          <Breadcrumb type="Abrigos" to={user?.fantasyName} />
          <Avatar src={auth?.profilePicture} />
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <h1 className={styles.userName}>{user?.fantasyName}</h1>
            <p className={styles.userCity}>
              {user?.street} {user?.streetNumber}, {user?.district}, CEP{' '}
              {user?.cep}, {user?.city} - {user?.uf}
            </p>

            <div className={styles.buttonsContainer}>
              {auth?.id == user?.id && (
                <Link className={styles.button} to="edit">
                  Editar perfil
                </Link>
              )}
            </div>
          </div>
          <div className={styles.qtdDonationsContainer}>
            {user && <DonationsCounter total={user.donations} />}
          </div>

          {user && <AboutShelter about={user.about} images={user.images} />}
          {user && <DonationsTable donations={user.donations} />}
        </div>
      </div>
      <Footer />
    </>
  )
}
