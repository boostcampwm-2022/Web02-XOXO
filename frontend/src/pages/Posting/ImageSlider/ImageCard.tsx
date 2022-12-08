import React from 'react'
interface IImageCard {
  src: string
}
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
