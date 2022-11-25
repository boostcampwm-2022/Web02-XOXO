/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useRef } from 'react'
import './style.scss'
import usePost from '@hooks/usePost'
import XoxoIcon from '@assets/xoxoIcon.svg'
import Input from '@components/Input'
import SigninBackground from '@components/SigninBackground'
import { containsKO, longer } from '@util/validation/bool'
import { useNavigate } from 'react-router-dom'

const Info = () => {
  const userNickname = useRef('')
  const postNickname = usePost('/users/join')
  const navigate = useNavigate()
  const handleNicknameForm = async () => {
    const response = await postNickname({ nickname: userNickname.current })
    if (response && response.statusText === 'Created') navigate('/feed')
  }
  return (
    <div className="signin-page">
      <SigninBackground />
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
        <button className="form-button" onClick={handleNicknameForm}>시작하기</button>
      </div>
    </div>
  )
}

export default Info
