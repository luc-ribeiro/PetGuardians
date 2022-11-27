import styles from './Partner.module.css'

import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { Breadcrumb } from '../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../components/Profiles/Avatar'
import { DonationsTable } from '../../../../components/Profiles/DonationsTable'
import { Link, useParams } from 'react-router-dom'
import { ProductTable } from '../../../../components/Profiles/ProductTable'
import { useEffect, useState } from 'react'
import { api } from '../../../../services/api'

interface Partner {
  id: number
  name: string
  fantasyName: string
  cnpj: string
  uf: string
  city: string
  cep: string
  street: string
  streetNumber: string
  district: string
  complement: string
}

interface PartnerParams {
  id: string
}

export function PartnerProfile() {
  const params = useParams<string>()
  const [partner, setPartner] = useState<Partner>()

  // useEffect(() => {
  //   api.get(`partner/${params.id}`).then(response => {
  //     setPartner(response.data)
  //   })
  // }, [params.id])

  // if (!partner) {
  //   return <p>Carregando...</p>
  // }

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb type="Parceiro" to={'/'} />
          <Avatar />
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <h1 className={styles.userName}>Elaine Silva</h1>
            <p className={styles.userCity}>São José do Rio Preto, SP</p>
            <Link className={styles.button} to="editar">
              Editar Perfil
            </Link>
            <Link className={styles.button} to="produtos/cadastrar">
              Cadastrar Produtos
            </Link>
          </div>
          <DonationsTable />
          <ProductTable />
        </div>
      </div>
      <Footer />
    </>
  )
}
