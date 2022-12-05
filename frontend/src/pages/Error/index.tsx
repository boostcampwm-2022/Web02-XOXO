import React from 'react'
import SigninBackground from '@components/SigninBackground'
import './style.scss'

const Error = () => {
  return (
    <div className='error-page'>
      <SigninBackground />
      <div className="text-container">
        <p className='error-title'>404</p>
        <p className='error-desc'>여긴 당신이 찾는 웹페이지가 아니에요 :(</p>
      </div>

    </div>
  )
}

export default Error
