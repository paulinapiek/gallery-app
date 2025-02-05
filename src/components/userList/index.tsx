import React, { useEffect, useState } from "react";
import { getAllUsers } from "@/repository/user.service";
import { ProfileResponse } from "@/types";
import { useUserAuth } from "@/context/userAuthContext.tsx";
import avatar from "@/assets/images/avatar.png";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  color: white;
  padding: 2rem 0.75rem;
  background: #000000;
`;

const ProfileLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  border-bottom: 1px solid #cbd5e0;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px; 
  border-radius: 50%;
  border: 2px solid #000000;
  object-fit: cover;
  margin-right: 0.5rem;
`;

const ProfileName = styled.span`
  font-size: 0.75rem;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  color: #94a3b8;
`;

const UsersContainer = styled.div`
  margin: 1rem 0;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #2a2a2a;
  object-fit: cover;
  margin-right: 0.5rem;
`;

const UserName = styled.span`
  font-size: 0.75rem;
`;

const FollowButton = styled.button`
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  height: 1.5rem;
  background-color: blue;
  margin-left: auto;
  align-items: center;
  display: flex;
`;

const UserList: React.FC = () => {
  const { user } = useUserAuth();
  const [suggestedUser, setSuggestedUser] = useState<ProfileResponse[]>([]);

  const getSuggestedUsers = async (userId: string) => {
    const response = (await getAllUsers(userId)) || [];
    console.log("UserList response: ", response);
    setSuggestedUser(response);
  };

  useEffect(() => {
    if (user?.uid != null) {
      getSuggestedUsers(user.uid);
    }
  }, [user]);

  const renderUsers = () => {
    return suggestedUser.map((userItem) => {
      return (
        <UserItem key={userItem.id}>
          <UserAvatar
            src={userItem.photoURL ? userItem.photoURL : avatar}
            alt="user avatar"
          />
          <UserName>
            {userItem.displayName ? userItem.displayName : "Guest user"}
          </UserName>
          <FollowButton>Follow</FollowButton>
        </UserItem>
      );
    });
  };

  return (
    <Container>
      <ProfileLink to="/profile">
        <ProfileContainer>
          <ProfileImage
            src={user?.photoURL ? user.photoURL : avatar}
            alt="profile avatar"
          />
          <ProfileName>
            {user?.displayName ? user.displayName : "Guest user"}
          </ProfileName>
        </ProfileContainer>
      </ProfileLink>
      <Title>Suggested friends</Title>
      <UsersContainer>{suggestedUser.length > 0 ? renderUsers() : null}</UsersContainer>
    </Container>
  );
};

export default UserList;
