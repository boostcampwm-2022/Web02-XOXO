/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import './style.scss'
import { Link, useNavigate } from 'react-router-dom'
import { ReactComponent as DownIcon } from '@assets/downIcon.svg'
import { ReactComponent as LogoutIcon } from '@assets/logoutIcon.svg'
import usePost from '@hooks/usePost'
import { IResponse } from '@src/types'

interface headerProps {
  page?: string
  text: string
}

const Header = ({ page, text }: headerProps) => {
  const postLogout = usePost('/users/logout')
  const navigate = useNavigate()
  const handleLogout = async () => {
    const { data }: IResponse = await postLogout({})

    if (data) navigate('/Signin')
  }
  const handleRenderHeader = () => {
    switch (page) {
      case 'feed':
        return (
          <div className="feed-header">
            <Link className="text-wrapper" to="/feeds">
              <span className="text">{text}</span>
              <div className="svg-wrapper">
                <DownIcon />
              </div>
            </Link>
            <button onClick={handleLogout}>
              <div className="svg-wrapper">
                <LogoutIcon />
              </div>
            </button>
          </div>
        )
      default:
        return <div className="default-header">{text}</div>
    }
  }
  return <>{handleRenderHeader()}</>
}

export default React.memo(Header)
