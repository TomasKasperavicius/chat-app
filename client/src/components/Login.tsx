import { UserDefinition } from "@/pages";
import { Logo } from "@/pages/Logo";
import { Input, Button } from "@nextui-org/react";
import axios, { AxiosResponse } from "axios";
import { FunctionComponent, useContext, useRef } from "react";
import { useTheme, Text } from '@nextui-org/react';
import { UserContextType, UserContext } from "@/Providers/UserContext";
import { NextRouter, useRouter } from "next/router";

const Login: FunctionComponent = () => {
  const userName = useRef<HTMLInputElement | null>(null);
  const pass = useRef<HTMLInputElement | null>(null);
  const { user, setCurrentUser } = useContext<UserContextType>(UserContext);
  const router: NextRouter = useRouter();

  const login = async () => {
    try {
      const response: AxiosResponse<any, any> = await axios.post(
        `http://${process.env.NEXT_PUBLIC_DOMAIN_NAME}:${process.env.NEXT_PUBLIC_SERVER_PORT}/auth/login`,
        { username: userName.current?.value ?? '', password: pass.current?.value ?? ''}
      );
      const { _id, avatar, chatRooms, friends, username }: UserDefinition =
        response.data;
        setCurrentUser(response.data);
        router.push("/home");
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

