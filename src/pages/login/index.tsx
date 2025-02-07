// src/components/Login/Login.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { StyledGoogleIcon } from "../../components/StyledComponents/StyledIcons";
import { StyledLabel } from "../../components/StyledComponents/StyledLabel";
import { UserLogIn } from "../../types/index";
import { StyledButton } from "../../components/StyledComponents/StyledButton";
import { CardWrapper, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/StyledComponents/StyledCard";
import { StyledInput } from "../../components/StyledComponents/StyledInput";
import { StyledBlock } from "../../components/StyledComponents/StyledBlock";
import styled from "styled-components";

import { useUserAuth } from "../../context/userAuthContext";

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

const initialValue: UserLogIn = {
  email: "",
  password: "",
};

const Login: React.FunctionComponent = () => {
  const { googleSignIn, logIn } = useUserAuth();
  const navigate = useNavigate();
  const [userLoginInfo, setuserLoginInfo] = React.useState<UserLogIn>(initialValue);

  // Obsługa logowania przez Google
  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.error("Error with Google Sign-In:", error);
      alert("An error occurred while signing in with Google.");
    }
  };

  // Obsługa logowania użytkownika
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const loggedUser = await logIn(userLoginInfo.email, userLoginInfo.password);
      console.log("User logged in:", loggedUser);
      navigate("/dashboard"); // lub inna ścieżka po zalogowaniu
    } catch (error: any) {
      console.error("Error during login:", error);
      if (error.code === "auth/user-not-found") {
        alert("User not found.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password.");
      } else {
        alert("An unexpected error occurred. Please try again.");
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
                  Enter your email and password to log in
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

                <StyledBlock>
                  <StyledLabel htmlFor="email">Email address</StyledLabel>
                  <StyledInput
                    id="email"
                    type="email"
                    placeholder="your.email@domain.com"
                    value={userLoginInfo.email}
                    onChange={(e) =>
                      setuserLoginInfo({ ...userLoginInfo, email: e.target.value })
                    }
                  />
                </StyledBlock>

                <StyledBlock>
                  <StyledLabel htmlFor="password">Password</StyledLabel>
                  <StyledInput
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={userLoginInfo.password}
                    onChange={(e) =>
                      setuserLoginInfo({ ...userLoginInfo, password: e.target.value })
                    }
                  />
                </StyledBlock>
              </CardContent>

              <CardFooter>
                <StyledButton type="submit">Login</StyledButton>
                <p style={{ marginTop: "0.75rem", fontSize: "0.875rem", textAlign: "center" }}>
                  Don't have an account?{" "}
                  <StyledLink to="/signup">Sign Up</StyledLink>
                </p>
              </CardFooter>
            </form>
          </CardWrapper>
        </FlexWrapper>
      </ContentContainer>
    </PageWrapper>
  );
};

export default Login;
