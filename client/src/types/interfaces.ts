import { UserDefinition } from "@/pages";

export interface SidebarProps {
  activeLink: string;
  setActiveLink: React.Dispatch<React.SetStateAction<string>>;
  friends: UserDefinition[];
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface LogoProps {
  width?: number;
  height?: number;
}
