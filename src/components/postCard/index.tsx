import React, { useState } from "react";
import styled from "styled-components";
import {
  HeartIcon,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
  MoreHorizontal,
} from "lucide-react";
import { DocumentResponse } from "@/types";
import { useUserAuth } from "@/context/userAuthContext";
import {
  updateLikesOnPost,
  addCommentToPost,
  deletePost,
  updatePost,
} from "@/repository/post.service";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  data: DocumentResponse;
}

const Card = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
  position: relative;
`;

const CardHeader = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1e293b;
  margin-right: 0.5rem;
`;

const Username = styled.span`
  font-size: 0.875rem;
  font-weight: bold;
  cursor: pointer;
`;

const FollowButton = styled.button<{ followed: boolean }>`
  font-size: 10px;
  border-radius: 12px;
  padding: 5px 12px;
  background-color: ${(props) => (props.followed ? "#10B981" : "#3b82f6")};
  color: #fff;
  border: none;
  cursor: pointer;
  margin-left: 8px;
`;

const MoreButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
`;

const OptionsDropdown = styled.div`
  position: absolute;
    top: 4.5rem;
    right: 0;
    background: #fff;
    border: 1px solid #e2e8f0;
    /* border-radius: 4px; */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    width: 100%;
`;

const OptionItem = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background-color: #f3f4f6;
  }
`;

const CardContent = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
`;

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;



const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
`;

const LeftArrowButton = styled(ArrowButton)`
  left: 8px;
`;

const RightArrowButton = styled(ArrowButton)`
  right: 8px;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  transition: background 0.2s, opacity 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  &:hover {
    background: rgba(15, 23, 42, 0.75);
    opacity: 1;
  }
`;

const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
`;

const CardFooter = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const IconsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const LikesText = styled.div`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const Caption = styled.div`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  strong {
    margin-right: 0.25rem;
  }
`;

const FullPostModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const FullPostModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 350px;
  height: 480px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1px;
  right: 18px;
  background: transparent;
  border: none;
  color: black;
  font-size: 2rem;
  cursor: pointer;
`;

const FullPostModalScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 25px;
`;

const ModalCommentInputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
`;

const ModalCommentInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const ModalCommentButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
`;

const CommentsContainer = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const CommentText = styled.span`
  flex: 1;
`;

const DeleteCommentButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  margin-left: 8px;
`;

const PhotoCounter = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 0.75rem;
`;

const PostCard: React.FC<PostCardProps> = ({ data }) => {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const [likes, setLikes] = useState<number>(data.likes || 0);
  const [isLiked, setIsLiked] = useState<boolean>(
    data.userlikes ? data.userlikes.includes(user?.uid || "") : false
  );

  const [comments, setComments] = useState<string[]>(data.comments || []);

  const [isFollowed, setIsFollowed] = useState<boolean>(false);

  const photos = data.photos || [];
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [showFullPostModal, setShowFullPostModal] = useState<boolean>(false);
  const [modalNewComment, setModalNewComment] = useState<string>("");

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedCaption, setEditedCaption] = useState<string>(data.caption || "");

  const toggleLike = async () => {
    let newLikes;
    let newUserlikes = data.userlikes ? [...data.userlikes] : [];
    if (isLiked) {
      newLikes = likes - 1;
      setIsLiked(false);
      if (user?.uid) {
        newUserlikes = newUserlikes.filter((uid) => uid !== user.uid);
      }
    } else {
      newLikes = likes + 1;
      setIsLiked(true);
      if (user?.uid && !newUserlikes.includes(user.uid)) {
        newUserlikes.push(user.uid);
      }
    }
    setLikes(newLikes);
    try {
      await updateLikesOnPost(data.id!, newUserlikes, newLikes);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Carousel handlers
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const toggleFollow = () => {
    if (user && data.userId !== user.uid) {
      setIsFollowed(!isFollowed);
    }
  };

  const handleModalAddComment = async () => {
    if (modalNewComment.trim()) {
      const comment = `${user?.displayName || "Guest"}: ${modalNewComment}`;
      const updatedComments = [...comments, comment];
      try {
        await addCommentToPost(data.id!, updatedComments);
        setComments(updatedComments);
        setModalNewComment("");
      } catch (error) {
        console.error("Error updating comments:", error);
      }
    }
  };

  // Usuwanie komentarza – tylko własnych komentarzy
  const handleDeleteComment = async (index: number) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    try {
      await addCommentToPost(data.id!, updatedComments);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Opcje edycji posta – tylko dla autora posta
  const handleEditPost = async () => {
    try {
      await updatePost(data.id!, { caption: editedCaption });
      setIsEditing(false);
      setShowOptions(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(data.id!);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Przekierowanie do profilu użytkownika po kliknięciu w Username
  const handleUsernameClick = () => {
    navigate("/search/users/user", {
      state: { userProfile: { userId: data.userId, displayName: data.username, photoURL: data.photoURL } },
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <HeaderLeft>
            <ProfileImage src={data.photoURL} alt={data.username} />
            <Username onClick={handleUsernameClick}>{data.username || "Guest_user"}</Username>
          </HeaderLeft>
          {user && data.userId !== user.uid ? (
            <FollowButton followed={isFollowed} onClick={toggleFollow}>
              {isFollowed ? "Followed" : "Follow"}
            </FollowButton>
          ) : (
            user && data.userId === user.uid && (
              <MoreButton onClick={() => setShowOptions(!showOptions)}>
                <MoreHorizontal size={20} />
              </MoreButton>
            )
          )}
          {showOptions && (
            <OptionsDropdown>
              <OptionItem onClick={() => setIsEditing(true)}>Edit Post</OptionItem>
              <OptionItem onClick={handleDeletePost}>Delete Post</OptionItem>
            </OptionsDropdown>
          )}
        </CardHeader>
        <CardContent>
          <CarouselContainer>
            {photos.length > 1 && (
              <LeftArrowButton onClick={handlePrevImage}>
                <ChevronLeft size={20} />
              </LeftArrowButton>
            )}
            <PostImage src={photos[currentIndex].cdnUrl} alt="post" />
            {photos.length > 1 && (
              <RightArrowButton onClick={handleNextImage}>
                <ChevronRight size={20} />
              </RightArrowButton>
            )}
            {photos.length > 1 && (
              <PhotoCounter>
                {currentIndex + 1} of {photos.length}
              </PhotoCounter>
            )}
            <Overlay>
              <OverlayContent>
                <HeartIcon
                  fill={isLiked ? "red" : "none"}
                  stroke={isLiked ? "red" : "currentColor"}
                  size={24}
                  onClick={toggleLike}
                  style={{ cursor: "pointer" }}
                />
                <div>{likes} likes</div>
              </OverlayContent>
            </Overlay>
          </CarouselContainer>
        </CardContent>
        <CardFooter>
          <IconsRow>
            <HeartIcon
              fill={isLiked ? "red" : "none"}
              stroke={isLiked ? "red" : "currentColor"}
              size={24}
              onClick={toggleLike}
              style={{ cursor: "pointer" }}
            />
            <MessageCircle
              size={24}
              onClick={() => setShowFullPostModal(true)}
              style={{ cursor: "pointer" }}
            />
          </IconsRow>
          <LikesText>{likes} likes</LikesText>
          <Caption>
            <strong>{data.username}</strong>:{" "}
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  style={{
                    fontSize: "0.875rem",
                    padding: "4px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    width: "80%",
                  }}
                />
                <button
                  onClick={handleEditPost}
                  style={{
                    marginLeft: "8px",
                    padding: "4px 8px",
                    fontSize: "0.875rem",
                    backgroundColor: "#10B981",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </>
            ) : (
              data.caption
            )}
          </Caption>
        </CardFooter>
      </Card>
      {showFullPostModal && (
        <FullPostModalOverlay onClick={() => setShowFullPostModal(false)}>
          <FullPostModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={() => setShowFullPostModal(false)}>
              <X size={24} />
            </ModalCloseButton>
            <FullPostModalScrollContainer>
              <Card>
                <CardContent>
                  <CarouselContainer>
                    {photos.length > 1 && (
                      <LeftArrowButton onClick={handlePrevImage}>
                        <ChevronLeft size={20} />
                      </LeftArrowButton>
                    )}
                    <PostImage src={photos[currentIndex].cdnUrl} alt="post" />
                    {photos.length > 1 && (
                      <RightArrowButton onClick={handleNextImage}>
                        <ChevronRight size={20} />
                      </RightArrowButton>
                    )}
                  </CarouselContainer>
                </CardContent>
                <CardFooter>
                  <LikesText>{likes} likes</LikesText>
                  <Caption>
                    <strong>{data.username}</strong>: {data.caption}
                  </Caption>
                  <CommentsContainer>
                    {comments.map((comment, index) => (
                      <CommentItem key={index}>
                        <CommentText>{comment}</CommentText>
                        {user && comment.startsWith(`${user.displayName}:`) && (
                          <DeleteCommentButton onClick={() => handleDeleteComment(index)}>
                            <X size={16} />
                          </DeleteCommentButton>
                        )}
                      </CommentItem>
                    ))}
                  </CommentsContainer>
                </CardFooter>
              </Card>
            </FullPostModalScrollContainer>
            <ModalCommentInputContainer>
              <ModalCommentInput
                type="text"
                placeholder="Add comment"
                value={modalNewComment}
                onChange={(e) => setModalNewComment(e.target.value)}
              />
              <ModalCommentButton onClick={handleModalAddComment}>
                Post
              </ModalCommentButton>W
            </ModalCommentInputContainer>
          </FullPostModalContent>
        </FullPostModalOverlay>
      )}
    </>
  );
};

export default PostCard;
