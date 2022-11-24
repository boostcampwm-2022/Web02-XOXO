import React, { useRef } from 'react'
import './style.scss'
import XoxoIcon from '@assets/xoxoIcon.svg'
import Input from '@components/Input'

const Info = () => {
  const userNickname = useRef('')
  return (
    <div className="signin-page">
      <div className="signin-body">
        <img className="icon-image" src={XoxoIcon} alt="serviceIcon" />
        <Input
          label="닉네임"
          placeholder="닉네임을 입력해주세요. ( 조합 10자리 이하)"
          bind={userNickname}
          validate={(str) => {
            return str.length > 10 ? '10자이상입니다.' : ''
          }}
        />
        <button className="form-button">시작하기</button>
      </div>
    </div>
  )
}

export default Info
