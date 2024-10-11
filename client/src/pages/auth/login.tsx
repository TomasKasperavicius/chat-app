import Login from "@/components/Login";
interface LoginInterface {
  DOMAIN_NAME: string;
  SERVER_PORT: number;
}
function LoginPage({ DOMAIN_NAME, SERVER_PORT }: LoginInterface) {
  return <Login DOMAIN_NAME={DOMAIN_NAME} SERVER_PORT={SERVER_PORT} />;
}

export default LoginPage;
