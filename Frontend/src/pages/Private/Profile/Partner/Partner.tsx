import styles from './Partner.module.css'

import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { Breadcrumb } from '../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../components/Profiles/Avatar'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'

import usePrivateApi from '../../../../hooks/useAxiosPrivate'
import { PersonType } from '../../../../types/Person'
import { CouponTable } from './Coupon/CouponTable'
import { PartnerType } from '../../../../types/Partner'
import { CouponType } from '../../../../types/Coupon'

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

  const updateCoupon = (coupon: CouponType) => {
    if (!user) {
      return
    }

    // Procura um cupom da tabela
    const index = user.coupons.findIndex(_coupon => _coupon.id === coupon.id)

    // Atualizando um cupom na tabela
    if (index > -1) {
      const coupons = user.coupons
      coupons[index] = coupon
      setUser(
        prev =>
          prev && {
            ...prev,
            coupons,
          },
      )
    }

    // Inserindo um cupom na tabela
    else {
      setUser(
        prev =>
          prev && {
            ...prev,
            coupons: [...prev.coupons, coupon],
          },
      )
    }
  }

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Parceiros" to={user?.fantasyName} />
          <Avatar
            src={
              user?.profilePicture &&
              `data:${user?.profilePictureMimeType};base64,${user?.profilePicture}`
            }
          />
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <h1 className={styles.userName}>{user?.fantasyName}</h1>
            <p className={styles.userCity}>
              {user?.street} {user?.streetNumber}, {user?.district}, CEP{' '}
              {user?.cep}, {user?.city} - {user?.uf}
              <Link className={styles.linkPartner} to={user?.linkSite || ''}>
                Site: {user?.linkSite}
              </Link>
            </p>

            {auth?.id == user?.id && (
              <Link className={styles.button} to="edit">
                Editar perfil
              </Link>
            )}
          </div>

          {user && (
            <CouponTable coupons={user.coupons} onSuccess={updateCoupon} />
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
