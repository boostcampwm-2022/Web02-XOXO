import React from 'react'
import './style.scss'
const SigninBackground = () => {
  return (
    <div className="signin-bg">
      {Array(100)
        .fill(0)
        .map((n) => (
          <li key={n}></li>
        ))}
    </div>
  )
}

export default SigninBackground