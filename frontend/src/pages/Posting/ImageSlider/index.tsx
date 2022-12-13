/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ImageCard from './ImageCard'
import { IImageCard } from './types'
import { getPostingLQThumbUrl, getPostingThumbUrl } from '@src/util/imageQuery'

interface IImageSlider {
  images: string[]
}
const ImageSlider = ({ images }: IImageSlider) => {
  const [page, setPage] = useState(0)
  const [imageStatus, setImageStatus] = useState<IImageCard[]>(
    images.map((url, index): IImageCard => {
      return {
        src: index < 2 ? getPostingThumbUrl(url) : getPostingLQThumbUrl(url),
        url,
        isLq: !(index < 2),
        index
      }
    })
  )
  useEffect(() => {
    if (page + 2 < imageStatus.length && imageStatus[page + 2].isLq === true) {
      setImageStatus((imageStatus) => {
        const newImageStatus = [...imageStatus]
        const target = newImageStatus[page + 2]
        target.isLq = false
        target.src = getPostingThumbUrl(target.url!)
        newImageStatus[page + 2] = target
        return newImageStatus
      })
    }
  }, [page])
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (before: number, index: number) => {
      setPage(index)
    }
  }
  return (
    <div className="image-carousel-container">
      <Slider {...settings}>
        {imageStatus.map(({ src }) => (
          <ImageCard src={src} key={src} />
        ))}
      </Slider>
    </div>
  )
}

export default ImageSlider
