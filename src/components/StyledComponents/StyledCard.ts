// src/StyledComponents/StyledCard.ts
import styled from "styled-components";

export const CardWrapper = styled.div`
  max-width: 24rem;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background-color: #ffffff;
  color: #000000;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

// Nagłówek karty
export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem; 
  padding: 1rem;
`;

// Tytuł karty
export const CardTitle = styled.h2`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
`;

// Opis karty
export const CardDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280; 
`;

// Główna treść karty
export const CardContent = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem;
`;

// Stopka karty
export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;
