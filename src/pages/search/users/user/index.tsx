// /pages/search/users/user.tsx
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { UserProfile, DocumentResponse } from "@/types";
import { getPostByUserId } from "@/repository/post.service";
import PostCard from "../../../../components/postCard";
import avatar from "@/assets/images/avatar.png";

const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: auto;
`;

const ProfileHeader = styled.div`
  width: 100%;
  max-width: 600px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1e293b;
  margin-right: 1.5rem;
`;

const InfoContainer = styled.div`
  flex: 1;
  text-align: left;
`;

const Name = styled.h2`
  font-size: 1.75rem;
  margin: 0 0 0.5rem;
`;

const Bio = styled.p`
  font-size: 1rem;
  color: #4b5563;
`;

const PostsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  @media (min-width: 800px) and (max-width: 1399px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const UserDetailPage: React.FC = () => {
  const location = useLocation();
  const userProfile: UserProfile | undefined = location.state?.userProfile;
  const [posts, setPosts] = useState<DocumentResponse[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (userProfile?.userId) {
        try {
          const querySnapshot = await getPostByUserId(userProfile.userId);
          const tempPosts: DocumentResponse[] = [];
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
              const postData = doc.data() as DocumentResponse;
              const { id: _, ...rest } = postData;
              const responseObj: DocumentResponse = {
                id: doc.id,
                ...rest,
              };
              tempPosts.push(responseObj);
            });
          }
          setPosts(tempPosts);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      }
    };
    fetchPosts();
  }, [userProfile]);

  if (!userProfile) {
    return (
      <Layout>
        <Container>
          <div>User not found</div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <ProfileHeader>
          <Avatar src={userProfile.photoURL || avatar} alt={userProfile.displayName} />
          <InfoContainer>
            <Name>{userProfile.displayName}</Name>
            <Bio>{userProfile.userBio}</Bio>
          </InfoContainer>
        </ProfileHeader>

        <PostsGrid>
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} data={post} />)
          ) : (
            <div>No posts found</div>
          )}
        </PostsGrid>
      </Container>
    </Layout>
  );
};

export default UserDetailPage;
