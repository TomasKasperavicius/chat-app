import { UserDefinition } from "@/pages";
import { Input, Button } from "@nextui-org/react";
import axios, { AxiosResponse } from "axios";
import { FunctionComponent, useRef } from "react";

interface LoginProps {
  DOMAIN_NAME: string;
  SERVER_PORT: string;
}

const Login: FunctionComponent<LoginProps> = ({ DOMAIN_NAME, SERVER_PORT }) => {
  const userName = useRef<HTMLInputElement | null>(null);
  const pass = useRef<HTMLInputElement | null>(null);
  const login = async () => {
    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `http://${DOMAIN_NAME}:${SERVER_PORT}/auth/login`,
        { username: userName.current?.value ?? '', password: pass.current?.value ?? ''}
      );
      const { _id, avatar, chatRooms, friends, username }: UserDefinition =
        response.data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Input
        id="userName-input"
        width="w-1/2"
        ref={userName}
        clearable
        css={{ padding: "10px" }}
        contentRightStyling={false}
        placeholder="Enter userName..."
        title="userNameInputBox"
      />
      <Input
        id="userName-input"
        width="w-1/2"
        ref={pass}
        css={{ padding: "10px" }}
        type="pass"
        clearable
        contentRightStyling={false}
        placeholder="Enter pass..."
        title="userNameInputBox"
      />
      <Button
        css={{ minWidth: "10%" }}
        title="setuserNameButton"
        onClick={login}
      >
        Start chatting!
      </Button>
    </>
  );
};

export default Login;

