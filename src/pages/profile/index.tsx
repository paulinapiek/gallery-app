import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { useUserAuth } from "@/context/userAuthContext";
import { DocumentResponse, Post, ProfileResponse } from "@/types";
import avatar from "@/assets/images/avatar.png";
import styled from "styled-components";
import { Edit2Icon } from "lucide-react";
import { getPostByUserId } from "@/repository/post.service";
import { useNavigate } from "react-router-dom";
import { getUserProfile, followUser, unfollowUser } from "@/repository/user.service";
import PostCard from "@/components/postCard";
import { StyledButton } from "@/components/StyledComponents/StyledButton";

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

const CardContainer = styled.div`
  border: 1px solid #e2e8f0;
  max-width: 960px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
`;

const HeaderTitle = styled.h3`
  background-color: #1e293b;
  color: #fff;
  text-align: center;
  font-size: 1.125rem;
  padding: 0.5rem;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileTopSection = styled.div`
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
  gap: 1rem;
`;

const AvatarWrapper = styled.div`
  margin-right: 1rem;
`;

const ProfileAvatar = styled.img`
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
  border: 2px solid #1e293b;
  object-fit: cover;
`;

const InfoWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProfileDetails = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ProfileEmailText = styled.div`
  font-size: 1rem;
  color: #4b5563;
`;

const UserBioText = styled.div`
  margin-top: 0.75rem;
  font-size: 1rem;
`;



const EditProfileButton = styled.button`
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const Content = styled.div`
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;

  @media (min-width: 800px) and (max-width: 1399px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Profile: React.FC = () => {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const initialUserInfo: ProfileResponse = {
    id: "",
    userId: user?.uid,
    userBio: "Update your profile",
    photoURL: user?.photoURL || "",
    displayName: user?.displayName || "Guest user",
    followers: [],
  };

  const [userInfo, setUserInfo] = useState<ProfileResponse>(initialUserInfo);
  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  const getUserProfileInfo = async (userId: string) => {
    const profileData: ProfileResponse = (await getUserProfile(userId)) || {};
    if (profileData.displayName) {
      setUserInfo(profileData);
      if (user && profileData.followers && profileData.followers.includes(user.uid)) {
        setIsFollowed(true);
      } else {
        setIsFollowed(false);
      }
    }
  };

  const getAllPost = async (id: string) => {
    try {
      const querySnapshot = await getPostByUserId(id);
      const tempArr: DocumentResponse[] = [];
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const postData = doc.data() as Post;
          const responseObj: DocumentResponse = {
            id: doc.id,
            ...postData,
          };
          tempArr.push(responseObj);
        });
        setPosts(tempArr);
      } else {
        console.log("No posts found");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getAllPost(user.uid);
      getUserProfileInfo(user.uid);
    }
  }, [user]);

  const toggleFollow = async () => {
    if (!user) return;
    try {
      if (isFollowed) {
        await unfollowUser(userInfo.id!, user.uid);
        setIsFollowed(false);
        setUserInfo({
          ...userInfo,
          followers: userInfo.followers.filter((id) => id !== user.uid),
        });
      } else {
        await followUser(userInfo.id!, user.uid);
        setIsFollowed(true);
        setUserInfo({
          ...userInfo,
          followers: [...(userInfo.followers || []), user.uid],
        });
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  const editProfile = () => {
    navigate("/edit-profile", { state: userInfo });
  };

  const renderPosts = () => {
    return posts.map((item) => <PostCard key={item.photos[0].uuid} data={item} />);
  };

  return (
    <Layout>
      <OuterContainer>
        <CardContainer>
          <HeaderTitle>Profile</HeaderTitle>
          <ProfileWrapper>
            <ProfileTopSection>
              <AvatarWrapper>
                <ProfileAvatar src={userInfo.photoURL ? userInfo.photoURL : avatar} alt="avatar" />
              </AvatarWrapper>
              <InfoWrapper>
                <ProfileDetails>{userInfo.displayName}</ProfileDetails>
                <ProfileEmailText>{user?.email || ""}</ProfileEmailText>
                <UserBioText>{userInfo.userBio}</UserBioText>
                {user && user.uid !== userInfo.userId && (
                  <FollowButtonStyled followed={isFollowed} onClick={toggleFollow}>
                    {isFollowed ? "Followed" : "Follow"}
                  </FollowButtonStyled>
                )}
              </InfoWrapper>
              {user && user.uid === userInfo.userId && (
                <StyledButton onClick={editProfile}>
                  <Edit2Icon style={{ marginRight: "0.5rem" }} /> Edit Profile
                </StyledButton>
              )}
            </ProfileTopSection>
            <Content>
              <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>My Posts</h2>
              <Grid>{posts.length > 0 ? renderPosts() : <div>...Loading</div>}</Grid>
            </Content>
          </ProfileWrapper>
        </CardContainer>
      </OuterContainer>
    </Layout>
  );
};


export default Profile;
