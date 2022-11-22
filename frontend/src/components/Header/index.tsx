import React from 'react'
import './style.scss'
import { Link } from 'react-router-dom'
import { ReactComponent as DownIcon } from '@assets/downIcon.svg'
import { ReactComponent as LogoutIcon } from '@assets/logoutIcon.svg'

interface headerProps {
  page?: string
  text: string
}

const Header = ({ page, text }: headerProps) => {
  const handleRenderHeader = () => {
    switch (page) {
      case 'feed':
        return (
          <div className="feed-header">
            <Link className="text-wrapper" to="/feeds">
              <span className="text">{text}</span>
              <DownIcon />
            </Link>
            <LogoutIcon />
          </div>
        )
      default:
        return <div className="default-header">{text}</div>
    }
  }
  return <>{handleRenderHeader()}</>
}

export default Header
