import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "../../styles/Home.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Image from "next/image";
import Alert from "@mui/material/Alert";

export default function token_verify() {
  const router = useRouter("");

  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [error, setError] = useState();
  const [ok, setOk] = useState();
  const [disableButton, setDisableButton] = useState(false);

  const token = router.query.token;

  const changePassword = () => {
    setDisableButton(true);
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError("Senhas Diferentes");
      setDisableButton(false);
      return;
    }

    axios
      .post(`http://localhost:8000/auth/forgot-password-verify-token`, {
        token,
        password: passwordRef.current.value,
      })
      .then(function (response) {
        if (response.data.error) {
          setDisableButton(false);
          setError(
            "Token Invalido, por favor solicite novamente o link para reset de senha"
          );
          return;
        }
        setOk(
          "Senha Redefinida Com Sucesso, você será redirecionado para a página inicial"
        );
        setTimeout(() => {
          router.push("/");
        }, 6000);
      })
      .catch(function (error) {});
  };

  return (
    <div className={styles.forgotPass_Container}>
      <div className={styles.forgotPass_form}>
        <div className={styles.forgotPass_title}>
          <h2>Redefir Senha</h2>
          <Image src="/favicon-32x32.png" height="32" width="32" alt="Logo" />
        </div>
        <div>
          {error && <Alert severity="error">{error}</Alert>}
          {ok && <Alert severity="success">{ok}</Alert>}
          <TextField
            inputRef={passwordRef}
            className={styles.forgotPass_text}
            label="Senha"
            variant="outlined"
            type={"password"}
          />
          <TextField
            inputRef={passwordConfirmRef}
            className={styles.forgotPass_text}
            label="Confirmar Senha"
            variant="outlined"
            type={"password"}
          />
          <Button
            onClick={() => changePassword()}
            className={styles.forgotPass_content}
            variant="contained"
            disabled={disableButton}
          >
            Entrar
          </Button>
        </div>
        <h2></h2>
      </div>
    </div>
  );
}
