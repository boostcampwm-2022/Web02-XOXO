/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import './style.scss'
import { ReactComponent as XoxoIcon } from '@assets/xoxoIcon.svg'
import { ReactComponent as KakaoIcon } from '@assets/kakaoIcon.svg'
import { ReactComponent as CameraIcon } from '@assets/cameraIcon.svg'
import SigninBackground from '@src/components/SigninBackground'

const SignIn = () => {
  return (
    <div className="signin-page">
      <SigninBackground />
      <div className="signin-body">
        <div className="xoxo-info">
          <span>
            <CameraIcon />
            <p />
            my feed, our memory!
            <p />
            XOXO를 통해 우리만의 추억을 공유해보세요
          </span>
        </div>
        <div className="icon-wrapper">
          <XoxoIcon />
        </div>
          <a href={`${process.env.REACT_APP_SERVER_API as string}/users/kakao`} className='kakao-auth-button'>
            <div>
              <KakaoIcon />
              <span>카카오 로그인</span>
            </div>
          </a>
      </div>
    </div>
  )
}

export default SignIn
