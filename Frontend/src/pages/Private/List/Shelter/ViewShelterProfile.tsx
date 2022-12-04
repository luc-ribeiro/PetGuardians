import styles from './ViewShelterProfile.module.css'

import Modal from 'react-modal'
import ReactLoading from 'react-loading'

import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { Breadcrumb } from '../../../../components/Profiles/Breadcrumb'
import { Avatar } from '../../../../components/Profiles/Avatar'
import { Link, useParams } from 'react-router-dom'
import { FormEvent, useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'

import usePrivateApi from '../../../../hooks/useAxiosPrivate'
import { ShelterType } from '../../../../types/Shelter'
import { AboutShelter } from '../../../../components/Profiles/AboutShelter'
import { DonationsCounter } from '../../../../components/Profiles/DonationsCounter'

import { ReactComponent as CloseIcon } from '../../../../assets/Close-Icon.svg'
import { Input } from '../../../../components/Forms/Input'
import { Button } from '../../../../components/Forms/Button'
import { formatCep } from '../../../../utils/stringFormatter'

export function ViewShelterProfile() {
  const { id } = useParams()
  const { auth } = useAuth()
  const api = usePrivateApi()
  const [modal, setModal] = useState(false)
  const [shelter, setShelter] = useState<ShelterType>()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get(`shelter/${id}`).then(response => {
      setShelter(response.data)
      setLoading(false)
    })
  }, [id])

  function openModal() {
    setModal(true)
  }

  function closeModal() {
    setModal(false)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    try {
      await api.post(`/donation`, shelter?.id)
      alert('Doação cadastrada com sucesso')
      closeModal()
    } catch (e) {
      console.log('Doação não realizada')
    }
  }

  return (
    <>
      <Header />
      {loading ? (
        <ReactLoading className={styles.loading} type="spin" color="#067380" />
      ) : (
        <div className={`${styles.container} container`}>
          <div className={styles.imageContainer}>
            <Breadcrumb type="Abrigos" to={shelter?.fantasyName} />
            <Avatar
              src={
                shelter?.profilePicture &&
                `data:${shelter?.profilePictureMimeType};base64,${shelter?.profilePicture}`
              }
            />
          </div>
          <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
              <h1 className={styles.userName}>{shelter?.fantasyName}</h1>
              <p className={styles.userCity}>
                {shelter?.street} {shelter?.streetNumber}, {shelter?.district},
                CEP {formatCep(shelter?.cep || '')}, {shelter?.city} -{' '}
                {shelter?.uf}
              </p>

              <div className={styles.buttonsContainer}>
                {auth?.id == shelter?.id && (
                  <Link className={styles.button} to="edit">
                    Editar perfil vieww
                  </Link>
                )}

                {auth?.id != shelter?.id && (
                  <button onClick={openModal} className={styles.buttonDonation}>
                    Fazer Doação
                  </button>
                )}
              </div>
            </div>
            <div className={styles.qtdDonationsContainer}>
              {shelter && (
                <DonationsCounter
                  donations={shelter.donations}
                  type="recebidas"
                />
              )}
            </div>
            {auth?.id != shelter?.id && (
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
                  <p className={styles.pixLabel}>
                    Após clicar em confirmar, realize o pagamento com o valor
                    desejado utilizando seu banco de preferência e aguarde até o
                    abrigo aprovar o recebimento :]
                  </p>
                  <p className={styles.pix}>Chave PIX: {shelter?.keyPIX}</p>
                  <Button type="submit">Confirmar Doação</Button>
                </form>
              </Modal>
            )}
            {shelter && (
              <AboutShelter about={shelter.about} images={shelter.images} />
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}
