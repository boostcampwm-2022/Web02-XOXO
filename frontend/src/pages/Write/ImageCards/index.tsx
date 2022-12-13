/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import { compressImage } from '@src/util/imageCompress'
import { isEmpty } from 'lodash'
import { IImage, IImageCards } from '../types'
import { ReactComponent as XIcon } from '@assets/XIcon.svg'

const ImageCards = ({ images, setImages, setPixelatedFile }: IImageCards) => {
  const handleDeleteButton = (src: string) => {
    setPixelatedFile(undefined)
    setImages((images) => {
      const newImages = images.filter(({ thumbnailSrc }: IImage) => thumbnailSrc !== src)
      return newImages
    })
  }
  return (
    <>
      {images.map(({ originalImage, thumbnailSrc, compressedImage }: IImage) => (
        <div className="image-holder" key={thumbnailSrc}>
          <div>
            <img
              className="image-holder"
              src={thumbnailSrc}
              alt={originalImage.name}
              onLoad={async (e) => {
                URL.revokeObjectURL(thumbnailSrc)
                if (isEmpty(compressedImage)) {
                  const compressedImage = await compressImage(originalImage)
                  setImages((images) => {
                    const newImages = images.map((item) => {
                      if (item.thumbnailSrc === thumbnailSrc) item.compressedImage = compressedImage
                      return item
                    })
                    return newImages
                  })
                }
              }}
            />
          </div>
          <button className="image-delete-button" onClick={() => handleDeleteButton(thumbnailSrc)}>
            <div className="svg-wrapper">
              <XIcon fill="#ffffff" />
            </div>
          </button>
        </div>
      ))}
    </>
  )
}

export default ImageCards
