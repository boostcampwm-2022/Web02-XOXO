import React, { useState } from 'react'
import './style.scss'
import { ReactComponent as WarningIcon } from '@assets/warningIcon.svg'
import { debounce } from 'lodash'

interface IInput {
  label?: string
  placeholder?: string
  type?: string
  bind: React.RefObject<HTMLInputElement>
  validate?: (str: string) => string
  onChangeCb?: (str: string) => void
}
const Input = ({
  label = '',
  placeholder = '',
  type = 'text',
  bind,
  validate = (str: string) => '',
  onChangeCb = (str: string) => {}
}: IInput) => {
  const [warningText, setWarningText] = useState('')
  const debouncedValidate = debounce(validate, 500)

  const handleEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = debouncedValidate(e.target.value) ?? ''
    setWarningText(text)
    onChangeCb(e.target.value)
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
      <input type={type} placeholder={placeholder} onChange={handleEvent} ref={bind} />
    </div>
  )
}

export default Input
