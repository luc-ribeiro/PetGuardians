import styles from './Shelter.module.css'

import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { Breadcrumb } from '../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../components/Profiles/Avatar'
import { DonationsTable } from '../../../../components/Profiles/DonationsTable'
import { Link, useParams } from 'react-router-dom'
import { ProductTable } from '../../../../components/Profiles/ProductTable'
import { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'

import usePrivateApi from '../../../../hooks/useAxiosPrivate'
import { PersonType } from '../../../../types/Person'
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

  console.log(auth)

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

            {auth?.id == user?.id && (
              <Link className={styles.button} to="edit">
                Editar perfil
              </Link>
            )}
          </div>
          <div className={styles.qtdDonationsContainer}>
            {user && <DonationsCounter />}
          </div>

          {/* {user && <AboutShelter />} */}
          {user && <DonationsTable />}
        </div>
      </div>
      <Footer />
    </>
  )
}
