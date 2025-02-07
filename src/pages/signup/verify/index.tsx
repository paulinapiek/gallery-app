import React from "react";
import styled from "styled-components";
import { useUserAuth } from "../../../context/userAuthContext";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "@/components/StyledComponents/StyledButton";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f4f6;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const Text = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: #374151;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const VerifyEmailPage: React.FC = () => {
  const { user, sendVerificationEmail } = useUserAuth();
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    if (user) {
      try {
        await sendVerificationEmail(user);
        alert("Verification email sent! Check your inbox.");
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <Wrapper>
      <Card>
        <Title>Verify Your Email</Title>
        <Text>
          Please check your email inbox and click the verification link to
          activate your account.
        </Text>
        <ButtonsWrapper>
          <StyledButton onClick={handleSendEmail}>
            Resend Verification Email
          </StyledButton>
          <StyledButton variant="outline" onClick={goToLogin}>
            Go to login Page
          </StyledButton>
        </ButtonsWrapper>
      </Card>
    </Wrapper>
  );
};

export default VerifyEmailPage;
