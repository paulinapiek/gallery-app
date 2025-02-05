//pages/home/index.tsx
import Layout from "@/components/layout";
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useUserAuth } from "@/context/userAuthContext";
import { getPosts } from "@/repository/post.service";
import { getAllUsers } from "@/repository/user.service";
import { DocumentResponse, UserProfile } from "@/types";
import { useNavigate } from "react-router-dom";
import StyledPostCard from "@/components/postCard";

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 1000px;
    margin: auto;
`;

const FeedContainer = styled.div`
  margin-bottom: 1.25rem;
`;

const FeedGrid = styled.div`
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

const Home: React.FC = () => {
  const { user } = useUserAuth();
  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const navigate = useNavigate();

  // Pobieramy posty z backendu
  const fetchPosts = async () => {
    const res = await getPosts();
    const postsExcludingSelf = res?.filter(
      (post) => post.userId !== user?.uid
    );
    setPosts(postsExcludingSelf || []);
  };

  const fetchUsers = async () => {
    const res = await getAllUsers(user?.uid || "");
    setUsers(res || []);
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchUsers();
    }
  }, [user]);

  const handleSearch = (searchTerm: string, activeTab: "posts" | "users") => {
    navigate("/search", { state: { searchTerm, activeTab } });
  };

  const renderFeed = () => (
    <FeedGrid>
      {posts.length > 0 ? (
        posts.map((post) => <StyledPostCard key={post.id} data={post} />)
      ) : (
        <div>...Loading</div>
      )}
    </FeedGrid>
  );

  return (
    <Layout>
      <HomeContainer>
        <FeedContainer>
          {renderFeed()}
        </FeedContainer>
      </HomeContainer>
    </Layout>
  );
};

export default Home;
