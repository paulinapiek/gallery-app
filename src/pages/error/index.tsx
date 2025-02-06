import React from "react";
import styled from "styled-components";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8d7da;
  color: #721c24;
  padding: 2rem;
`;

const ErrorTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.25rem;
  text-align: center;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const ErrorButton = styled.button`
  background-color: #721c24;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #a94442;
  }
`;

const Error: React.FC = () => {
  return (
    <ErrorContainer>
      <ErrorTitle>Oops!</ErrorTitle>
      <ErrorMessage>
        Something went wrong. Please try again later.
      </ErrorMessage>
      <ErrorButton onClick={() => window.location.reload()}>
        Reload Page
      </ErrorButton>
    </ErrorContainer>
  );
};

export default Error;
