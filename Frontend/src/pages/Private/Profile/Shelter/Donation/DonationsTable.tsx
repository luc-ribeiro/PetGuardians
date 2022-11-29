import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import usePrivateApi from '../../../../../hooks/useAxiosPrivate'
import { DonationType } from '../../../../../types/Donation'
import styles from './DonationsTable.module.css'
import { ReactComponent as CloseIcon } from '../../../../../assets/Close-Icon.svg'
import { ReactComponent as EditIcon } from '../../../../../assets/Edit-Icon.svg'

import Modal from 'react-modal'
import { Button } from '../../../../../components/Forms/Button'
import { Input } from '../../../../../components/Forms/Input'
import moment from 'moment'

interface DonationTableProps {
  donations: DonationType[]
  onSuccess(donation: DonationType): void
}

export function DonationsTable({ donations, onSuccess }: DonationTableProps) {
  const { id } = useParams()
  const api = usePrivateApi()
  const [donation, setDonation] = useState<DonationType | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!donation) {
      return
    }

    const value = Number(donation?.value) * 100

    try {
      await api.patch(`/donation/${donation?.id}`, value)
      alert('Doação aprovada com sucesso')
      onSuccess(donation)
    } catch (e) {
      console.log('Doação não aprovada')
    }
  }

  return (
    <div className={styles.tableContainer}>
      <h3>Últimas doações</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>Data</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {!donations.length ? (
            <div>Sem doações recebidas</div>
          ) : (
            donations.map(donation => (
              <tr key={donation.id}>
                <td>{donation.id}</td>
                {/* <td>{donation.donor.name}</td> */}
                <td>{moment(donation.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                <td>{donation.value / 100}</td>
                <td>{donation.approved ? 'Aprovada' : 'Pendente'}</td>
                <td>
                  <button
                    className={styles.iconButton}
                    onClick={() => setDonation(donation)}
                  >
                    <EditIcon />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Modal
        isOpen={!!donation}
        onRequestClose={() => setDonation(null)}
        className={styles.modal}
        ariaHideApp={false}
      >
        {donation && (
          <>
            <div className={styles.headerModal}>
              <h2>Aprovar Doação</h2>
              <button
                className={styles.iconButton}
                onClick={() => setDonation(null)}
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <Input
                label="Valor da doação"
                type="number"
                name="value"
                onChange={event =>
                  setDonation(
                    prev =>
                      prev && { ...prev, value: Number(event.target.value) },
                  )
                }
                value={donation.value}
              />
              {donation.id && (
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={donation?.approved}
                    onChange={() =>
                      setDonation(
                        prev => prev && { ...prev, approved: !prev.approved },
                      )
                    }
                  />
                  Ativo
                </label>
              )}
              <Button type="submit">Aprovar Doação</Button>
            </form>
          </>
        )}
      </Modal>
    </div>
  )
}
