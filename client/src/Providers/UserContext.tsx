// UserProvider.tsx
import { UserDefinition } from "@/pages";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
export type UserContextType = {
  user: UserDefinition;
  setCurrentUser: React.Dispatch<SetStateAction<UserDefinition>>;
};

export const UserContext = createContext<UserContextType>({user:{
  _id: "",
  chatRooms: [],
  friends: [],
  receivedFriendRequest: false,
  socketID: undefined,
  avatar: "",
  username: "",
  loggedIn: false,
},setCurrentUser: ()=>{}});

type UserProviderProps = {
  children: ReactNode;
};
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setCurrentUser] = useState<UserDefinition>({
    _id: "",
    chatRooms: [],
    friends: [],
    receivedFriendRequest: false,
    socketID: undefined,
    avatar: "",
    username: "",
    loggedIn: false,
  });

  return (
    <UserContext.Provider value={{ user, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
