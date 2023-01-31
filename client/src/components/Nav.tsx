import { UserDefinition } from "@/pages";
import { Button, Link, Navbar, Switch, Text, User } from "@nextui-org/react";
import { FunctionComponent, useState } from "react";
interface NavProps {
  type: string;
  user: UserDefinition | undefined;
  isDark: boolean | undefined;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setTheme: (theme: string) => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserDefinition>>;
}
import { Logo } from "../pages/Logo";

const Nav: FunctionComponent<NavProps> = ({
  type,
  isDark,
  setTheme,
  user,
  setCurrentUser,
  setToggleSidebar,
}) => {
  const [activeLink, setActiveLink] = useState<boolean | undefined>(undefined);
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
        <Navbar.Link
          id="1-link"
          href="#"
          isActive={activeLink === undefined ? undefined : activeLink}
          onClick={() => {
            setActiveLink(true);
            setToggleSidebar(true);
          }}
        >
          Friends
        </Navbar.Link>
        <Navbar.Link
          id="2-link"
          isActive={activeLink === undefined ? undefined : !activeLink}
          href="#"
          onClick={() => {
            setActiveLink(false);
          }}
        >
          Chats
        </Navbar.Link>
        {/* <Navbar.Link id="3-link" href="#">
            Pricing
          </Navbar.Link>
          <Navbar.Link id="4-link" href="#">
            Company
          </Navbar.Link> */}
      </Navbar.Content>
      <Navbar.Content>
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
        <Navbar.Item>
          <User name={user?.username} src={user?.avatar} />
        </Navbar.Item>
        <Navbar.Item>
          <Button
            title="googleAuthButton"
            auto
            flat
            as={Link}
            onClick={() => {
              setCurrentUser((u) => {
                u.loggedIn = false;
                return { ...u };
              });
              console.log(user);
            }}
            // onClick={() => signIn("google")}
          >
            Logout
          </Button>
        </Navbar.Item>
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
