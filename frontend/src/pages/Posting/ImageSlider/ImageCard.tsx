import React from 'react'

const ImageCard = ({ src }: { src: string }) => {
  return (
    <div key={src} className="image-container">
      <div>
        <img src={src} />
      </div>
    </div>
  )
}

export default ImageCard
