import React, { useState } from "react";

export const ModalContext = React.createContext({});

export const ModalProvider = (props) => {
  const [modalStatus, setModalStatus] = useState("");
  const [blockScroll, setBlockScroll] = useState({});

  return (
    <ModalContext.Provider
      value={{ modalStatus, setModalStatus, blockScroll, setBlockScroll }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};
