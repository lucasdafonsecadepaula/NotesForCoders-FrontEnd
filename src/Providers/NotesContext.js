import React, { useState, useEffect } from "react";
import axios from "axios";


export const NotesContext = React.createContext({});

export const NoteProvider = (props) => {
  const [notes, setNotes] = useState([]);

  useEffect(async() => {
    await axios
    .get(`${process.env.NEXT_PUBLIC_URL_API_GET_NOTES}`)
    .then(function (response) {
      setNotes(response.data)
    })
    .catch(function (error) {
      setNotes([]);
    });
  }, []);

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      {props.children}
    </NotesContext.Provider>
  );
};
