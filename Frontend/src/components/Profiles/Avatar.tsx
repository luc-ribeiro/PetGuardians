import styles from './Avatar.module.css'

import avatarImg from '../../assets/avatar-img.jpg'

interface AvatarProps {
  type: string
  src: string
}

export function Avatar({ type, src }: AvatarProps) {
  return (
    <div className={styles.avatarWrapper}>
      {src ? (
        <img src={type + src} className={styles.avatarImg} />
      ) : (
        <img src={avatarImg} className={styles.avatarImg} />
      )}
    </div>
  )
}
