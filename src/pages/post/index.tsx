import FileUploader from "@/components/fileUploader";
import Layout from "@/components/layout";
import { useUserAuth } from "@/context/userAuthContext";
import { createPost } from "@/repository/post.service";
import { FileEntry, PhotoMeta, Post } from "@/types";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "@/components/StyledComponents/StyledButton";
import styled from "styled-components";

interface ICreatePostProps {}

const Container = styled.div`
  padding: 1rem;
  max-width: 1000px;
  margin: auto;
`;

const OuterWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const InnerWrapper = styled.div`
  border: 1px solid #e5e7eb;
  max-width: 1000px; 
  width: 100%;
`;

const Header = styled.h3`
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  font-size: 1.125rem; 
  padding: 0.5rem;
`;

const Content = styled.div`
  padding: 2rem;
`;

const StyledForm = styled.form``;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const StyledTextarea = styled.textarea`
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  resize: vertical;
`;



const CreatePost: React.FunctionComponent<ICreatePostProps> = () => {
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const [fileEntry, setFileEntry] = React.useState<FileEntry>({ files: [] });
  const [post, setPost] = React.useState<Post>({
    caption: "",
    photos: [],
    likes: 0,
    userlikes: [],
    userId: "",
    date: new Date(),
  });

  const displayName = user?.displayName!;

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Uploaded File Entry : ", fileEntry.files);
    console.log("The create post is : ", post);

    const photoMeta: PhotoMeta[] = fileEntry.files.map((file) => {
      return { cdnUrl: file.cdnUrl!, uuid: file.uuid! };
    });

    if (user != null) {
      const newPost: Post = {
        ...post,
        userId: user?.uid,
        photos: photoMeta,
        username: user.displayName!,
        photoURL: user?.photoURL!,
      };
      console.log("The final post is  : ", newPost);

      await createPost(newPost, displayName);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <Layout>
      <Container>
        <OuterWrapper>
          <InnerWrapper>
            <Header>Create Post</Header>
            <Content>
              <StyledForm onSubmit={handleSubmit}>
                <FormGroup>
                  <FormLabel htmlFor="caption">Photo Caption</FormLabel>
                  <StyledTextarea
                    id="caption"
                    placeholder="what's in your photo!"
                    value={post.caption}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setPost({ ...post, caption: e.target.value })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="photo">Photos</FormLabel>
                  <FileUploader
                    fileEntry={fileEntry}
                    onChange={setFileEntry}
                    preview={true}
                  />
                </FormGroup>

                <StyledButton type="submit">Post</StyledButton>
              </StyledForm>
            </Content>
          </InnerWrapper>
        </OuterWrapper>
      </Container>
    </Layout>
  );
};

export default CreatePost;
