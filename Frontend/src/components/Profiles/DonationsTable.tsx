import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import usePrivateApi from '../../hooks/useAxiosPrivate'
import { DonationType } from '../../types/Donation'
import styles from './DonationsTable.module.css'

import Modal from 'react-modal'

export function DonationsTable(donations: DonationType[]) {
  const { id } = useParams()
  const api = usePrivateApi()
  const [modal, setModal] = useState(false)
  const [value, setValue] = useState(0)

  function openModal() {
    setModal(true)
  }

  function closeModal() {
    setModal(false)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    try {
      await api.patch(`/donation`, { id, value: value })
      alert('Doação cadastrada com sucesso')
      closeModal()
    } catch (e) {
      console.log('Doação não realizada')
    }
  }

  return (
    <div className={styles.tableContainer}>
      <h3>Últimas doações</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {/* {donations.map(donation => (
            <tr>
              <td>{donation.id}</td>
              <td>{donation.createdAt}</td>
              <td>R$ {donation.value}</td>
            </tr>
          ))} */}
        </tbody>
      </table>

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
    </div>
  )
}
