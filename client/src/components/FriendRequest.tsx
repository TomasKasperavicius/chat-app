import { SocketWithUser, UserDefinition } from "@/pages";
import { Button, Card, User } from "@nextui-org/react";
import { useRouter } from "next/router";
import { FunctionComponent, useContext } from "react";
import { ChatRoomDefinition } from "./ChatRoom";
import axios from "axios";
import { UserContextType, UserContext } from "@/Providers/UserContext";
interface FriendRequestProps {
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
                const response = await axios.post(
                  `http://${process.env.NEXT_PUBLIC_DOMAIN_NAME}:${process.env.NEXT_PUBLIC_SERVER_PORT}/chatrooms`,
                  {
                    owner: [user._id, sender._id],
                    type: "private",
                    participants: [user._id, sender._id],
                  }
                  );
                  socket.emit(
                    "accept friend request",
                    user,
                    senderSocketID
                    );
                    setFriends((friends) => {
                      return [...friends, { ...sender, socketID: senderSocketID}];
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
