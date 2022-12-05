import { debounce, isEmpty } from 'lodash'
import React, { useRef, useState } from 'react'
import { ReactComponent as XIcon } from '@assets/XIcon.svg'
import Suggestions from './Suggestions'
import Input from '@src/components/Input'
import { ISuggestion } from '@src/types'

interface IGroupMember {
  members: ISuggestion[]
  setMembers: React.Dispatch<React.SetStateAction<ISuggestion[]>>
}

const GroupMember = ({ members, setMembers }: IGroupMember) => {
  const nicknameRef = useRef<HTMLInputElement>(null)
  const [nickname, setNickname] = useState('')
  const debouncedSearch = debounce((value: string) => {
    setNickname(value)
  }, 500)
  const handleSuggestionClick = (newMember: ISuggestion) => {
    if (members.every(({ id }) => id !== newMember.id)) {
      setMembers([...members, newMember])
    }
    if (!isEmpty(nicknameRef.current)) {
      nicknameRef.current.value = ''
      setNickname(nicknameRef.current.value)
    }
  }
  return (
    <div>
      <Input
        label="그룹원 추가"
        bind={nicknameRef}
        placeholder="그룹원의 카카오 이메일을 입력해주세요"
        onChangeCb={debouncedSearch}
      />
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
