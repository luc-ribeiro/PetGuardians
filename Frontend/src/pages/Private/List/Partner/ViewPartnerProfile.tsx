import styles from './ViewPartnerProfile.module.css'

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
import { CouponTable } from '../../Profile/Partner/Coupon/CouponTable'
import { PartnerType } from '../../../../types/Partner'

export function ViewPartnerProfile() {
  const { id } = useParams()
  const { auth } = useAuth()
  const api = usePrivateApi()
  const [partner, setPartner] = useState<PartnerType>()

  useEffect(() => {
    api.get(`partner/${id}`).then(response => {
      setPartner(response.data)
    })
  }, [id])

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Parceiros" to={partner?.fantasyName} />
          <Avatar src={partner?.profilePicture} />
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <h1 className={styles.userName}>{partner?.fantasyName}</h1>
            <p className={styles.userCity}>
              {partner?.street} {partner?.streetNumber}, {partner?.district},
              CEP {partner?.cep}, {partner?.city} - {partner?.uf}
              <Link className={styles.linkPartner} to={partner?.linkSite}>
                Site: {partner?.linkSite}
              </Link>
            </p>

            {auth?.id == partner?.id && (
              <Link className={styles.button} to="edit">
                Editar perfil
              </Link>
            )}
          </div>

          {partner && <CouponTable user={partner} />}
        </div>
      </div>
      <Footer />
    </>
  )
}
