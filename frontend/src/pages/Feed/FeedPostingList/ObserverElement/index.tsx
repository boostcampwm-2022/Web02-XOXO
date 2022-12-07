import React from 'react'
import { ReactComponent as ArrowIcon } from '@assets/arrowIcon.svg'
import './style.scss'

const ObserverElement = () => {
  return (
    <div className='observer-element'>
      <div className="arrow">
        <ArrowIcon width={'4vw'} fill={'#cccccc'}/>
      </div>
    </div>
  )
}

export default ObserverElement
