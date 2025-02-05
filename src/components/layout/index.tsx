import React from "react";
import styled from "styled-components";
import Sidebar from "@/components/sidebar";
import UserList from "@/components/userList";

interface ILayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  background: #ffffff;
`;

const LeftAside = styled.aside`
  display: flex;
  gap: 1rem;
  background: #000000; 
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  height: 100vh;

  @media (min-width: 1024px) {
    width: 15rem;
  }
`;

const RightAside = styled.aside`
  display: none;      
  background: #000000; 
  position: fixed;
  top: 0;
  right: 0;
  z-index: 40;
  height: 100dvh; 

  @media (min-width: 1024px) {
    display: block;
    width: 15rem;
  }
`;

const MainContent = styled.div`
  flex: 1;            
  padding: 2rem;      
  margin-left: 9rem; 

  @media (min-width: 1024px) {
    margin-left: 15rem;
    margin-right: 15rem;
  }
`;

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <LeftAside>
        <Sidebar />
      </LeftAside>

      <MainContent>{children}</MainContent>

      <RightAside>
        <UserList />
      </RightAside>
    </LayoutContainer>
  );
};

export default Layout;
