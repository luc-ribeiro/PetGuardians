import styles from './Partner.module.css'

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
import { CouponTable } from './Coupon/CouponTable'
import { PartnerType } from '../../../../types/Partner'

export function PartnerProfile() {
  const { auth } = useAuth()
  const api = usePrivateApi()
  const [user, setUser] = useState<PartnerType>()

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
          <Breadcrumb type="Parceiros" to={user?.fantasyName} />
          <Avatar src={user?.profilePicture} />
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <h1 className={styles.userName}>{user?.fantasyName}</h1>
            <p className={styles.userCity}>
              {user?.street} {user?.streetNumber}, {user?.district}, CEP{' '}
              {user?.cep}, {user?.city} - {user?.uf}
              <Link className={styles.linkPartner} to={user?.linkSite}>
                Site: {user?.linkSite}
              </Link>
            </p>

            {auth?.id == user?.id && (
              <Link className={styles.button} to="edit">
                Editar perfil
              </Link>
            )}
          </div>

          {user && <CouponTable user={user} />}
        </div>
      </div>
      <Footer />
    </>
  )
}
