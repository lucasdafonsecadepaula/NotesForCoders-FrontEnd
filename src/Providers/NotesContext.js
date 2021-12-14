import React, { useState } from "react";

export const NotesContext = React.createContext({});

export const NoteProvider = (props) => {
  const [notes, setNotes] = useState([]);

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      {props.children}
    </NotesContext.Provider>
  );
};
