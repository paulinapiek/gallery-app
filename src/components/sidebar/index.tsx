import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserAuth } from "../../context/userAuthContext";
import {
  SidebarContainer,
  SidebarLogo,
  SidebarItem,
  SidebarLink,
  SidebarIcon,
} from "../../components/StyledComponents/StyledSidebar";
import logoutIcon from "../../assets/icons/logout.svg";
import home from "../../assets/icons/home.svg";
import addIcon from "../../assets/icons/add.svg";
import myphotosIcon from "../../assets/icons/myphotos.svg";
import profileIcon from "../../assets/icons/profile.svg";
import SearchIcon  from "../../assets/icons/search.svg";
import SearchPosts from "../../assets/icons/posts.png";
import SearchUsers from "../../assets/icons/users.png"

const navItems = [
  { name: "Home", link: "/", icon: home },
  { name: "Search", link: "/search", icon: SearchIcon },
  { name: "Posts", link: "/search/posts", icon: SearchPosts },
  { name: "Users", link: "/search/users", icon: SearchUsers },
  { name: "Add post", link: "/post", icon: addIcon },
  { name: "My Photos", link: "/myphotos", icon: myphotosIcon },
  { name: "Profile", link: "/profile", icon: profileIcon },
];


const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { logOut } = useUserAuth();

  return (
    <SidebarContainer>
      <SidebarLogo>P1nterest</SidebarLogo>

      {navItems.map((item) => (
        <SidebarItem key={item.name} isActive={pathname === item.link}>
          <SidebarLink to={item.link}>
            <SidebarIcon src={item.icon} alt={item.name} isActive={pathname === item.link} />
            {item.name}
          </SidebarLink>
        </SidebarItem>
      ))}

      <SidebarItem isActive={pathname === "/login"}>
        <SidebarLink to="/login" onClick={logOut}>
          <SidebarIcon src={logoutIcon} alt="Logout" isActive={pathname === "/login"} />
          Logout
        </SidebarLink>
      </SidebarItem>
    </SidebarContainer>
  );
};

export default Sidebar;
