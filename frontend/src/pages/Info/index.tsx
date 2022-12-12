/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useRef, useState, useEffect } from 'react'
import useSWR from 'swr'
import { useNavigate } from 'react-router-dom'
import { debounce } from 'lodash'
import './style.scss'
import usePost from '@hooks/usePost'
import XoxoIcon from '@assets/xoxoIcon.svg'
import Input from '@components/Input'
import SigninBackground from '@components/SigninBackground'
import fetcher from '@util/fetcher'
import { getWarningNickname } from '@src/util/validation'

const Info = () => {
  const navigate = useNavigate()
  const userNickname = useRef<HTMLInputElement>(null)
  const [nickname, setNickname] = useState('')
  const [isUniqueNickname, setIsUniqueNickname] = useState<boolean | null>(null)
  const [isValidNickname, setIsValidNickname] = useState<boolean>(false)
  const { data: nicknameCheckResult } = useSWR(nickname ? `/users/check/${nickname}` : null, fetcher)
  const postNickname = usePost('/users/join')
  const debouncedSearch = debounce((value: string) => {
    setNickname(value)
  }, 500)

  useEffect(() => {
    nicknameCheckResult !== undefined && setIsUniqueNickname(!nicknameCheckResult)
  }, [nicknameCheckResult])

  useEffect(() => {
    (nickname === '' || getWarningNickname(nickname) !== '') ? setIsValidNickname(false) : setIsValidNickname(true)
  }, [nickname])

  const handleNicknameForm = async () => {
    if (userNickname.current === null) return
    const { _success } = await postNickname({ nickname: userNickname.current.value })
    if (_success) navigate('/feeds')
    else {
      alert('다시 진행해 주세요.')
      navigate('/signin')
    }
  }

  return (
    <div className="signin-page">
      <SigninBackground />
      <div className="signin-body">
        <img className="icon-image" src={XoxoIcon} alt="serviceIcon" />
        <Input
          label="닉네임"
          placeholder="닉네임을 입력해주세요."
          bind={userNickname}
          validate={getWarningNickname}
          onChangeCb={debouncedSearch}
        />
        <div className="nickname-check-wrapper">
          <div className="nickname-check-result" style={{ color: isUniqueNickname ? '#1ed551' : '#fd4747', height: '16px' }}>{isValidNickname && isUniqueNickname !== null && (isUniqueNickname ? '사용 가능한 닉네임 입니다.' : '중복된 닉네임입니다.')}</div>
        </div>
        <button className="form-button" onClick={handleNicknameForm} disabled={!isValidNickname || !isUniqueNickname}>
          시작하기
        </button>
      </div>
    </div>
  )
}

export default Info
