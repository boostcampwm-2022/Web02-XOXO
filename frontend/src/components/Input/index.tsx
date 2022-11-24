import React, { useState } from 'react'
import { bindValue } from '@util/index'
import './style.scss'
import { ReactComponent as WarningIcon } from '@assets/warningIcon.svg'

interface IInput {
  label?: string
  placeholder?: string
  type?: string
  bind: React.MutableRefObject<string>
  validate?: (str: string) => string
}
const Input = ({ label = '', placeholder = '', type = 'text', bind, validate = (str: string) => '' }: IInput) => {
  const [warningText, setWarningText] = useState(validate(bind.current))

  const handleEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    bindValue(e, bind)
    const text = validate(e.target.value)
    setWarningText(text)
  }

  return (
    <div className="form-wrapper">
      <label className="form-label">{label}</label>
      {warningText !== '' && (
        <div className="form-warning">
          <WarningIcon />
          <span>{warningText}</span>
        </div>
      )}
      <input type={type} placeholder={placeholder} onChange={handleEvent} />
    </div>
  )
}

export default Input
