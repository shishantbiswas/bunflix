"use client";
import React, { createContext, useContext, useState } from "react";

export interface History extends AniwatchInfo {
  lang: "en" | "jp"
  epNum: number | string,
  ep: string
}

const ShowContext = createContext<{
  show: History | null
  setShow: (anime: History) => void;
}>({
  show: null,
  setShow: () => { },
});

export const ShowProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState<History | null>(null);

  return (
    <ShowContext.Provider
      value={{
        show,
        setShow,
      }}
    >
      {children}
    </ShowContext.Provider>
  );
};

export const useShow = () => useContext(ShowContext);
