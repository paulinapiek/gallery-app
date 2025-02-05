// /pages/search/index.tsx
import Layout from "@/components/layout";
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { DocumentResponse, UserProfile } from "@/types";
import { getPosts } from "@/repository/post.service";
import { getAllUsers } from "@/repository/user.service";
import { useUserAuth } from "@/context/userAuthContext";
import SearchBar from "@/components/searchbar";
import PostCard from "@/components/postCard";


const Container = styled.div`
    padding: 1rem;
    max-width: 1000px;
    margin: auto;
`;

const TabsContainer = styled.div`
display: flex;
border-bottom: 1px solid #e2e8f0;
margin-bottom: 1rem;
`;

const TabItem = styled.div<{ active: boolean }>`
padding: 0.75rem 1.5rem;
cursor: pointer;
font-weight: ${(props) => (props.active ? "bold" : "normal")};
border-bottom: ${(props) => (props.active ? "2px solid #1e293b" : "none")};
`;

const ResultsContainer = styled.div`
margin-top: 3rem;
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

const SearchResultsPage: React.FC = () => {
const { user } = useUserAuth();
const location = useLocation();
const navigate = useNavigate();
const initialSearchTerm = location.state?.searchTerm || "";
const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");
const [posts, setPosts] = useState<DocumentResponse[]>([]);
const [users, setUsers] = useState<UserProfile[]>([]);
const [searchInput, setSearchInput] = useState(initialSearchTerm);

useEffect(() => {
  const fetchPosts = async () => {
    const allPosts = (await getPosts()) || [];
    const postsExcludingSelf = allPosts.filter(
      (post) => post.userId !== user?.uid
    );
    setPosts(postsExcludingSelf);
  };
  fetchPosts();
}, [user]);

useEffect(() => {
  const fetchUsers = async () => {
    const allUsers = (await getAllUsers(user?.uid || "")) || [];
    setUsers(allUsers);
  };
  fetchUsers();
}, [user]);

const filteredPosts = useMemo(() => {
  if (!searchInput) return posts;
  const lowerTerm = searchInput.toLowerCase();
  return posts.filter(
    (post) =>
      post.caption && post.caption.toLowerCase().includes(lowerTerm)
  );
}, [searchInput, posts]);

const filteredUsers = useMemo(() => {
  if (!searchInput) return users;
  const lowerTerm = searchInput.toLowerCase();
  return users.filter(
    (user) =>
      user.displayName && user.displayName.toLowerCase().includes(lowerTerm)
  );
}, [searchInput, users]);

const suggestions = useMemo(() => {
  if (activeTab === "posts") {
    return filteredPosts.slice(0, 5).map((item) => ({
      key: item.id,
      content: (
        <div
          onClick={() => setSearchInput(item.caption || item.username || "")}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src={
              item.photos && item.photos.length > 0 ? item.photos[0].cdnUrl : ""
            }
            alt="post"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "4px",
              objectFit: "cover",
              marginRight: "0.75rem",
            }}
          />
          <div style={{ fontSize: "0.875rem", color: "#374151" }}>
            {item.caption ? item.caption.substring(0, 30) : "No caption"}
          </div>
        </div>
      ),
    }));
  } else {
    return filteredUsers.slice(0, 5).map((item) => ({
      key: item.userId,
      content: (
        <div
          onClick={() =>
            navigate("/search/users/user", { state: { userProfile: item } })
          }
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src={item.photoURL || ""}
            alt={item.displayName}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "0.75rem",
            }}
          />
          <div style={{ fontSize: "0.875rem", color: "#374151" }}>
            {item.displayName}
          </div>
        </div>
      ),
    }));
  }
}, [activeTab, filteredPosts, filteredUsers, navigate]);

return (
  <Layout>
    <Container>
      {/* Komponent SearchBar */}
      <SearchBar
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onSearch={() => {}}
        suggestions={suggestions.map((s) => s.content)}
        placeholder="Search posts or users..."
      />

      {/* Zakładki */}
      <TabsContainer>
        <TabItem active={activeTab === "posts"} onClick={() => setActiveTab("posts")}>
          Posts
        </TabItem>
        <TabItem active={activeTab === "users"} onClick={() => setActiveTab("users")}>
          Users
        </TabItem>
      </TabsContainer>

      {/* Wyniki wyszukiwania */}
      <ResultsContainer>
        {activeTab === "posts" ? (
          <PostsGrid>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <PostCard key={post.id} data={post} />)
            ) : (
              <div>No posts found</div>
            )}
          </PostsGrid>
        ) : (
          <UsersList>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard
                  key={user.userId}
                  onClick={() =>
                    navigate("/search/users/user", { state: { userProfile: user } })
                  }
                >
                  <UserAvatar src={user.photoURL || ""} alt={user.displayName} />
                  <UserInfo>
                    <UserName>{user.displayName}</UserName>
                    <UserBio>{user.userBio}</UserBio>
                  </UserInfo>
                </UserCard>
              ))
            ) : (
              <div>No users found</div>
            )}
          </UsersList>
        )}
      </ResultsContainer>
    </Container>
  </Layout>
);
};

export default SearchResultsPage;
