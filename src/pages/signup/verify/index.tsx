import React from "react";
import styled from "styled-components";
import { useUserAuth } from "../../../context/userAuthContext";

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

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #2563eb;
  }
`;

const VerifyEmailPage: React.FC = () => {
  const { user, sendVerificationEmail } = useUserAuth();

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

  return (
    <Wrapper>
      <Card>
        <Title>Verify Your Email</Title>
        <Text>
          Please check your email inbox and click the verification link to activate your account.
        </Text>
        <Button onClick={handleSendEmail}>Resend Verification Email</Button>
      </Card>
    </Wrapper>
  );
};

export default VerifyEmailPage;
