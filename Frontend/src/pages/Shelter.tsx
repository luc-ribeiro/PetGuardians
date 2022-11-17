import styles from './Shelter.module.css'

import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Input } from '../components/Forms/Input'
import { ChangeEvent, useEffect, useState } from 'react'
import { Select } from '../components/Forms/Select'

import ImgShelter from '../assets/avatar-shelter-img.jpg'
import { Link } from 'react-router-dom'

export function Shelter() {
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        const ufInitials = data.map((uf: { sigla: string }) => uf.sigla)
        setUfs(ufInitials)
      })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }

    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
    )
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw response
      })
      .then(data => {
        const cityNames = data.map((city: { nome: string }) => city.nome)
        setCities(cityNames)
      })
  }, [selectedUf])

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value

    if (uf == '0') {
      return
    }
    setSelectedUf(uf)
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value
    setSelectedCity(city)
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
          <form action="">
            <Input type="text" name="nome" label="Nome do abrigo" />
            <Select
              name="uf"
              label="UF"
              value={selectedUf}
              onChange={handleSelectedUf}
              options={ufs.map(uf => ({ label: uf, value: uf }))}
            />

            <Select
              name="city"
              label="Cidade"
              value={selectedCity}
              onChange={handleSelectedCity}
              options={cities.map(city => ({ label: city, value: city }))}
            />

            <button type="submit" className={styles.button}>
              Buscar
            </button>
          </form>
        </div>
      </div>

      <main className={`${styles.mainWrapper} container`}>
        <div className={styles.shelter}>
          <Link to="/">
            <div>
              <img src={ImgShelter} alt="" />
            </div>
            <div className={styles.shelterInfo}>
              <p className={styles.shelterName}>Quatro Patas</p>
              <p className={styles.shelterCity}>São José do Rio Preto - SP</p>
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
