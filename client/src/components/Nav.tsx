import { UserDefinition } from "@/pages";
import {
  Button,
  Link,
  Navbar,
  Switch,
  useTheme,
  Text,
  Input,
  Spacer,
  Textarea,
  User,
  Container,
  Row,
  Col,
} from "@nextui-org/react";
import { FunctionComponent } from "react";
interface NavProps {
  type: string;
  user: UserDefinition | undefined;
  isDark: boolean | undefined;
  setTheme: (theme: string) => void;
}
import { Logo } from "../pages/Logo";

const Nav: FunctionComponent<NavProps> = ({ type, isDark, setTheme, user }) => {
  const collapseItems = [
    "Friends",
    "Chats",
    "Settings",
    "Company",
    "Login",
    "Sign Up",
  ];
  return (
    <Navbar shouldHideOnScroll isBordered={isDark} variant="sticky">
      <Navbar.Brand>
        <Navbar.Toggle aria-label="toggle navigation" />
        <Logo />
        <Text b color="inherit" hideIn="xs">
          Quicksender
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" variant="underline">
        <Navbar.Link id="1-link" href="#">
          Friends
        </Navbar.Link>
        <Navbar.Link id="2-link" isActive href="#">
          Chats
        </Navbar.Link>
        {/* <Navbar.Link id="3-link" href="#">
            Pricing
          </Navbar.Link>
          <Navbar.Link id="4-link" href="#">
            Company
          </Navbar.Link> */}
      </Navbar.Content>
      <Navbar.Content hideIn="xs" variant="underline">
        <Navbar.Item>
          <>
            {type[0] === "d" ? type.replace("d", "D") : type.replace("l", "L")}{" "}
            theme
          </>
        </Navbar.Item>
        <Navbar.Item>
          <Switch
            title="theme"
            placeholder=""
            size="xs"
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
          />
        </Navbar.Item>
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Item>
          <Button
            title="googleAuthButton"
            auto
            flat
            as={Link}
            // onClick={() => signIn("google")}
          >
            Login
          </Button>
        </Navbar.Item>
        <User name={user?.username} src={user?.avatar}/>
      </Navbar.Content>

      <Navbar.Collapse>
        {collapseItems.map((item, key) => (
          <Navbar.CollapseItem key={item}>
            <Link
              color="inherit"
              css={{
                minWidth: "100%",
              }}
              href="#"
            >
              {item}
            </Link>
          </Navbar.CollapseItem>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;
