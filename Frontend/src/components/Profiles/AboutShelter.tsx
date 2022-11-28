import styles from './AboutShelter.module.css'

import ShelterImage1 from '../../assets/shelter-image-1.jpg'
import ShelterImage2 from '../../assets/shelter-image-2.jpg'
import ShelterImage3 from '../../assets/shelter-image-3.jpg'
import ShelterImage4 from '../../assets/shelter-image-4.jpg'

interface AboutProps {
  about?: string | undefined | null
  images?: []
  type?: string
  src?: string
}

export function AboutShelter({ about, images, type, src }: AboutProps) {
  return (
    <div className={styles.aboutContainer}>
      <h3>Sobre nós</h3>

      <p className={styles.aboutText}>
        {about || 'Complete seu perfil em Editar Perfil'}
      </p>

      <div className={styles.imageContainer}>
        {images.forEach(image => (
          <img src={`data:${type};base64, ${src}`} alt="" />
        ))}
      </div>
    </div>
  )
}
