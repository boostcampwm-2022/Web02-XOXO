import React, { useState, useEffect } from 'react'
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
  defaultValue?: string
}
const Input = ({
  label = '',
  placeholder = '',
  type = 'text',
  bind,
  defaultValue = '',
  validate = (str: string) => '',
  onChangeCb = (str: string) => {}
}: IInput) => {
  const [warningText, setWarningText] = useState('')
  const [inputText, setInputText] = useState('')
  const debouncedWarningText = debounce(setWarningText, 500)

  useEffect(() => {
    if (defaultValue !== '') {
      setInputText(defaultValue)
    }
  }, [defaultValue])

  useEffect(() => {
    if (inputText !== '') {
      const text = validate(inputText)
      debouncedWarningText(text)
      onChangeCb(inputText)
    }
  }, [inputText])

  const handleEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
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
      <input type={type} placeholder={placeholder} onChange={handleEvent} ref={bind} value={inputText} />
    </div>
  )
}

export default Input
