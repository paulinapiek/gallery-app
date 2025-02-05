// /pages/search/users/user.tsx
import React, { useEffect, useState, useMemo } from "react";
import Layout from "@/components/layout";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { UserProfile, DocumentResponse } from "@/types";
import { getPostByUserId } from "@/repository/post.service";
import PostCard from "../../../../components/postCard";
import avatar from "@/assets/images/avatar.png";
import { useUserAuth } from "@/context/userAuthContext";

/* Styled Components */

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

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 600px;
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

const FilterText = styled.p`
  font-size: 0.875rem;
  color: #374151;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const PostsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr; /* domyślnie 1 kolumna */
  @media (min-width: 800px) and (max-width: 1399px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PostWrapper = styled.div`
  height: 250px;
  width: 100%;
  overflow: hidden;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* Główny komponent UserDetailPage */
const UserDetailPage: React.FC = () => {
  const location = useLocation();
  const userProfile: UserProfile | undefined = location.state?.userProfile;
  const { user } = useUserAuth();
  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [searchInput, setSearchInput] = useState("");

  // Pobieramy posty danego użytkownika
  useEffect(() => {
    const fetchPosts = async () => {
      if (userProfile?.userId) {
        try {
          const querySnapshot = await getPostByUserId(userProfile.userId);
          const tempPosts: DocumentResponse[] = [];
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
              const postData = doc.data() as DocumentResponse;
              const responseObj: DocumentResponse = {
                id: doc.id,
                ...postData,
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

  // Opcjonalnie – filtrowanie postów po caption, jeśli użytkownik wpisze coś w wyszukiwarce
  const filteredPosts = useMemo(() => {
    if (!searchInput) return posts;
    const lowerTerm = searchInput.toLowerCase();
    return posts.filter(
      (post) =>
        post.caption && post.caption.toLowerCase().includes(lowerTerm)
    );
  }, [searchInput, posts]);

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
        {/* Profil użytkownika */}
        <ProfileHeader>
          <Avatar src={userProfile.photoURL || avatar} alt={userProfile.displayName} />
          <InfoContainer>
            <Name>{userProfile.displayName}</Name>
            <Bio>{userProfile.userBio}</Bio>
          </InfoContainer>
        </ProfileHeader>

        <PostsGrid>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} data={post} />)
          ) : (
            <div>No posts found</div>
          )}
        </PostsGrid>
      </Container>
    </Layout>
  );
};

export default UserDetailPage;
