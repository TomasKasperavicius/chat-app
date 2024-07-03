import { UserDefinition } from "@/pages";

export interface SidebarProps {
  friends: UserDefinition[];
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface LogoProps {
  width?: number;
  height?: number;
}
