import { SocketWithUser, UserDefinition } from "@/pages";
import { Button, Card, User } from "@nextui-org/react";
import { FunctionComponent } from "react";

interface FriendRequestProps {
  sender: UserDefinition;
  socket: SocketWithUser;
  senderSocketID: string;
  setNotifications: React.Dispatch<
    React.SetStateAction<FunctionComponent<{}>[]>
  >;
  setConnectedUsers: React.Dispatch<React.SetStateAction<UserDefinition[]>>;
  setFriends:React.Dispatch<React.SetStateAction<UserDefinition[]>>;

}

const FriendRequest: FunctionComponent<FriendRequestProps> = ({
  sender,
  socket,
  senderSocketID,
  setNotifications,
  setConnectedUsers,
  setFriends,
}: FriendRequestProps) => {
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
            onClick={() => {
              setNotifications((not: any) => {
                return [
                  ...not.filter(
                    (n: any) => n.props.senderSocketID !== senderSocketID
                  ),
                ];
              });
              setFriends((friends)=>{
                return [...friends,{...sender, socketID:senderSocketID}];
              });
              setConnectedUsers((users) => {
                return [...users.filter(u => u.socketID !== senderSocketID)];
              });
              socket.emit("accept friend request", socket.user,senderSocketID);
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
              socket.emit("cancel friend request", senderSocketID);
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
