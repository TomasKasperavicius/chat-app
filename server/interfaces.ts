export interface UserInfo {
  _id: string;
  username: string;
  password: string;
  email: string;
  avatar?: string;
  socketID?: string;
}
export interface Message {
  sender: UserInfo;
  receiver?: string;
  date: number;
  body: string | undefined;
}
export interface IChatRoom{
  owner: string,
  type: String,
  participants: string[],
  messages: Message[],
}
