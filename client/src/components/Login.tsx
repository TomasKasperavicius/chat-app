import { UserDefinition } from "@/pages";
import { Logo } from "@/pages/Logo";
import { Input, Button } from "@nextui-org/react";
import axios, { AxiosResponse } from "axios";
import { FunctionComponent, useRef } from "react";
import { useTheme, Text } from '@nextui-org/react';
interface LoginProps {
  DOMAIN_NAME: string;
  SERVER_PORT: number;
}

const Login: FunctionComponent<LoginProps> = ({ DOMAIN_NAME, SERVER_PORT }) => {
  const userName = useRef<HTMLInputElement | null>(null);
  const pass = useRef<HTMLInputElement | null>(null);
  const login = async () => {
    try {
      console.log(`http://${DOMAIN_NAME}:${SERVER_PORT}/auth/login`)
      const response: AxiosResponse<any, any> = await axios.post(
        `http://${DOMAIN_NAME}:${SERVER_PORT}/auth/login`,
        { username: userName.current?.value ?? '', password: pass.current?.value ?? ''}
      );
      const { _id, avatar, chatRooms, friends, username }: UserDefinition =
        response.data;
        console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  };
  const { isDark } = useTheme();
  return (
    <div
      className="flex justify-center items-center h-screen"
    >
      <div
        className="w-full max-w-md p-8 shadow-lg rounded-lg"
        style={{
          border: `1px solid ${isDark ? 'white' : 'black'}`,
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <span className="flex text-4xl items-center">
            <Logo width={50} height={50} />
            <Text b color="inherit" hideIn="xs" css={{ paddingLeft: '16px' }}>
              Quicksender
            </Text>
          </span>
        </div>
        <Input
          id="userName-input"
          width="w-full"
          ref={userName}
          clearable
          css={{ padding: "10px" }}
          contentRightStyling={false}
          placeholder="Enter username..."
          title="userNameInputBox"
          className="mb-4"
        />
        <Input
          id="password-input"
          width="w-full"
          ref={pass}
          css={{ padding: "10px" }}
          type="password"
          clearable
          contentRightStyling={false}
          placeholder="Enter password..."
          title="passwordInputBox"
          className="mb-6"
        />
        <Button
          css={{ minWidth: "100%" }}
          title="setuserNameButton"
          onClick={login}
          className="w-full"
        >
          Start chatting!
        </Button>
      </div>
    </div>
  );
};

export default Login;

