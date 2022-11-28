import styles from './Shelter.module.css'

import Modal from 'react-modal'

import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { Breadcrumb } from '../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../components/Profiles/Avatar'
import { DonationsTable } from '../../../../components/Profiles/DonationsTable'
import { Link, useParams } from 'react-router-dom'
import { ProductTable } from '../../../../components/Profiles/ProductTable'
import { FormEvent, useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'

import usePrivateApi from '../../../../hooks/useAxiosPrivate'
import { PersonType } from '../../../../types/Person'
import { ShelterType } from '../../../../types/Shelter'
import { AboutShelter } from '../../../../components/Profiles/AboutShelter'
import { DonationsCounter } from '../../../../components/Profiles/DonationsCounter'

import { ReactComponent as CloseIcon } from '../../../../assets/Close-Icon.svg'
import { Input } from '../../../../components/Forms/Input'
import { Button } from '../../../../components/Forms/Button'

export function ShelterProfile() {
  const { id } = useParams()
  const { auth } = useAuth()
  const api = usePrivateApi()
  const [user, setUser] = useState<ShelterType>()
  const [modal, setModal] = useState(false)
  const [donation, setDonation] = useState('')
  const [shelterId, setShelterId] = useState('')

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

  function openModal() {
    setModal(true)
  }

  function closeModal() {
    setModal(false)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    try {
      await api.post(`/donation`, { shelterId: id })
      alert('Doação cadastrada com sucesso')
      closeModal()
    } catch (e) {
      console.log('Doação não realizada')
    }
  }

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

            <div className={styles.buttonsContainer}>
              {auth?.id == user?.id && (
                <Link className={styles.button} to="edit">
                  Editar perfil
                </Link>
              )}

              {auth?.id != user?.id && (
                <button onClick={openModal} className={styles.buttonDonation}>
                  Fazer Doação
                </button>
              )}
            </div>
          </div>
          <div className={styles.qtdDonationsContainer}>
            {user && <DonationsCounter total={user.donations} />}
          </div>
          {auth?.id != user?.id && (
            <Modal
              isOpen={modal}
              onRequestClose={closeModal}
              className={styles.modal}
              ariaHideApp={false}
            >
              <div className={styles.headerModal}>
                <h2>Realizar Doação</h2>
                <button className={styles.iconButton} onClick={closeModal}>
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <Button type="submit">Confirmar Doação</Button>
              </form>
            </Modal>
          )}
          {user && <AboutShelter about={user.about} images={user.images} />}
          {user && <DonationsTable donations={user?.donations} />}
        </div>
      </div>
      <Footer />
    </>
  )
}
