import moment from 'moment'
import { DonationType } from '../../../../../types/Donation'
import styles from './DonationsTable.module.css'

interface DonationTableProps {
  donations: DonationType[]
}

export function DonationsTable({ donations }: DonationTableProps) {
  console.log(donations)

  return (
    <div className={styles.tableContainer}>
      <h3>Últimas doações</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>Nome do abrigo</th>
            <th>Data</th>
            <th>Valor</th>
          </tr>
        </thead>

        <tbody>
          {!donations.length ? (
            <div style={{ textAlign: 'center' }}>Sem doações realizadas</div>
          ) : (
            donations.map(
              donation =>
                donation.approved && (
                  <tr>
                    <td>{donation.id}</td>
                    <td>{donation.shelter}</td>
                    <td>
                      {moment(donation.approvedAt).format('DD/MM/YYYY HH:mm')}
                    </td>
                    <td>R$ {donation.value}</td>
                  </tr>
                ),
            )
          )}
        </tbody>
      </table>
    </div>
  )
}
