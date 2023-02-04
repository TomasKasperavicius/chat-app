import { UserDefinition } from "@/pages";
import {
  Button,
  Dropdown,
  Link,
  Navbar,
  Switch,
  Text,
  User,
  useTheme,
} from "@nextui-org/react";
import { useTheme as useNextTheme } from "next-themes";
import { FunctionComponent, useState } from "react";
interface NavProps {
  user: UserDefinition | undefined;
  notifications: React.FunctionComponent<{}>[];
  seenNewNotifications: boolean;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserDefinition>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<React.FunctionComponent<{}>[]>
  >;
  setToggleNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setSeenNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}
import { Logo } from "../pages/Logo";

const Nav: FunctionComponent<NavProps> = ({
  user,
  notifications,
  seenNewNotifications,
  setCurrentUser,
  setToggleSidebar,
  setNotifications,
  setSeenNewNotifications,
  setToggleNotifications,
}: NavProps) => {
  const [activeLink, setActiveLink] = useState<boolean[] | undefined[]>([
    undefined,
    undefined,
    undefined,
  ]);
  const collapseItems = [
    "Friends",
    "Chats",
    "Settings",
    "Company",
    "Login",
    "Sign Up",
  ];
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
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
          key="friends-link"
          id="friends-link"
          href="#"
          isActive={activeLink[0]}
          onClick={() => {
            setActiveLink((arr: any) => {
              arr[0] = true;
              arr[1] = undefined;
              arr[2] = undefined;
              return [...arr];
            });
            setToggleSidebar((e) => {
              const b = !e;
              return b;
            });
          }}
        >
          Friends
        </Navbar.Link>
        <Navbar.Link
        key="chats-link"
          id="chats-link"
          isActive={activeLink[1]}
          href="#"
          onClick={() => {
            setActiveLink((arr: any) => {
              arr[0] = undefined;
              arr[1] = true;
              arr[2] = undefined;
              return [...arr];
            });
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
                {!seenNewNotifications && notifications.length > 0 ? (
                  <span className="absolute top-0 rounded-full w-5 h-5 bg-red-600 text-center flex items-center justify-center">
                    {notifications.length}
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
              <div
                className="flex items-center relative"
                onClick={() => {
                  setSeenNewNotifications(true);
                  setToggleNotifications(true);
                }}
              >
                Notifications
                {!seenNewNotifications ? (
                  <span className="absolute top-0 right-24 rounded-full w-5 h-5 bg-red-600 text-center flex items-center justify-center">
                    {notifications.length}
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
