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
import { Table } from '../../../../components/Profiles/Table'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../contexts/Auth/AuthContext'
import { Login } from '../../../Login'

export function Profile() {
  const auth = useContext(AuthContext)

  if (!auth.user) {
    return <Login />
  }

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Abrigos" to={auth.user.name} />
          <Avatar />
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <h1 className={styles.userName}>{auth.user.name}</h1>
            <p className={styles.userCity}>
              {auth.user.street} {auth.user.streetNumber}, {auth.user.district},
              CEP {auth.user.cep}, {auth.user.city} - {auth.user.uf}
            </p>
            <Link className={styles.button} to="editar">
              Editar perfil
            </Link>
          </div>
          <div className={styles.qtdDonationsContainer}>
            <p className={styles.totalDonations}>
              5 <span>doações recebidas</span>
            </p>
          </div>
          <AboutShelter about={auth.user.about} />
          {auth.user.name == 'Abrigo' && (
            <>
              <ProductTable />
              <PartnerTable />
            </>
          )}

          <Table />
        </div>
      </div>
      <Footer />
    </>
  )
}
