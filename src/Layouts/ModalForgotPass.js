import React, { useContext, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";
import { ModalContext } from "../Providers/ModalContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Image from "next/image";
import axios from "axios";
import Alert from "@mui/material/Alert";

export default function ModalForgotPass() {
  const { setModalStatus, setBlockScroll } = useContext(ModalContext);

  const emailRef = useRef();

  const [error, setError] = useState();
  const [ok, setOk] = useState();
  const [disableButton, setDisableButton] = useState(false);

  const closeModal = () => {
    setModalStatus(false);
    setBlockScroll({});
  };
  const changeModal = (req) => {
    setModalStatus(req);
  };

  const redefinePass = async () => {
    setError();
    setDisableButton(true);
    await axios
      .post(`${process.env.URL_API_AUTH}/forgot-password`, {
        email: emailRef.current.value.toLowerCase(),
      })
      .then(function (response) {
        if (response.data.error === "usuario não cadastrado") {
          setDisableButton(false);
          setError("Usuário Não Encontrado");
          return;
        }

        setOk("Verifique Seu Email");
        setTimeout(() => {
          setModalStatus(false);
          setBlockScroll({});
        }, 6000);
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
              <h2>Redefinir Senha</h2>
              <Image
                src="/favicon-32x32.png"
                height="32"
                width="32"
                alt="Logo"
              />
            </div>
            {error && <Alert severity="error">{error}</Alert>}
            {ok && <Alert severity="success">{ok}</Alert>}
            <TextField
              className={styles.modalContent}
              label="Email"
              variant="outlined"
              inputRef={emailRef}
            />

            <div className={styles.modalFooter}>
              <a
                onClick={() => changeModal("create-acount")}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "13px",
                }}
              >
                Não tem uma Conta?
              </a>
            </div>
            <Button
              disabled={disableButton}
              onClick={() => redefinePass()}
              className={styles.modalContent}
              variant="contained"
            >
              Enviar
            </Button>
          </div>

          <h2 style={{ color: "rgb(255, 255, 255)" }}>a</h2>
        </div>
      </div>
    </>
  );
}
