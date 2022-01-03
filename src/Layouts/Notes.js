import React, { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import styles from "../../styles/Home.module.css";
import { NotesContext } from "../Providers/NotesContext";

export default function Notes() {
  const { notes } = useContext(NotesContext);

  return (
    <>
      {notes.length ? (
        notes.map((e) => (
          <a key={e._id} className={styles.notes}>
            <Avatar
              src={e.avatar}
              style={{
                backgroundColor: "#82ACEF",
                height: "100px",
                width: "100px",
              }}
            ></Avatar>

            <div className={styles.notesDiv}>
              <h3 style={{ height: "0px", lineHeight: "0px" }}>{e.title}</h3>
              <p
                style={{
                  fontStyle: "italic",
                  borderTop: "1px solid #ffff",
                  height: "100%",
                  width: "100%",
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
                {e.description}
              </p>
            </div>
          </a>
        ))
      ) : (
        <div className={styles.ldsring}><div></div><div></div><div></div><div></div></div>
      )}
    </>
  );
}
