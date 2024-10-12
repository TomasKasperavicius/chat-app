import React, {
  FunctionComponent,
  Key,
  useContext,
  useEffect,
  useRef,
} from "react";
import { SidebarProps } from "@/types/interfaces";
import { UserDefinition } from "@/pages";
import { Col, Divider, User } from "@nextui-org/react";
import router from "next/router";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { UserContextType, UserContext } from "@/Providers/UserContext";
import {
  ChatRoomContext,
  ChatRoomContextType,
} from "@/Providers/ChatRoomContext";
import axios, { AxiosResponse } from "axios";
import { ChatRoomDefinition } from "./ChatRoom";

const Sidebar: FunctionComponent<SidebarProps> = ({
  activeLink,
  toggleSidebar,
  setActiveLink,
  friends,

  setToggleSidebar,
}) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { user } = useContext<UserContextType>(UserContext);
  const { chatRooms, setChatRooms } =
    useContext<ChatRoomContextType>(ChatRoomContext);
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setToggleSidebar(false);
      setActiveLink("");
    }
  };
  useEffect(() => {
    if (!user.loggedIn) return;
    const getChatRooms = async () => {
      try {
        const response: AxiosResponse<any, any> = await axios.get(
          `http://${process.env.NEXT_PUBLIC_DOMAIN_NAME}:${process.env.NEXT_PUBLIC_SERVER_PORT}/chatrooms/users/${user._id}`
        );
        const chatrooms: ChatRoomDefinition[] = response.data;
        setChatRooms([...chatrooms]);
      } catch (error) {
        console.log(error);
      }
    };
    getChatRooms();
  }, [user]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <div
  className={`fixed h-full flex flex-col border-r border-solid transition-transform duration-300 ease-in-out transform 
  ${toggleSidebar ? 'translate-x-0' : '-translate-x-full'} xs:w-[300px] sm:w-[250px] md:w-[300px]`} 
>
    <div ref={sidebarRef}>
      {activeLink === "Friends" && friends.length > 0 && (
        <>
          <div className="flex justify-around p-2">
            Friends online: {friends.length}
            <HighlightOffIcon
              onClick={() => setToggleSidebar(false)}
              className="hover:opacity-70 cursor-pointer"
            />
          </div>
          <div className="m-2">
            <Divider className="my-4" />
            {friends.map((friend: UserDefinition, key: Key) => (
              <div key={key} className="w-full m-5">
                <User
                  name={friend.username}
                  src={friend.avatar}
                  zoomed
                  pointer
                />
              </div>
            ))}
          </div>
        </>
      )}
      {activeLink === "Chats" && chatRooms.length > 0 && (
        <>
          <div className="flex justify-around p-2">
            Your chatrooms: {chatRooms.length}
            <HighlightOffIcon
              onClick={() => setToggleSidebar(false)}
              className="hover:opacity-70 cursor-pointer"
            />
          </div>
          <div className="m-2">
            <Divider className="my-4" />
            {chatRooms.map((chatroom: ChatRoomDefinition, key: Key) => (
              <div key={key} className="w-full m-5">
                <User
                  name={"Chat-" + key}
                  zoomed
                  pointer
                  onClick={() => router.push(`/chat/${chatroom._id}`)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div>
  

  );
};

export default Sidebar;
