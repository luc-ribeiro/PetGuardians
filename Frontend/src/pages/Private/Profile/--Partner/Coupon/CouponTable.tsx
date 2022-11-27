import { FormEvent, useContext, useState } from 'react'
import Modal from 'react-modal'
import { Button } from '../../../../../components/Forms/Button'
import { Input } from '../../../../../components/Forms/Input'
import { ReactComponent as CloseIcon } from '../../../../../assets/Close-Icon.svg'
import { ReactComponent as EditIcon } from '../../../../../assets/Edit-Icon.svg'
import styles from './CouponTable.module.css'
import { api } from '../../../../../services/api'
import { AuthContext } from '../../../../../contexts/Auth/AuthContext'
import { Select } from '../../../../../components/Forms/Select'

export function CouponTable() {
  const auth = useContext(AuthContext)
  const { user } = auth

  const [modalIsOpen, setIsOpen] = useState(false)
  const [editModalIsOpen, setEditIsOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [isActive, setIsActive] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function openEditModal() {
    setEditIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  function closeEditModal() {
    setEditIsOpen(false)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const accessToken = localStorage.getItem('authToken')

    console.log(couponCode)

    try {
      await api.post(
        'partner/coupon',
        { code: couponCode },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        },
      )
      alert('Cadastro de cupom realizado com sucesso')
      closeModal()
    } catch (e) {
      console.log('Cadastro de cupom não realizado')
    }
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h3>Cupons Cadastrados</h3>
        <button onClick={openModal} className={styles.buttonAdd}>
          Cadastrar Cupom
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Código</th>

            <th>Ativo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ABRIGO2022</td>

            <td>Sim</td>
            <td>
              <button className={styles.iconButton} onClick={openEditModal}>
                <EditIcon />
              </button>
            </td>
          </tr>
          <tr>
            <td>DESCONTO10</td>

            <td>Não</td>
            <td>
              <button className={styles.iconButton} onClick={openEditModal}>
                <EditIcon />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className={styles.modal}
        >
          <div className={styles.headerModal}>
            <h2>Cadastrar Cupom</h2>
            <button className={styles.iconButton} onClick={closeModal}>
              <CloseIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Código Cupom"
              type="text"
              name="couponCode"
              onChange={({ target }) => setCouponCode(target.value)}
              value={couponCode}
            />
            <Button type="submit">Cadastrar</Button>
          </form>
        </Modal>
      </div>

      <div>
        <Modal
          isOpen={editModalIsOpen}
          onRequestClose={closeEditModal}
          className={styles.modal}
        >
          <div className={styles.headerModal}>
            <h2>Editar Cupom</h2>
            <button className={styles.iconButton} onClick={closeEditModal}>
              <CloseIcon />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Código Cupom"
              type="text"
              name="couponCode"
              onChange={({ target }) => setCouponCode(target.value)}
              value={couponCode}
            />

            <Select
              name="active"
              label="Ativo"
              value={isActive}
              onChange={({ target }) => setIsActive(target.value)}
              options={[
                { value: true, label: 'Sim' },
                { value: false, label: 'Não' },
              ]}
            />
            <Button type="submit">Alterar</Button>
          </form>
        </Modal>
      </div>
    </div>
  )
}
