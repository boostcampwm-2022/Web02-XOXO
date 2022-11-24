/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import './style.scss'
import XoxoIcon from '@assets/xoxoIcon.svg'
import { ReactComponent as KakaoIcon } from '@assets/kakaoIcon.svg'
import { ReactComponent as CameraIcon } from '@assets/cameraIcon.svg'
import SigninBackground from '@src/components/SigninBackground'

const SignIn = () => {
  const KAKAO_CLIENT_ID = String(process.env.REACT_APP_KAKAO_CLIENT_ID)
  const KAKAO_REDIRECT_URI = String(process.env.REACT_APP_KAKAO_REDIRECT_URI)
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
        <img className="icon-image" src={XoxoIcon} alt="test" />
        <a
          href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`}
        >
          <button className="kakao-auth-button">
            <div>
              <KakaoIcon />
              <span>카카오 로그인</span>
            </div>
          </button>
        </a>
      </div>
    </div>
  )
}

export default SignIn
