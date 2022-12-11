import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import ImageCard from './ImageCard'

interface IImageSlider {
  images: string[]
}
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false
}
const ImageSlider = ({ images }: IImageSlider) => {
  const imageCards = images.map((src: string) => <ImageCard src={src} key={src} />)
  return (
    <div className="image-carousel-container">
      <Slider {...settings}>{imageCards}</Slider>
    </div>
  )
}

export default ImageSlider
