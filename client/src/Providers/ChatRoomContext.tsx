// UserProvider.tsx
import { ChatRoomDefinition } from "@/components/ChatRoom";
import { UserDefinition } from "@/pages";
import {
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
export type ChatRoomContextType = {
  chatRooms: ChatRoomDefinition[];
  setChatRooms: React.Dispatch<SetStateAction<ChatRoomDefinition[]>>;
};

export const ChatRoomContext = createContext<ChatRoomContextType>({chatRooms:[],setChatRooms: ()=>{}});

type ChatRoomProvider = {
  children: ReactNode;
};
export const ChatRoomProvider = ({ children }: ChatRoomProvider) => {
  const [chatRooms, setChatRooms] = useState<ChatRoomDefinition[]>([]);

  return (
    <ChatRoomContext.Provider value={{ chatRooms, setChatRooms }}>
      {children}
    </ChatRoomContext.Provider>
  );
};
