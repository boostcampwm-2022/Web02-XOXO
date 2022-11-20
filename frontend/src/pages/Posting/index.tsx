import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './styles.scss'
import Header from '@src/components/Header'
import defaultUserImage from '@assets/defaultUserImage.svg'
const SimpleSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
  }
  const srcs = [
    'https://img.sbs.co.kr/newsnet/etv/upload/2022/10/17/30000797348_1280.jpg',
    'https://thumb.mtstarnews.com/06/2022/10/2022100810174352876_1.jpg/dims/optimize',
    'https://img.allurekorea.com/allure/2022/10/style_6357b49fd15e0.jpeg'
  ]
  // eslint-disable-next-line @typescript-eslint/quotes
  const letter = `걸어봐 위엄 like a lion 눈빛엔 거대한 desire (nan-na-na-eh)더 부어 gasoline on fire불길 속에 다시 날아 rising (nan-na-na-eh) 잊지 마 내가 두고 온 toe shoes 무슨 말이 더 필요해?무시 마 내가 걸어온 커리어I go to ride 'til I die, die 더 높이 가줄게 내가 바랐던 세계 젤 위에 (ah-ah) 떨어져도 돼 I'm anti-fragile, anti-fragile (ah-ah)`
  const images = srcs.map((src, index) => (
    <div key={index} className="image-container">
      <div>
        <img src={src} />
      </div>
    </div>
  ))
  return (
    <div className="posting-page">
      <Header page="posting" text="#신분당선에서 #자만추" />
      <div className="posting-body">
        <div className="info-header">
          <div className="info-header-picture">
            <img src={defaultUserImage} />
          </div>
          <span>백규현</span>
        </div>
        <div className="image-carousel-container">
          <Slider {...settings}>{images}</Slider>
        </div>
        <div className="letter-container">
          <span>{letter}</span>
        </div>
      </div>
    </div>
  )
}
export default SimpleSlider
