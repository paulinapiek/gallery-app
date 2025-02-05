import styled from "styled-components";
import { Link } from "react-router-dom";

export const SidebarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 240px;
  width: 100%;
  background-color: #000000;
  padding: 1rem;
`;

export const SidebarLogo = styled.div`
  text-align: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

export const SidebarItem = styled.div<{ isActive: boolean }>`
  background-color: ${({ isActive }) => (isActive ? "#ffffff" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#1e293b" : "white")};
  transition: background-color 0.3s ease;
  border-radius: 5px;
  margin-bottom: 0.5rem;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#ffffff" : "#334155")};
  }
`;

export const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
    padding: 10px 15px;

`;

export const SidebarIcon = styled.img<{ isActive: boolean }>`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  filter: ${({ isActive }) => (isActive ? "invert(0)" : "invert(1)")};
`;
