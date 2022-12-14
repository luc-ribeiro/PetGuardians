import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { api } from '../../../../services/api'

import styles from './PartnerList.module.css'

import AvatarImage from '../../../../assets/avatar-img.jpg'

import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { Input } from '../../../../components/Forms/Input'
import { Select } from '../../../../components/Forms/Select'

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

export function PartnerList() {
  const [partners, setPartners] = useState([])

  const [partnerName, setPartnerName] = useState('')
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      )
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla)
        setUfs(ufInitials)
      })
  }, [])

  useEffect(() => {
    // Carregar as cidades sempre que a UF mudar
    if (selectedUf === '0') {
      return
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
      )
      .then(response => {
        const cityNames = response.data.map(city => city.nome)
        setCities(cityNames)
      })
  }, [selectedUf])

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value
    setSelectedUf(uf)
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value
    setSelectedCity(city)
  }

  async function searchPartners(e: FormEvent) {
    e.preventDefault()

    const response = await api.get('partner', {
      params: {
        name: partnerName,
        uf: selectedUf,
        city: selectedCity,
      },
    })

    setPartners(response.data)
  }

  return (
    <>
      <Header />

      <div className={styles.headerContainer}>
        <div className={`${styles.headerWrapper} container`}>
          <h1>Parceiros</h1>
          <p>Encontre nossos parceiros </p>
        </div>

        <div className={styles.search}>
          <form onSubmit={searchPartners}>
            <Input
              type="text"
              name="nome"
              label="Nome do parceiro (opcional)"
              value={partnerName}
              placeholder="Pesquisar"
              onChange={({ target }) => {
                setPartnerName(target.value)
              }}
            />

            <Select
              name="uf"
              label="UF"
              value={selectedUf}
              onChange={handleSelectedUf}
              options={ufs.map(uf => ({
                label: uf,
                value: uf,
              }))}
            />

            <Select
              name="city"
              label="Cidade"
              value={selectedCity}
              onChange={handleSelectedCity}
              options={cities.map(city => ({
                label: city,
                value: city,
              }))}
            />

            <button type="submit" className={styles.button}>
              Buscar
            </button>
          </form>
        </div>
      </div>

      <main className={`${styles.mainWrapper} container`}>
        {partners.map((partner: any) => {
          return (
            <div className={styles.partner}>
              <Link to={`/partner/${partner.id}`} key={partner.id}>
                <div>
                  {partner.profilePicture ? (
                    <img
                      src={`data:${partner.profilePictureMimeType};base64,${partner.profilePicture}`}
                    />
                  ) : (
                    <img src={AvatarImage} />
                  )}
                </div>
                <div className={styles.partnerInfo}>
                  <p className={styles.partnerName}>{partner.fantasyName}</p>
                  <p className={styles.partnerCity}>
                    {partner.city} - {partner.uf}
                  </p>
                </div>
              </Link>
            </div>
          )
        })}
      </main>

      <Footer />
    </>
  )
}
