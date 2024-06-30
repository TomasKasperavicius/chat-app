import React, { FunctionComponent, Key, useEffect, useRef } from "react";
import { SidebarProps } from "@/types/interfaces";
import { UserDefinition } from "@/pages";
import { Col, Divider, User } from "@nextui-org/react";
import router from "next/router";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const Sidebar: FunctionComponent<SidebarProps> = ({
  friends,
  setToggleSidebar,
}) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setToggleSidebar(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <Col
      span={2}
      className={`fixed z-50 bg-black `}
      css={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: "solid",
      }}
    >
      <div ref={sidebarRef}>
        <div className="flex justify-around p-2">
          Friends online: {friends.length}
          <HighlightOffIcon
            onClick={() => setToggleSidebar(false)}
            className="hover:opacity-70 cursor-pointer"
          />
        </div>
        <div className="m-2">
          <Divider className="my-4" />
          {friends.length > 0 &&
            friends.map((friend: UserDefinition, key: Key) => (
              <div key={key} className="w-full m-5">
                <User
                  name={friend.username}
                  src={friend.avatar}
                  zoomed
                  pointer
                  onClick={() => router.push(`/chat/${friend.privateChatID}`)}
                />
              </div>
            ))}
        </div>
      </div>
    </Col>
  );
};

export default Sidebar;
