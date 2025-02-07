// pages/myphotos/index.tsx
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout";
import styled from "styled-components";
import { useUserAuth } from "@/context/userAuthContext";
import { getPostByUserId } from "@/repository/post.service";
import { DocumentResponse, Post } from "@/types";
import { HeartIcon, ChevronLeft, ChevronRight } from "lucide-react";

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
  background: #fff;
`;

const Header = styled.h3`
  background-color: #1e293b;
  color: #fff;
  text-align: center;
  font-size: 1.125rem;
  padding: 0.5rem;
`;

const Content = styled.div`
  padding: 2rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;


const PhotoItemContainer = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  transition: background-color 0.2s, opacity 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  ${PhotoItemContainer}:hover & {
    background-color: rgba(15, 23, 42, 0.75);
    opacity: 1;
  }
`;

const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
`;

const StyledImage = styled.img`
  width: 100%;
  display: block;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  padding: 0.5rem;
  cursor: pointer;
  z-index: 2;
`;

const LeftArrowButton = styled(ArrowButton)`
  left: 0.5rem;
`;

const RightArrowButton = styled(ArrowButton)`
  right: 0.5rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
`;

const ModalImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 0rem;
  right: 12px;
  background: transparent;
  border: none;
  color: black;
  font-size: 2rem;
  cursor: pointer;
`;

const ModalArrowButton = styled(ArrowButton)``;

const ModalLeftArrow = styled(ModalArrowButton)`
  left: 1rem;
`;

const ModalRightArrow = styled(ModalArrowButton)`
  right: 1rem;
`;

const DownloadButton = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 4px;
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

interface PhotoItemProps {
  item: DocumentResponse;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ item }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const photos = item.photos;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(photos[currentIndex].cdnUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `photo_${item.id}_${currentIndex}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <>
      <PhotoItemContainer onClick={() => setIsModalOpen(true)}>
        <Overlay>
          <OverlayContent>
            <HeartIcon fill="#fff" size={24} />
            <div>{item.likes} likes</div>
          </OverlayContent>
        </Overlay>
        <StyledImage
          src={`${photos[currentIndex].cdnUrl}/-/progressive/yes/-/scale_crop/300x300/center/`}
          alt="photo"
        />
        {photos.length > 1 && (
          <>
            <LeftArrowButton onClick={handlePrev}>
              <ChevronLeft size={20} />
            </LeftArrowButton>
            <RightArrowButton onClick={handleNext}>
              <ChevronRight size={20} />
            </RightArrowButton>
          </>
        )}
      </PhotoItemContainer>
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setIsModalOpen(false)}>
              ×
            </ModalCloseButton>
            {photos.length > 1 && (
              <ModalLeftArrow onClick={handlePrev}>
                <ChevronLeft size={30} />
              </ModalLeftArrow>
            )}
            <ModalImage src={photos[currentIndex].cdnUrl} alt="photo modal" />
            {photos.length > 1 && (
              <ModalRightArrow onClick={handleNext}>
                <ChevronRight size={30} />
              </ModalRightArrow>
            )}
            <DownloadButton onClick={handleDownload}>
              Download
            </DownloadButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};


const MyPhotos: React.FC = () => {
  const { user } = useUserAuth();
  const [data, setData] = useState<DocumentResponse[]>([]);

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
          console.log("The response object is:", responseObj);
          tempArr.push(responseObj);
        });
        setData(tempArr);
      } else {
        console.log("No posts found");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user != null) {
      getAllPost(user.uid);
    }
  }, [user]);

  const renderPost = () => {
    return data.map((item) => (
      <PostWrapper key={item.photos[0].uuid}>
        <PhotoItem item={item} />
      </PostWrapper>
    ));
  };

  return (
    <Layout>
      <OuterContainer>
        <CardContainer>
          <Header>My Photos</Header>
          <Content>
            <Grid>{data.length > 0 ? renderPost() : <div>...Loading</div>}</Grid>
          </Content>
        </CardContainer>
      </OuterContainer>
    </Layout>
  );
};

export default MyPhotos;
