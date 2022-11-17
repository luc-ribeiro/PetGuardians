import styles from './EditShelter.module.css'

import { Link } from 'react-router-dom'

import { ReactComponent as IconBack } from '../../../assets/icon-back.svg'

import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { Breadcrumb } from '../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../components/Profiles/Avatar'

import { Input } from '../../../components/Forms/Input'
import { Select } from '../../../components/Forms/Select'
import { TextArea } from '../../../components/Forms/TextArea'
import { Button } from '../../../components/Forms/Button'
import { ChangeEvent, useEffect, useState } from 'react'

export function EditShelterProfile() {
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

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

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return
    }
    const selectedImages = Array.from(event.target.files)

    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image)
    })
    setPreviewImages(selectedImagesPreview)
  }

  return (
    <>
      <Header />
      <div className={`${styles.container} container`}>
        <div className={styles.imageContainer}>
          <Breadcrumb />
          <Avatar />
          <button className={styles.button}>Trocar foto</button>
        </div>
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <Link to="/perfil/abrigo">
              <IconBack />
            </Link>
            <h1>Editar perfil</h1>
          </div>

          <form className={styles.form}>
            <div className={styles.row}>
              <Input label="Nome do abrigo" type="text" name="nomeAbrigo" />
            </div>

            <div className={styles.row}>
              <Input
                label="Nome completo do responsável pelo abrigo"
                type="text"
                name="nomeResponsavelAbrigo"
              />
            </div>

            <div className={styles.row}>
              <Input
                label="CPF do responsável"
                type="text"
                name="cpf"
                width="100%"
              />
              <Input
                label="Data de nascimento"
                type="date"
                name="dataNascimento"
                width="40%"
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input label="CEP" type="text" name="cep" width="28%" />

              <Select
                name="uf"
                label="UF"
                value={selectedUf}
                onChange={handleSelectedUf}
                options={ufs.map(uf => ({ label: uf, value: uf }))}
                width="20%"
              />

              <Select
                name="city"
                label="Cidade"
                value={selectedCity}
                onChange={handleSelectedCity}
                options={cities.map(city => ({ label: city, value: city }))}
                width="50%"
              />
            </div>

            <div className={styles.row}>
              <Input label="Endereço" type="text" name="endereco" />
            </div>

            <div className={styles.row}>
              <Input
                label="Número"
                type="text"
                name="enderecoNumero"
                width="30%"
              />

              <Input label="Bairro" type="text" name="enderecoBairro" />

              <Input
                label="Complemento"
                type="text"
                name="enderecoComplemento"
              />
            </div>

            <div className={styles.divider}></div>

            <div className={styles.row}>
              <Input label="E-mail" type="email" name="email" />

              <Input label="Senha" type="password" name="senha" />
            </div>

            <div className={styles.divider}></div>

            <TextArea label="Sobre" name="sobre" />

            <div className="input-block">
              <label className={styles.label} htmlFor="images">
                Fotos
              </label>

              <div className={styles.imageContainer}>
                {previewImages.map(image => {
                  return <img key={image} src={image} alt=""></img>
                })}
                <label htmlFor="image[]" className={styles.newImage}>
                  +
                </label>
              </div>
              <input
                multiple
                onChange={handleSelectImages}
                type="file"
                id="image[]"
              />
            </div>

            <Button type="submit">Salvar</Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}
