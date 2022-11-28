import styles from './Avatar.module.css'

import avatarImg from '../../assets/avatar-img.jpg'

interface AvatarProps {
  src?: string
}

export function Avatar({ src }: AvatarProps) {
  return (
    <div className={styles.avatarWrapper}>
      {src ? (
        <img
          src={src}
          className={styles.avatarImg}
        />
      ) : (
        <img src={avatarImg} className={styles.avatarImg} />
      )}
    </div>
  )
}
