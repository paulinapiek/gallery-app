import React from "react";
import styled from "styled-components";
import { Search } from "lucide-react";

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const StyledInput = styled.input`
  border: 2px solid #d1d5db;
  background-color: #fff;
  height: 2.5rem;
  padding: 0 3rem 0 1rem;
  border-radius: 0.125rem;
  font-size: 1rem;
  width: 100%;
  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 3rem;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #d1d5db;
  border-top: none;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
`;

interface SearchBarProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onSearch?: () => void;
  suggestions?: React.ReactNode[];
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, suggestions, placeholder }) => {
  return (
    <SearchContainer>
      <StyledInput
        placeholder={placeholder || "Search..."}
        type="search"
        value={value}
        onChange={onChange}
      />
      <SearchButton type="button" onClick={onSearch}>
        <Search style={{ width: "20px", height: "20px", color: "#9ca3af" }} />
      </SearchButton>
      {value && suggestions && suggestions.length > 0 && (
        <SuggestionsContainer>{suggestions}</SuggestionsContainer>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
