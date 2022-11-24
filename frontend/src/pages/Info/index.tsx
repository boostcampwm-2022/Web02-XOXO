import React, { useRef } from 'react'
import './style.scss'
import XoxoIcon from '@assets/xoxoIcon.svg'
import Input from '@components/Input'
import { containsKO, longer } from '@util/validation/bool'

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
          validate={(str: string) => {
            if (longer(10)(str)) return '닉네임은 10자리 이하입니다.'
            if (containsKO(str)) return '한국어를 포함하고 있습니다.'
            return ''
          }}
        />
        <button className="form-button">시작하기</button>
      </div>
    </div>
  )
}

export default Info
