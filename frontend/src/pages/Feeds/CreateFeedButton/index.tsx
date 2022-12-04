import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as PlusIcon } from '@assets/plusPrimaryIcon.svg'
interface ICreateFeedButton {
  to: string
  text: string
}
const CreateFeedButton = ({ to, text }: ICreateFeedButton) => {
  return (
    <Link className="feeds-card" to={to}>
      <div className="feeds-card-circle add">
        <PlusIcon />
      </div>
      <span className="feeds-card-text add">{text}</span>
    </Link>
  )
}

export default CreateFeedButton
