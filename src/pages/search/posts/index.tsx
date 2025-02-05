// /pages/result/posts/index.tsx
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import Layout from "@/components/layout";
import { getPosts } from "@/repository/post.service";
import { DocumentResponse } from "@/types";
import PostCard from "@/components/postCard";
import { useUserAuth } from "@/context/userAuthContext";

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

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  width: 100%;
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

const Container = styled.div`
  padding: 1rem;
  max-width: 1000px;
  margin: auto;
`;

// --- GŁÓWNY KOMPONENT STRONY ---
const SearchPostsPage: React.FC = () => {
  const { user } = useUserAuth();    // pobieramy zalogowanego użytkownika
  const [posts, setPosts] = useState<DocumentResponse[]>([]);
  const [searchInput, setSearchInput] = useState("");

  // 1. Pobieramy wszystkie posty z bazy
  useEffect(() => {
    const fetchPosts = async () => {
      const res = (await getPosts()) || [];
      setPosts(res);
    };
    fetchPosts();
  }, []);

  // 2. Filtrowanie postów w zależności od wpisanej frazy ORAZ
  //    usunięcie z listy tych postów, które należą do aktualnie zalogowanego usera
  const filteredPosts = useMemo(() => {
    // Krok A: wykluczamy posty zalogowanego usera
    const postsWithoutCurrentUser = posts.filter(
      (post) => post.userId !== user?.uid
    );

    // Krok B: jeśli nie ma wpisanej frazy, zwracamy wszystkie (bez postów usera)
    if (!searchInput) return postsWithoutCurrentUser;

    // Krok C: jeżeli jest wpisana fraza, filtrujemy też po nazwie użytkownika lub caption
    const lower = searchInput.toLowerCase();
    return postsWithoutCurrentUser.filter(
      (post) =>
        (post.username && post.username.toLowerCase().includes(lower)) ||
        (post.caption && post.caption.toLowerCase().includes(lower))
    );
  }, [searchInput, posts, user]);

  return (
    <Layout>
      <Container>
        <SearchContainer>
          <StyledSearchInput
            placeholder="Search posts..."
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <FilterText>Filter by posts</FilterText>
        </SearchContainer>

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

export default SearchPostsPage;
