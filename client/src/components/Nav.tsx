import { UserDefinition } from "@/pages";
import {
  Button,
  Dropdown,
  Link,
  Navbar,
  Switch,
  Text,
  User,
} from "@nextui-org/react";
import { FunctionComponent, useState } from "react";
interface NavProps {
  type: string;
  user: UserDefinition | undefined;
  isDark: boolean | undefined;
  notifications: React.FunctionComponent<{}>[];
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setTheme: (theme: string) => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserDefinition>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<React.FunctionComponent<{}>[]>
  >;
}
import { Logo } from "../pages/Logo";

const Nav: FunctionComponent<NavProps> = ({
  type,
  isDark,
  setTheme,
  user,
  setCurrentUser,
  setToggleSidebar,
  notifications,
  setNotifications,
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
  const [toggleNotifications, setToggleNotifications] = useState<boolean>(false);
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
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <div className="relative">
                <User
                  name={user?.username}
                  src={user?.avatar}
                  zoomed
                  pointer
                  css={{ position: "relative", zIndex: 0 }}
                />
                {notifications.length > 0 ? (
                  <span className="absolute top-0 right-24 rounded-full w-5 h-5 bg-red-600 text-center flex items-center justify-center">
                    1
                  </span>
                ) : (
                  <span></span>
                )}
              </div>
            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu aria-label="User menu actions" color="secondary">
            <Dropdown.Item key="profile" className="flex">
              <Text color="inherit">Signed in as:</Text>
              <Text color="inherit">{user?.username}</Text>
            </Dropdown.Item>
            <Dropdown.Item key="Notifications" withDivider>
              <div className="flex items-center relative">
                Notifications
                {notifications.length > 0 ? (
                  <span className="absolute top-0 right-24 rounded-full w-5 h-5 bg-red-600 text-center flex items-center justify-center">
                    1
                  </span>
                ) : (
                  <span></span>
                )}
              </div>
            </Dropdown.Item>
            <Dropdown.Item key="logout" withDivider>
              <Button
                css={{ background: "transparent" }}
                className="hover:opacity-70"
                color="default"
                onClick={() => {
                  setCurrentUser((u) => {
                    u.loggedIn = false;
                    return { ...u };
                  });
                }}
              >
                Log Out
              </Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
