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
  const imageCards = images.map(({ src }: IImageCard) => <ImageCard src={src} key={src} />)
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, index: number) => {
      setPage(index)
    }
  }
  return (
    <div className="image-carousel-container">
      <Slider {...settings}>{imageCards}</Slider>
    </div>
  )
}

export default ImageSlider
