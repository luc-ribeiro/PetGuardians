import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { api } from '../../../../services/api'

import styles from './ShelterList.module.css'

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

export function ShelterList() {
  const [shelters, setShelters] = useState([])

  const [shelterName, setShelterName] = useState('')
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

  async function searchShelters(e: FormEvent) {
    e.preventDefault()

    const response = await api.get('shelter', {
      params: {
        name: shelterName,
        uf: selectedUf,
        city: selectedCity,
      },
    })

    setShelters(response.data)
  }

  return (
    <>
      <Header />

      <div className={styles.headerContainer}>
        <div className={`${styles.headerWrapper} container`}>
          <h1>Abrigos</h1>
          <p>Faça uma busca dos abrigos disponíveis</p>
        </div>

        <div className={styles.search}>
          <form onSubmit={searchShelters}>
            <Input
              type="text"
              name="nome"
              label="Nome do abrigo"
              value={shelterName}
              placeholder="Pesquisar"
              onChange={({ target }) => {
                setShelterName(target.value)
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
        <div className={styles.shelter}>
          {shelters.map((shelter: any) => {
            return (
              <Link to={`/profile/shelter/${shelter.id}`} key={shelter.id}>
                <div>
                  <img
                    src={`data:${shelter.profilePictureMimeType};base64,${shelter.profilePicture}`}
                    alt=""
                  />
                </div>
                <div className={styles.shelterInfo}>
                  <p className={styles.shelterName}>{shelter.fantasyName}</p>
                  <p className={styles.shelterCity}>
                    {shelter.city} - {shelter.uf}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </main>

      <Footer />
    </>
  )
}
