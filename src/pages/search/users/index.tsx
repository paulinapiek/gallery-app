import Layout from "@/components/layout";
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { UserProfile } from "@/types";
import { getAllUsers } from "@/repository/user.service";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useUserAuth } from "@/context/userAuthContext";

const Container = styled.div`
  padding: 1rem;
    max-width: 1000px;
    margin: auto;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const StyledSearchInput = styled.input`
  border: 2px solid #d1d5db;
  background-color: #fff;
  height: 2.5rem;
  padding: 0 3rem 0 1rem;
  border-radius: 0.125rem;
  font-size: 1rem;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const UsersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f3f4f6;
  }
`;

const UserAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const UserBio = styled.div`
  font-size: 0.875rem;
  color: #4b5563;
`;

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user } = useUserAuth();

  useEffect(() => {
  const fetchUsers = async () => {
    const currentUserId = user?.uid || "";
    const res = (await getAllUsers(currentUserId)) || [];

    const formattedUsers: UserProfile[] = res.map((profile) => ({
      ...profile,
      displayName: profile.displayName || "Unknown User",
    }));

    setUsers(formattedUsers);
  };

  if (user) {
    fetchUsers();
  }
}, [user]);


  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter(
      (user) => user.displayName?.toLowerCase().includes(lower)
    );
  }, [searchTerm, users]);

  const handleUserClick = (userProfile: UserProfile) => {
    navigate("/search/users/user", { state: { userProfile } });
  };

  return (
    <Layout>
      <Container>
        
        <SearchContainer>
          <StyledSearchInput
            placeholder="Search users..."
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchButton type="button">
            <Search style={{ width: "20px", height: "20px", color: "#9ca3af" }} />
          </SearchButton>
          <p>All Users</p>
        </SearchContainer>
        
        <UsersList>
          {filteredUsers.map((user) => (
            <UserCard key={user.userId} onClick={() => handleUserClick(user)}>
              <UserAvatar src={user.photoURL || ""} alt={user.displayName} />
              <UserInfo>
                <UserName>{user.displayName}</UserName>
                <UserBio>{user.userBio}</UserBio>
              </UserInfo>
            </UserCard>
          ))}
        </UsersList>
      </Container>
    </Layout>
  );
};

export default UsersPage;
