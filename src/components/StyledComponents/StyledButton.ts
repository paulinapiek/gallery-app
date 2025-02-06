// src/StyledComponents/StyledButton.ts
import styled from "styled-components";

interface IStyledButtonProps {
  variant?: "outline" | "solid";
}

export const StyledButton = styled.button<IStyledButtonProps>`
  cursor: pointer;
  border-radius: 0.375rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  transition: background-color 0.2s ease;
  width: 100%;
  border: 1px solid #1d3ed8;
  display: flex;
  justify-content: center;
  align-items: center;


  ${({ variant }) =>
    variant === "outline"
      ? `
        border: 1px solid black; 
        background-color: #fff;
        color: #374151;
        max-width: 400px;
        &:hover {
          background-color: black;
          color: white;
        }
      `
      : `
        background-color: #1d4ed8;
        color: #fff;
        max-width: 400px;
        &:hover {
          background-color: white;
          border: 1px solid #1d3ed8;
          color: #1d3ed8;
        }
      `}
`;
