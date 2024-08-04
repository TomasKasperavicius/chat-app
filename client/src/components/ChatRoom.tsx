import { UserContext, UserContextType } from "@/Providers/UserContext";
import { Message, SocketWithUser, UserDefinition } from "@/pages";
import { SendIcon } from "@/pages/SendIcon";
import { SendButton } from "@/pages/_SendButton";
import { Textarea, Input } from "@nextui-org/react";
import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface ChatRoomProps {
  chatRoom: ChatRoomDefinition | undefined;
  socket: SocketWithUser | undefined;
  typingUsers: string[];
}
export interface ChatRoomDefinition {
  _id: string;
  type: "group" | "private";
  owner: UserDefinition[];
  participants: UserDefinition[];
  messages: Message[];
}
const ChatRoom: FunctionComponent<ChatRoomProps> = ({
  chatRoom,
  socket,
  typingUsers,
}: ChatRoomProps) => {
  const messageInput = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(chatRoom?.messages || []);
  const { user } = useContext<UserContextType>(UserContext);
  useEffect(() => {
    socket?.removeAllListeners("receivedMessage");
    console.log(socket?.listeners("receivedMessage"));
    socket?.on("receivedMessage", (message: Message) => {
      console.log("here");
      setMessages((messages) => {
        return [...messages, message];
      });
    });
  });

  const sendMessage = () => {
    const msg: Message = {
      sender: user,
      timestamp: new Date().getTime(),
      content: messageInput?.current?.value,
    };
    messageInput!.current!.value = "";
    setMessages((messages: Message[]) => {
      return [...messages, msg];
    });
    socket?.emit("sendMessage", chatRoom, msg);
  };
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex flex-col items-center w-1/2 h-full">
        {messages.length > 0 &&
          messages.map((message, key) => {
            return (
              <div key={key} className="w-full flex justify-between">
                {message.sender?.username === user.username ? (
                  <div className="flex w-full items-end">
                    <div className="flex w-2/3">
                      <div className="flex flex-col">
                        <Textarea
                          readOnly
                          label={"You"}
                          placeholder={message.content}
                          status="success"
                        />
                        <span>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={key} className="flex w-2/3 justify-end">
                    <div className="flex flex-col">
                      <Textarea
                        readOnly
                        label={message.sender?.username}
                        placeholder={message.content}
                      />
                      <span>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="flex justify-center items-center p-8 relative">
        <div className="absolute bottom-20 left-10">
          {typingUsers.length > 0 &&
            typingUsers.map((user, key) => {
              return <div key={key}>{user} is typing...</div>;
            })}
        </div>
        <Input
          ref={messageInput}
          clearable
          contentRightStyling={false}
          placeholder="Type your message..."
          title="messageInputBox"
          onFocus={() => socket?.emit("typing", user.username)}
          onBlur={() => socket?.emit("stopped typing", user.username)}
          contentRight={
            <SendButton title="sendMessageButton" onClick={sendMessage}>
              <SendIcon
                filled={undefined}
                size={undefined}
                height={undefined}
                width={undefined}
                label={undefined}
                className={undefined}
              />
            </SendButton>
          }
        />
      </div>
    </div>
  );
};

export default ChatRoom;
