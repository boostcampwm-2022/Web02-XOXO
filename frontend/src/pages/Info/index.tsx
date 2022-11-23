import React, { useRef } from 'react'
import './style.scss'
import XoxoIcon from '@assets/xoxoIcon.svg'
import { onChange } from '@src/util'

const Info = () => {
  const userNickname = useRef('')
  return (
    <div className="signin-page">
      <div className="signin-body">
        <img className="icon-image" src={XoxoIcon} alt="serviceIcon" />
        <div className="form-wrapper">
          <label className="form-label" htmlFor="userNickname">
            닉네임
          </label>
          <input
            type="text"
            id="userNickname"
            placeholder="  닉네임을 입력해주세요. ( 조합 10자리 이하)  "
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, userNickname)}
          />
          <button className="form-button">시작하기</button>
        </div>
      </div>
    </div>
  )
}

export default Info
