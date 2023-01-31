import { Message, SocketWithUser, UserDefinition } from "@/pages";
import { SendIcon } from "@/pages/SendIcon";
import { SendButton } from "@/pages/_SendButton";
import { Textarea, Input } from "@nextui-org/react";
import { FunctionComponent, useRef, useState } from "react";

interface ChatRoomProps {
    user: UserDefinition,
    socket: SocketWithUser,
    typingUsers: string[],
}

const ChatRoom: FunctionComponent<ChatRoomProps> = ({user,socket,typingUsers}:ChatRoomProps) => {
  const messageInput = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
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
    socket?.emit("message", msg);
  };
  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-col items-center w-3/4 h-3/4 overflow-y-auto">
        {messages.length > 0 &&
          messages.map((message, key) => {
            return (
              <>
                {message.sender?.username === user.username ? (
                  <div key={key} className="flex w-1/3 justify-end">
                    <div className="flex flex-col py-10 ">
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
                ) : (
                  <div key={key} className="flex w-1/3">
                    <div className="flex flex-col py-10 ">
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
              </>
            );
          })}
      </div>
      <div>
        {typingUsers.length > 0 &&
          typingUsers.map((user, key) => {
            return <div key={key}>{user} is typing...</div>;
          })}
      </div>
      <div className="w-3/4 flex justify-center">
        <Input
          ref={messageInput}
          clearable
          contentRightStyling={false}
          placeholder="Type your message..."
          title="messageInputBox"
          onFocus={() => socket?.emit("typing", user)}
          onBlur={() => socket?.emit("stopped typing", user)}
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
