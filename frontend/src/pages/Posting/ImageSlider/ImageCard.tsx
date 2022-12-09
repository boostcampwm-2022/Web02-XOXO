import React from 'react'
import { IImageCard } from './types'

const ImageCard = ({ src }: IImageCard) => {
  return (
    <div key={src} className="image-container">
      <div>
        <img src={src} />
      </div>
    </div>
  )
}

export default ImageCard
