import styles from './Avatar.module.css'

import avatarImg from '../../assets/avatar-img.jpg'

export function Avatar() {
  return (
    <div className={styles.avatarWrapper}>
      <img src={avatarImg} className={styles.avatarImg} />
    </div>
  )
}
