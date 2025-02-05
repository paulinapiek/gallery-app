import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { StyledGoogleIcon } from "../../components/StyledComponents/StyledIcons";
import { useUserAuth } from "../../context/userAuthContext";
import { StyledLabel } from "../../components/StyledComponents/StyledLabel";
import { UserSignIn } from "../../types/index";
import { StyledButton } from "../../components/StyledComponents/StyledButton";
import { 
  CardWrapper, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "../../components/StyledComponents/StyledCard";
import { StyledInput } from "../../components/StyledComponents/StyledInput";
import { StyledBlock } from "../../components/StyledComponents/StyledBlock";
import styled from "styled-components";

const PageWrapper = styled.div`
  background-color: #1e293b;
  width: 100%;
  height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  height: 100%;
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const SeparatorWrapper = styled.div`
  position: relative;
  text-align: center;
  margin: 0.5rem 0;
`;

const SeparatorLine = styled.span`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  border-top: 1px solid #e5e7eb;
  transform: translateY(-50%);
`;

const SeparatorText = styled.span`
  position: relative;
  background-color: #ffffff;
  color: #6b7280;
  font-size: 0.75rem;
  text-transform: uppercase;
  padding: 0 0.5rem;
`;

const StyledLink = styled(Link)`
  color: #2563eb;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const initialValue: UserSignIn = {
  email: "",
  password: "",
  confirmPassword: "",
};

const Signup: React.FC = () => {
  const { googleSignIn, signUp } = useUserAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserSignIn>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await googleSignIn();
      console.log("Google login successful.");
      navigate("/signup/verify");
    } catch (error: any) {
      console.error("Error with Google Sign-In:", error.code, error.message);
      setError(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (userInfo.password !== userInfo.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      console.log("Attempting to create user:", userInfo);
      const createdUser = await signUp(userInfo.email, userInfo.password);

      if (!createdUser.user) {
        throw new Error("User creation failed.");
      }

      console.log("Verification email sent.");
      alert("Verification email sent. Please check your inbox.");
      navigate("/signup/verify");
    } catch (error: any) {
      console.error("Error during sign-up:", error.code, error.message);
      if (error.code === "auth/email-already-in-use") {
        setError("The email address is already in use.");
      } else if (error.code === "auth/invalid-email") {
        setError("The email address is not valid.");
      } else if (error.code === "auth/weak-password") {
        setError("The password is too weak.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <PageWrapper>
      <ContentContainer>
        <FlexWrapper>
          <CardWrapper>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>P1nterest</CardTitle>
                <CardDescription>
                  Enter your email below to create your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <StyledButton variant="outline" onClick={handleGoogleSignIn}>
                    <StyledGoogleIcon style={{ marginRight: "0.5rem" }} />
                    Google
                  </StyledButton>
                </div>

                <SeparatorWrapper>
                  <SeparatorLine />
                  <SeparatorText>Or</SeparatorText>
                </SeparatorWrapper>

                {error && (
                  <p
                    style={{
                      color: "red",
                      textAlign: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {error}
                  </p>
                )}

                <StyledBlock>
                  <StyledLabel htmlFor="email">Email address</StyledLabel>
                  <StyledInput
                    id="email"
                    type="email"
                    placeholder="your.email@domain.com"
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                  />
                </StyledBlock>

                <StyledBlock>
                  <StyledLabel htmlFor="password">Password</StyledLabel>
                  <StyledInput
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={userInfo.password}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, password: e.target.value })
                    }
                  />
                </StyledBlock>

                <StyledBlock>
                  <StyledLabel htmlFor="confirmpassword">
                    Confirm password
                  </StyledLabel>
                  <StyledInput
                    id="confirmpassword"
                    type="password"
                    placeholder="Confirm password"
                    value={userInfo.confirmPassword}
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </StyledBlock>
              </CardContent>

              <CardFooter>
                <StyledButton type="submit">Sign Up</StyledButton>
                <p
                  style={{
                    marginTop: "0.75rem",
                    fontSize: "0.875rem",
                    textAlign: "center",
                  }}
                >
                  Already have an account?{" "}
                  <StyledLink to="/login">Login</StyledLink>
                </p>
              </CardFooter>
            </form>
          </CardWrapper>
        </FlexWrapper>
      </ContentContainer>
    </PageWrapper>
  );
};

export default Signup;
