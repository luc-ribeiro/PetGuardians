import { FormEvent, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { Button } from '../../../../../components/Forms/Button'
import { Input } from '../../../../../components/Forms/Input'
import { ReactComponent as CloseIcon } from '../../../../../assets/Close-Icon.svg'
import { ReactComponent as EditIcon } from '../../../../../assets/Edit-Icon.svg'
import styles from './CouponTable.module.css'
import { Select } from '../../../../../components/Forms/Select'
import usePrivateApi from '../../../../../hooks/useAxiosPrivate'
import useAuth from '../../../../../hooks/useAuth'
import { PartnerType } from '../../../../../types/Partner'

export function CouponTable({ user }: { user: PartnerType }) {
  const { auth } = useAuth()
  const api = usePrivateApi()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [editModalIsOpen, setEditIsOpen] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [coupons, setCoupons] = useState('')

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

  function handleChange({ target }: any) {
    if (target.checked) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    try {
      await api.post(`${auth?.role}/coupon`, { code: couponCode })
      alert('Cadastro de cupom realizado com sucesso')
      closeModal()
    } catch (e) {
      console.log('Cadastro de cupom não realizado')
    }
  }

  async function handleEditSubmit(event: any) {
    event.preventDefault()

    try {
      await api.patch(`${auth?.role}/coupon/${event.target[0].value}`, {
        code: event.target[1].value,
        active: event.target[2].value,
      })
      alert('Cupom alterado com sucesso')
      closeModal()
    } catch (e) {
      console.log('Cupom não alterado')
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
          {user.coupons &&
            user.coupons.map(coupon => (
              <>
                <tr key={coupon.id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.active ? 'Ativo' : 'Inativo'}</td>
                  <td>
                    <button
                      className={styles.iconButton}
                      onClick={openEditModal}
                    >
                      <EditIcon />
                    </button>
                  </td>
                </tr>
                {console.log(coupon)}

                <Modal
                  isOpen={editModalIsOpen}
                  onRequestClose={closeEditModal}
                  className={styles.modal}
                  ariaHideApp={false}
                >
                  <div className={styles.headerModal}>
                    <h2>Editar Cupom</h2>
                    <button
                      className={styles.iconButton}
                      onClick={closeEditModal}
                    >
                      <CloseIcon />
                    </button>
                  </div>

                  <form onSubmit={handleEditSubmit}>
                    <input type="hidden" name="id" value={coupon.id} />
                    <Input
                      label="Código Cupom"
                      type="text"
                      name="code"
                      onChange={event => setCouponCode(event.target.value)}
                      value={couponCode}
                    />
                    <label>
                      <input
                        type="checkbox"
                        value="active"
                        checked={isActive}
                        onChange={handleChange}
                      />
                      Ativo
                    </label>
                    <Button type="submit">Alterar</Button>
                  </form>
                </Modal>
              </>
            ))}
        </tbody>
      </table>

      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className={styles.modal}
          ariaHideApp={false}
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
              name="code"
              onChange={event => setCouponCode(event.target.value)}
              value={couponCode}
            />
            <Button type="submit">Cadastrar</Button>
          </form>
        </Modal>
      </div>

      <div></div>
    </div>
  )
}
