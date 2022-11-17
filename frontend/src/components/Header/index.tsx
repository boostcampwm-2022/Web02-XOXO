import React from 'react'
import './style.scss'
import { ReactComponent as DownIcon } from '@assets/downIcon.svg'
import { ReactComponent as LogoutIcon } from '@assets/logoutIcon.svg'

interface headerProps {
  page?: string
  text: string
}

const Header = ({ page, text }: headerProps) => {
  const handleRenderHeader = () => {
    switch (page) {
      case 'feed' :
        return (
            <div className='feed-header'>
                <div className='text-wrapper'>
                    <span className='text'>
                        {text}
                    </span>
                    <DownIcon/>
                </div>
                <LogoutIcon/>
            </div>
        )
      default :
        return (
            <div>
                {text}
            </div>
        )
    }
  }
  return (
    <>
        { handleRenderHeader() }
    </>
  )
}

export default Header
