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
import axios from "axios";

interface ChatRoomProps {
  chatRoom: ChatRoomDefinition | undefined;
  socket: SocketWithUser | undefined;
  typingUsers: string[];
  DOMAIN_NAME: string;
  SERVER_PORT: number;
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
  DOMAIN_NAME,
  SERVER_PORT
}: ChatRoomProps) => {
  const messageInput = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useContext<UserContextType>(UserContext);
  useEffect(() => {
    socket?.removeAllListeners("message");
    socket?.on("message", async (message: Message) => {
      setMessages((messages) => {
        return [...messages, message];
      });
      await saveMessageToMongoDB(message)
    });
  },[chatRoom]);
  
  const saveMessageToMongoDB = async (message: Message)=>{
    await axios.put(
      `http://${DOMAIN_NAME}:${SERVER_PORT}/chatrooms/${chatRoom?._id}`,{
        headers: {
          'Content-Type': 'application/json', 
        },
        data:{
          owner: chatRoom?.owner,
          participants: chatRoom?.participants,
          messages: message,
          type: chatRoom?.type,
        }
      }
    );
  }

  const sendMessage = async () => {
    const msg: Message = {
      sender: user,
      timestamp: new Date().getTime(),
      content: messageInput?.current?.value,
    };
    messageInput!.current!.value = "";
    socket?.emit("message", chatRoom?._id, msg);
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
      <div className="flex flex-col justify-center items-center w-full h-full">
  <div className="fixed bottom-0 left-0 w-full flex justify-center p-8">
    <div className="flex flex-col items-center w-full max-w-lg">
      {typingUsers.length > 0 && (
        <div>
          {typingUsers.map((user, key) => (
            <div key={key}>{user} is typing...</div>
          ))}
        </div>
      )}
      <Input
        ref={messageInput}
        clearable
        contentRightStyling={false}
        placeholder="Type your message..."
        title="messageInputBox"
        onFocus={() => socket?.emit("typing", user.username, chatRoom?._id)}
        onBlur={() => socket?.emit("stopped typing", user.username, chatRoom?._id)}
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
</div>


    </div>
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
export default ChatRoom;
