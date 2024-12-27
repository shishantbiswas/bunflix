"use client";
import React, { createContext, useContext, useState } from "react";

const SearchBarFocusContext = createContext<{
  isSearchBarFocused: boolean;
  setIsSearchBarFocused: (value: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (value: boolean) => void;
}>({
  isSearchBarFocused: false,
  setIsSearchBarFocused: () => {},
  isSearchOpen: false,
  setIsSearchOpen: () => {},
});

export const SearchBarFocusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <SearchBarFocusContext.Provider
      value={{
        isSearchBarFocused,
        setIsSearchBarFocused,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </SearchBarFocusContext.Provider>
  );
};

export const useSearchBarFocus = () => useContext(SearchBarFocusContext);
