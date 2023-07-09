import Nav from "@/components/Nav";
import {
  Row,
  Col,
  User,
  Container,
} from "@nextui-org/react";
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { NextRouter, useRouter } from "next/router";
import ChatRoom, { ChatRoomDefinition } from "@/components/ChatRoom";
import { UserDefinition, SocketWithUser, Message } from "@/pages";
import { GetServerSideProps, GetServerSidePropsContext, NextApiHandler, NextApiRequest, NextPageContext } from "next";
import { Context } from "vm";
import { NextAuthHeader } from "next-auth/core";
import axios from "axios";
interface ChatRoomHomeProps {
  user: UserDefinition;
  socket: SocketWithUser | undefined;
  friends: UserDefinition[];
  typingUsers: string[];
  toggleSideBar: boolean;
  connectedUsers: UserDefinition[];
  notifications: React.FunctionComponent<{}>[];
  seenNewNotifications: boolean;
  toggleNotifications: boolean;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setToggleNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setFriends: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setTypingUsers: React.Dispatch<React.SetStateAction<string[]>>;
  setConnectedUsers: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<FunctionComponent<{}>[]>
  >;
  setSeenNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUser: Dispatch<SetStateAction<UserDefinition>>;
  DOMAIN_NAME:string,
  SERVER_PORT:number,
}

const ChatRoomHome: FunctionComponent<ChatRoomHomeProps> =  ({
  user,
  connectedUsers,
  friends,
  notifications,
  seenNewNotifications,
  setConnectedUsers,
  setCurrentUser,
  setFriends,
  setMessages,
  setNotifications,
  setSeenNewNotifications,
  setToggleNotifications,
  setToggleSidebar,
  setTypingUsers,
  socket,
  toggleNotifications,
  toggleSideBar,
  typingUsers,
  DOMAIN_NAME,
  SERVER_PORT,
}) => {
  const router: NextRouter = useRouter();
  const [data, setData] = useState<ChatRoomDefinition>()
  useEffect(() => {
    const fetchData = async()=>{
      const response = await axios.get(
        `http://${DOMAIN_NAME}:${SERVER_PORT}/chatRoom/${router.query.id}`
      );
      setData(response.data)
    }
    fetchData()
  }, []);

  return (
    <Container fluid responsive gap={0} css={{ minWidth: "100%" }}>
      <Row fluid>
        <Col>
          <Nav
            setSeenNewNotifications={setSeenNewNotifications}
            setToggleNotifications={setToggleNotifications}
            toggleSideBar={toggleSideBar}
            seenNewNotifications={seenNewNotifications}
            notifications={notifications}
            setToggleSidebar={setToggleSidebar}
            setNotifications={setNotifications}
          />
        </Col>
      </Row>
      <Row fluid css={{ minHeight: "100vh" }}>
        {toggleSideBar && (
          <Col
            span={2}
            css={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              borderRight: "solid",
            }}
          >
            <div
              onClick={() => setToggleSidebar(false)}
              className="flex justify-end m-2"
            >
              <HighlightOffIcon className="h-full w-full hover:opacity-70 cursor-pointer" />
            </div>
            <div className="m-2">
              People online: {friends.length}
              {friends.length > 0 &&
                friends.map((friend, key) => {
                  return (
                    <div key={key} className="w-full m-5">
                      <User
                        name={friend.username}
                        src={friend.avatar}
                        pointer
                      />
                    </div>
                  );
                })}
            </div>
          </Col>
        )}
        <ChatRoom
          chatRoom={data}
          socket={socket}
          typingUsers={typingUsers}
        />
      </Row>
    </Container>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {
      DOMAIN_NAME: process.env.DOMAIN_NAME,
      SERVER_PORT: process.env.SERVER_PORT,
    },
  };
};
export default ChatRoomHome;
