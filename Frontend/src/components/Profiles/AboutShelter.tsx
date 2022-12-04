import styles from './AboutShelter.module.css'

import ShelterImage1 from '../../assets/shelter-image-1.jpg'
import ShelterImage2 from '../../assets/shelter-image-2.jpg'
import ShelterImage3 from '../../assets/shelter-image-3.jpg'
import ShelterImage4 from '../../assets/shelter-image-4.jpg'
import { ImageType } from '../../types/Image'

interface AboutProps {
  about?: string | undefined | null
  images?: ImageType[]
}

export function AboutShelter({ about, images }: AboutProps) {
  return (
    <div className={styles.aboutContainer}>
      <h3>Sobre nós</h3>

      <p className={styles.aboutText}>
        {about || 'Complete seu perfil em Editar Perfil'}
      </p>

      <div className={styles.imageContainer}>
        {images?.map(image => (
          <img src={`data:${image.mimeType};base64, ${image.base64}`} alt="" />
        ))}
      </div>
    </div>
  )
}
