export interface UserInfo {
  username: string;
  password: string;
  email: string;
  avatar?: string;
  socketID?: string;
}
export interface Message {
  sender: string;
  receiver?: string;
  timestamp: number;
  content: string | undefined;
}
export interface IChatRoom{
  owner: string,
  type: String,
  participants: string[],
  messages: Message[],
}
