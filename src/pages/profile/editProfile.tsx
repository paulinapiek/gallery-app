import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "@/components/layout";
import FileUploader from "@/components/fileUploader";
import avatar from "@/assets/images/avatar.png";
import { useUserAuth } from "@/context/userAuthContext.tsx";
import {
  createUserProfile,
  updateUserProfile,
} from "@/repository/user.service.ts";
import { updateUserInfoOnPosts } from "@/repository/post.service.ts";
import { FileEntry, ProfileInfo, UserProfile } from "@/types";
import { StyledButton } from "../../components/StyledComponents/StyledButton";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const InnerWrapper = styled.div`
  border: 1px solid #e5e7eb;
  max-width: 1000px;
  margin: auto;
  width: 100%;
`;

const Header = styled.h3`
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  font-size: 1.125rem;
  padding: 0.5rem;
`;

const FormWrapper = styled.div`
  padding: 2rem; 
`;

const StyledForm = styled.form`
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const StyledLabel = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const StyledInput = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  &:focus {
    outline: none;
    border-color: #1d4ed8;
  }
`;

const StyledTextarea = styled.textarea`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  resize: vertical;
  margin-bottom: 1rem;
  &:focus {
    outline: none;
    border-color: #1d4ed8;
  }
`;

const AvatarImage = styled.img`
  width: 7rem;
  height: 7rem;
  border-radius: 9999px;
  border: 2px solid #000000;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

interface IEditProfileProps {}

const EditProfile: React.FC<IEditProfileProps> = () => {
  const { user, updateProfileInfo } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { id, userId, displayName, photoURL, userBio } = location.state;

  const [data, setData] = useState<UserProfile>({
    userId,
    displayName,
    photoURL,
    userBio,
  });

  const [fileEntry, setFileEntry] = useState<FileEntry>({ files: [] });

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting data:", data);

    try {
      if (id) {
        const response = await updateUserProfile(id, data);
        console.log("Updated user profile:", response);
      } else {
        const response = await createUserProfile(data);
        console.log("Created user profile:", response);
      }

      const profileInfo: ProfileInfo = {
        user: user!,
        displayName: data.displayName,
        photoURL: data.photoURL,
      };
      updateProfileInfo(profileInfo);

      await updateUserInfoOnPosts(profileInfo);

      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (fileEntry.files.length > 0) {
      setData({ ...data, photoURL: fileEntry.files[0].cdnUrl || "" });
    }
  }, [fileEntry]);

  return (
    <Layout>
      <PageContainer>
        <InnerWrapper>
          <Header>Edit Profile</Header>
          <FormWrapper>
            <StyledForm onSubmit={updateProfile}>
              <FormGroup>
                <StyledLabel htmlFor="photo">Profile Picture</StyledLabel>
                <AvatarImage
                  src={
                    fileEntry.files.length > 0
                      ? fileEntry.files[0].cdnUrl!
                      : data.photoURL
                      ? data.photoURL
                      : avatar
                  }
                  alt="avatar"
                />
                <FileUploader
                  fileEntry={fileEntry}
                  onChange={setFileEntry}
                  preview={false}
                />
              </FormGroup>

              <FormGroup>
                <StyledLabel htmlFor="displayName">Display Name</StyledLabel>
                <StyledInput
                  id="displayName"
                  placeholder="Enter username"
                  value={data.displayName || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setData({ ...data, displayName: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <StyledLabel htmlFor="userBio">Profile Bio</StyledLabel>
                <StyledTextarea
                  id="userBio"
                  placeholder="What's on your mind?"
                  value={data.userBio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setData({ ...data, userBio: e.target.value })
                  }
                />
              </FormGroup>

              <ButtonGroup>
                <StyledButton type="submit" variant="solid">
                  Update
                </StyledButton>

                <StyledButton
                  variant="outline"
                  type="button" 
                  onClick={() => navigate("/profile")}
                >
                  Cancel
                </StyledButton>
              </ButtonGroup>
            </StyledForm>
          </FormWrapper>
        </InnerWrapper>
      </PageContainer>
    </Layout>
  );
};

export default EditProfile;
