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
}

const FriendRequest: FunctionComponent<FriendRequestProps> = ({
  sender,
  socket,
  senderSocketID,
  setNotifications,
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
          <Button size="sm" css={{ margin: 10 }} className="hover:opacity-70">
            Confirm
          </Button>
          <Button
            size="sm"
            css={{ margin: 10 }}
            className="hover:opacity-70"
            onClick={() => {
                setNotifications((not: any) => {
                    return [...not.filter((n: any) => n.props.senderSocketID !== senderSocketID)];
                  });
              socket.emit(
                "cancel friend request",
                senderSocketID,
                socket.user
              );
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
