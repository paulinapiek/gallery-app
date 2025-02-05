import styled from "styled-components";

export const StyledInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  align-items: left;

  &:focus {
    outline: none;
    border-color: #1d4ed8;
  }
`;
