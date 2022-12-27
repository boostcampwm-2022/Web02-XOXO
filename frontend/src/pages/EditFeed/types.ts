export interface IFeedForm {
  name?: string
  thumbnail?: string
  description?: string
  dueDate?: string
  memberIdList?: number[]
}
export interface ISuggestion {
  id: string
  nickname: string
}
export interface IGroupMember {
  members: ISuggestion[]
  setMembers: React.Dispatch<React.SetStateAction<ISuggestion[]>>
}
export interface IEditFeedButton {
  getFeedInfos: () => Promise<IFeedForm | undefined>
}
