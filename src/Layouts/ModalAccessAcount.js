import React, { useContext, useRef, useState } from "react";
import styles from "../../styles/Home.module.css";
import { ModalContext } from "../Providers/ModalContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Image from "next/image";
import axios from "axios";
import { UserContext } from "../Providers/UserContext";
import Alert from "@mui/material/Alert";

export default function ModalAccessAcount() {
  const { setModalStatus, setBlockScroll } = useContext(ModalContext);
  const { setUser } = useContext(UserContext);

  const [error, setError] = useState();
  const [disableButton, setDisableButton] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  const closeModal = () => {
    setModalStatus(false);
    setBlockScroll({});
  };
  const changeModal = (req) => {
    setModalStatus(req);
  };

  const singIn = async () => {
    setDisableButton(true);
    await axios
      .post(process.env.URL_API_AUTH_ACCESS_ACOUNT, {
        email: emailRef.current.value.toLowerCase(),
        password: passwordRef.current.value,
      })
      .then(function (response) {
        if (response.data.error === "User not found") {
          setError("Usuário Não Encontrado");
          setDisableButton(false);
          return;
        }

        if (response.data.error === "Invalid Password") {
          setError("Senha Incorreta");
          setDisableButton(false);
          return;
        }

        const data = { data: response.data.user, token: response.data.token };

        localStorage.setItem("user", JSON.stringify(data));

        setUser(data);
        setModalStatus(false);
        setBlockScroll({});
      })
      .catch(function (error) {});
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
              <h2>Entrar</h2>
              <Image
                src="/favicon-32x32.png"
                height="32"
                width="32"
                alt="Logo"
              />
            </div>
            {error && <Alert severity="error">{error}</Alert>}
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
            <div className={styles.modalFooter}>
              <a
                onClick={() => changeModal("create-acount")}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "13px",
                }}
              >
                Não tem um Conta?
              </a>
              <a
                onClick={() => changeModal("forgot-pass")}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "13px",
                }}
              >
                Esqueceu a senha?
              </a>
            </div>
            <Button
              disabled={disableButton}
              onClick={() => singIn()}
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
