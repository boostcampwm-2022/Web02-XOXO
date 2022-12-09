import React, { useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ImageCard from './ImageCard'
import { IImageCard } from './types'
import { getoriginalUrl, getthumbUrl } from './imageQuery'

interface IImageSlider {
  images: string[]
}
const ImageSlider = ({ images }: IImageSlider) => {
  const [page, setPage] = useState(0)
  const [imageStatus, setImageStatus] = useState<IImageCard[]>(
    images.map((url, index): IImageCard => {
      return {
        src: index < 2 ? getoriginalUrl(url) : getthumbUrl(url),
        url,
        isLq: !(index < 2),
        index
      }
    })
  )
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, index: number) => {
      setPage(index)
      setImageStatus((imageStatus) => {
        return imageStatus.map((e) => {
          if (e.index === page + 2 && !e.isLq) {
            e.src = getoriginalUrl(e.url)
            e.isLq = false
          }
          return e
        })
      })
    }
  }
  return (
    <div className="image-carousel-container">
      <Slider {...settings}>
        {imageStatus.map(({ src, index }) => (
          <ImageCard src={src} key={index} />
        ))}
      </Slider>
    </div>
  )
}

export default ImageSlider
