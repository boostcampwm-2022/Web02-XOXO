import { debounce, isEmpty } from 'lodash'
import React, { useState } from 'react'
import { ISuggestion } from '../types'
import { ReactComponent as XIcon } from '@assets/XIcon.svg'
import Suggestions from './Suggestions'

interface IGroupMember {
  members: ISuggestion[]
  setMembers: React.Dispatch<React.SetStateAction<ISuggestion[]>>
}

const GroupMember = ({ members, setMembers }: IGroupMember) => {
  const [nickname, setNickname] = useState('')
  const debouncedSearch = debounce((value: string) => {
    setNickname(value)
  }, 500)
  const handleSuggestionClick = (newMember: ISuggestion) => {
    if (members.every(({ id }) => id !== newMember.id)) {
      setMembers([...members, newMember])
    }
    setNickname('')
    const input = document.getElementById('nickname') as HTMLInputElement
    if (input != null) input.value = ''
  }
  return (
    <div>
      <div className="form-wrapper">
        <label className="form-label" htmlFor="userId">
          그룹원 추가
        </label>
        <input
          type="text"
          id="nickname"
          placeholder="그룹원의 카카오 이메일을 입력해주세요"
          onChange={(e) => {
            debouncedSearch(e.target.value)
          }}
        />
      </div>
      {!isEmpty(nickname) && <Suggestions nickname={nickname} setMembers={handleSuggestionClick} />}
      <label className="form-label" htmlFor="">
        그룹원 목록
      </label>
      {
        // eslint-disable-next-line multiline-ternary
        isEmpty(members) ? (
          <span className="form-no-member">현재 추가된 그룹원이 없습니다</span>
        ) : (
          <div className="form-members-wrapper">
            {members.map(({ nickname, id }) => (
              // eslint-disable-next-line react/jsx-key
              <button
                key={id}
                className="form-member"
                onClick={(e) => {
                  e.preventDefault()
                  setMembers(members.filter((member) => member.id !== id))
                }}
              >
                <span>{nickname}</span>
                <XIcon fill="#ea4b35" />
              </button>
            ))}
          </div>
        )
      }
    </div>
  )
}

export default GroupMember
