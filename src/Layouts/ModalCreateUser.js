import React, { useContext, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";
import { ModalContext } from "../Providers/ModalContext";
import { UserContext } from "../Providers/UserContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Image from "next/image";
import axios from "axios";
import Alert from "@mui/material/Alert";

export default function ModalCreateUser() {
  const { setModalStatus, setBlockScroll } = useContext(ModalContext);
  const { setUser } = useContext(UserContext);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [error, setError] = useState();
  const [disableButton, setDisableButton] = useState(false);

  const closeModal = () => {
    setModalStatus(false);
    setBlockScroll({});
  };

  const changeModal = (req) => {
    setModalStatus(req);
  };

  const singUp = async () => {
    setError();
    setDisableButton(true);
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setDisableButton(false);
      setError("Senhas Não Semelhantes");
      return;
    }

    await axios
      .post(`${process.env.NEXT_PUBLIC_URL_API_AUTH_CREATE_ACOUNT}`, {
        name: nameRef.current.value,
        email: emailRef.current.value.toLowerCase(),
        password: passwordRef.current.value,
      })
      .then(function (response) {
        if (response.data.error === "Usuario já cadastrado") {
          setDisableButton(false);
          setError("Usuario já cadastrado");
          return;
        }
        const data = { data: response.data.user, token: response.data.token };
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setModalStatus(false);
        setBlockScroll({});
      })
      .catch(function (error) {
        console.error(error);
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

          <div className={styles.modalContainer}>
            <div className={styles.modalTitle}>
              <h2>Criar Conta</h2>
              <Image
                src="/favicon-32x32.png"
                height="32"
                width="32"
                alt="Logo"
              />
            </div>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              inputRef={nameRef}
              className={styles.modalContent}
              label="Nome"
              variant="outlined"
            />

            <TextField
              inputRef={emailRef}
              className={styles.modalContent}
              label="Email"
              variant="outlined"
            />

            <TextField
              inputRef={passwordRef}
              className={styles.modalContent}
              label="Senha"
              variant="outlined"
              type={"password"}
            />
            <TextField
              inputRef={passwordConfirmRef}
              className={styles.modalContent}
              label="Confirmar Senha"
              variant="outlined"
              type={"password"}
            />
            <div className={styles.modalFooter}>
              <a
                onClick={() => changeModal("access-acount")}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "13px",
                }}
              >
                Já tem uma Conta?
              </a>
            </div>
            <Button
              disabled={disableButton}
              onClick={() => singUp()}
              className={styles.modalContent}
              variant="contained"
            >
              Entrar
            </Button>
          </div>

          <h2 style={{ color: "rgb(255, 255, 255)" }}>a</h2>
        </div>
      </div>
    </>
  );
}
