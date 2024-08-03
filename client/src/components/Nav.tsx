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
import { useRouter } from "next/router";
import { FunctionComponent, useState, useContext } from "react";
interface NavProps {
  toggleSideBar: boolean;
  notifications: React.FunctionComponent<{}>[];
  seenNewNotifications: boolean;
  activeLink: string;
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setNotifications: React.Dispatch<
    React.SetStateAction<React.FunctionComponent<{}>[]>
  >;
  setToggleNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setSeenNewNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveLink: React.Dispatch<React.SetStateAction<string>>;
}

import { Logo } from "../pages/Logo";
import { UserContext, UserContextType } from "@/Providers/UserContext";

const Nav: FunctionComponent<NavProps> = ({
  notifications,
  toggleSideBar,
  seenNewNotifications,
  activeLink,
  setActiveLink,
  setToggleSidebar,
  setNotifications,
  setSeenNewNotifications,
  setToggleNotifications,
}: NavProps) => {
  const collapseItems = [
    "Friends",
    "Chats",
    "Settings",
    "Company",
    "Login",
    "Sign Up",
  ];
  const links = ["Friends", "Chats"];
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
  const router = useRouter();
  const { user, setCurrentUser } = useContext<UserContextType>(UserContext);
  return (
    <Navbar
      shouldHideOnScroll
      isBordered={isDark}
      borderWeight="bold"
      variant="sticky"
    >
      <Navbar.Brand>
        <Navbar.Toggle aria-label="toggle navigation" />
        <Logo />
        <Text b color="inherit" hideIn="xs">
          Quicksender
        </Text>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" variant="underline">
        {links.map((link, id) => {
          return (
            <Navbar.Link
              key={`${link}-link`}
              id={`${link}-link`}
              href="#"
              isActive={link === activeLink}
              onClick={() => {
                setActiveLink(link === activeLink ? "" : link);
                if (link === "Friends" || activeLink === "Friends")
                  setToggleSidebar(!toggleSideBar);
              }}
            >
              {link}
            </Navbar.Link>
          );
        })}
      </Navbar.Content>
      <Navbar.Content>
        <Navbar.Item>
          <>{type[0].toUpperCase() + type.slice(1)} theme</>
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
          <Dropdown.Menu aria-label="User menu actions" color="primary">
            <Dropdown.Item key="profile" className="flex">
              <Text color="inherit">Signed in as: {user?.username}</Text>
            </Dropdown.Item>
            <Dropdown.Item key="Notifications" withDivider>
              <div
                className="flex items-center relative"
                onClick={() => {
                  setSeenNewNotifications(true);
                  router.push("/notifications");
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
              <div
                onClick={() => {
                  setCurrentUser((u: UserDefinition) => {
                    u.loggedIn = false;
                    return { ...u };
                  });
                }}
              >
                Log out
              </div>
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
