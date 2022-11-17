import React from 'react'
import './style.scss'
import XoxoIcon from '@assets/xoxoIcon.svg'
import { ReactComponent as KakaoIcon } from '@assets/kakaoIcon.svg'
import { ReactComponent as CameraIcon } from '@assets/cameraIcon.svg'
import SplashImage from '@assets/splashImage.svg'

const SignIn = () => {
  return (
    <div className="signin-page">
        <div className='signin-body'>
          <div className="xoxo-info">
            <CameraIcon/>
            <p>my feed, our memory!</p>
            <p>XOXO를 통해 우리만의 추억을 공유해보세요</p>
          </div>
          <img className="icon-image" src={XoxoIcon} alt="test" />
          <button className='kakao-auth-button'>
            <div>
                <KakaoIcon/>
                <span>카카오 로그인</span>
            </div>
        </button>
        </div>
        <div className="splash-wrapper">
            <img className="splash-image" src={SplashImage} alt="XOXO" />
        </div>
    </div>
  )
}

export default SignIn
