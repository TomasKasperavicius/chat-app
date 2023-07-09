import { SocketWithUser, UserDefinition } from "@/pages";
import { Button, Card, User } from "@nextui-org/react";
import { useRouter } from "next/router";
import { FunctionComponent, useContext } from "react";
import ChatRoom, { ChatRoomDefinition } from "./ChatRoom";
import axios from "axios";
import { UserContextType, UserContext } from "@/Providers/UserContext";
interface FriendRequestProps {
  DOMAIN_NAME: string;
  SERVER_PORT: number;
  sender: UserDefinition;
  socket: SocketWithUser;
  senderSocketID: string;
  setNotifications: React.Dispatch<
    React.SetStateAction<FunctionComponent<{}>[]>
  >;
  setConnectedUsers: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setFriends: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setChatRooms: React.Dispatch<React.SetStateAction<ChatRoomDefinition[]>>;
}

const FriendRequest: FunctionComponent<FriendRequestProps> = ({
  sender,
  socket,
  senderSocketID,
  setNotifications,
  setConnectedUsers,
  setFriends,
  setChatRooms,
  DOMAIN_NAME,
  SERVER_PORT,
}: FriendRequestProps) => {
  const router = useRouter();
  const { user } = useContext<UserContextType>(UserContext);
  return (
    <Card className="flex items-center">
      <Card.Header className="flex items-center">
        <User
          name={sender.username + " has sent you a friend request"}
          src={sender.avatar}
        />
      </Card.Header>
      <Card.Body>
        <div className="flex">
          <Button
            size="sm"
            css={{ margin: 10 }}
            className="hover:opacity-70"
            onClick={async () => {
              setNotifications((not: any) => {
                return [
                  ...not.filter(
                    (n: any) => n.props.senderSocketID !== senderSocketID
                  ),
                ];
              });
              setConnectedUsers((users) => {
                return [...users.filter((u) => u.socketID !== senderSocketID)];
              });
              
              try {
                console.log(user);
                const response = await axios.post(
                  `http://${DOMAIN_NAME}:${SERVER_PORT}/addPrivateChatRoom`,
                  {
                    owner: [user._id, sender._id],
                    type: "private",
                    participants: [user._id, sender._id],
                  }
                  );
                  const chatRoom: ChatRoomDefinition = response.data;
                  socket.emit(
                    "accept friend request",
                    user,
                    senderSocketID,
                    chatRoom
                    );
                    socket.emit("joinRoom", chatRoom._id);
                    setFriends((friends) => {
                      return [...friends, { ...sender, socketID: senderSocketID,privateChatID:chatRoom._id }];
                    });
                    setChatRooms((chatRooms: ChatRoomDefinition[]) => {
                      return [...chatRooms, chatRoom] as ChatRoomDefinition[];
                    });
                  } catch (error) {
                console.error(error);
              }
              router.push("/home");
            }}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            css={{ margin: 10 }}
            className="hover:opacity-70"
            onClick={() => {
              setNotifications((not: any) => {
                return [
                  ...not.filter(
                    (n: any) => n.props.senderSocketID !== senderSocketID
                  ),
                ];
              });
              setConnectedUsers((users) => {
                users.find(
                  (u) => u.socketID === senderSocketID
                )!.receivedFriendRequest = false;
                return [...users];
              });
              socket.emit("cancel friend request", senderSocketID);
              router.push("/home");
            }}
          >
            Remove
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FriendRequest;
