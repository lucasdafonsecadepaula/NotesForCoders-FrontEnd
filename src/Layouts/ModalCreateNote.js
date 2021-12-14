import React, { useContext, useState } from "react";
import styles from "../../styles/Home.module.css";
import { ModalContext } from "../Providers/ModalContext";
import { UserContext } from "../Providers/UserContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import { NotesContext } from "../Providers/NotesContext";

export default function ModalCreateNote() {
  const [avatar, setAvatar] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const { setModalStatus, setBlockScroll } = useContext(ModalContext);
  const { notes, setNotes } = useContext(NotesContext);
  const { user } = useContext(UserContext);

  const closeModal = () => {
    setModalStatus(false);
    setBlockScroll({});
  };
  const changeModal = (req) => {
    setModalStatus(req);
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64Img = await convertBase64(file);
    setAvatar(base64Img);
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (err) => {
        reject(err);
      };
    });
  };

  const defineTitle = (req) => {
    if (req.length > 60) return;
    setTitle(req);
  };
  const defineDescription = (req) => {
    if (req.length > 240) return;
    setDescription(req);
  };

  const createNote = async () => {
    if (title == "") return;
    if (description == "") return;
    setDisableButton(true);
    axios
      .post(
        `http://localhost:8000/auth/create-note`,
        {
          avatar: avatar,
          title: title,
          description: description,
        },
        {
          headers: {
            contentType: "application/json",
            Authorization: "Client-ID [my-client-id]",
            Authorization: `Bearer ${user.token}`,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setNotes([res.data.note, ...notes]);
        setModalStatus(false);
        setBlockScroll({});
      })
      .catch((error) => {
        setDisableButton(false);
      });
  };

  return (
    <>
      <div onClick={() => closeModal()} className={styles.modalOutSide}></div>
      <div className={styles.modalInSide}>
        <div className={styles.modalCard}>
          <div
            style={{
              cursor: "pointer",
              justifyContent: "flex-end",
              display: "flex",
              width: "100%",
              marginTop: 5,
              marginRight: 10,
            }}
          >
            <a onClick={() => closeModal()}>
              <span>{"✖️"}</span>
            </a>
          </div>

          {user !== undefined ? (
            <>
              <div className={styles.modalContainer}>
                <div className={styles.modalTitle}>
                  <h2>Create Note</h2>
                  <Image
                    src="/favicon-32x32.png"
                    height="32"
                    width="32"
                    alt="Logo"
                  />
                </div>

                <div
                  className={styles.modalContent}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    onChange={(e) => uploadImage(e)}
                    accept="image/*"
                    style={{ display: "none" }}
                    id="button-file"
                    multiple
                    type="file"
                  />
                  <label htmlFor="button-file">
                    <Button variant="outlined" component="span">
                      Mudar Avatar
                    </Button>
                  </label>
                  <Avatar
                    src={avatar}
                    style={{ margin: "auto", height: "100px", width: "100px" }}
                  />
                </div>

                <TextField
                  value={title}
                  onChange={(e) => defineTitle(e.target.value)}
                  className={styles.modalContent}
                  required
                  label="Título"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {title.length + "/60"}
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  value={description}
                  onChange={(e) => defineDescription(e.target.value)}
                  className={styles.modalContent}
                  label="Descrição"
                  variant="outlined"
                  multiline
                  required
                  rows={6}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {description.length + "/240"}
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  disabled={disableButton}
                  className={styles.modalContent}
                  variant="contained"
                  onClick={() => createNote()}
                >
                  Enviar
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.modalContainer}>
                <div className={styles.modalTitle}>
                  <h2>Ops!</h2>
                  <Image
                    src="/favicon-32x32.png"
                    height="32"
                    width="32"
                    alt="Logo"
                  />
                </div>
                <h3 style={{ textAlign: "center", marginBottom: 50 }}>
                  Essa pagina é dedicada a usuários cadastrados
                </h3>

                <div className={styles.modalFooter}>
                  <Button
                    onClick={() => changeModal("access-acount")}
                    variant="contained"
                  >
                    Acessar Conta
                  </Button>
                  <Button
                    onClick={() => changeModal("create-acount")}
                    variant="outlined"
                  >
                    Criar Conta
                  </Button>
                </div>
              </div>
            </>
          )}

          <h2 style={{ color: "rgb(255, 255, 255)" }}>a</h2>
        </div>
      </div>
    </>
  );
}
