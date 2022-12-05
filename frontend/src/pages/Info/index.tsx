/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useRef } from 'react'
import './style.scss'
import usePost from '@hooks/usePost'
import XoxoIcon from '@assets/xoxoIcon.svg'
import Input from '@components/Input'
import SigninBackground from '@components/SigninBackground'
import { useNavigate } from 'react-router-dom'
import { getWarningNickname } from '@src/util/validation'

const Info = () => {
  const userNickname = useRef<HTMLInputElement>(null)
  const postNickname = usePost('/users/join')
  const navigate = useNavigate()
  const handleNicknameForm = async () => {
    if (userNickname.current === null) return
    const response = await postNickname({ nickname: userNickname.current.value })
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
          validate={getWarningNickname}
        />
        <button className="form-button" onClick={handleNicknameForm}>
          시작하기
        </button>
      </div>
    </div>
  )
}

export default Info
