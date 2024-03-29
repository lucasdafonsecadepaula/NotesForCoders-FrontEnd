import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Avatar from "@mui/material/Avatar";
import { ModalContext } from "../src/Providers/ModalContext";
import ModalCreateUser from "../src/Layouts/ModalCreateUser";
import ModalAccessAcount from "../src/Layouts/ModalAccessAcount";
import ModalForgotPass from "../src/Layouts/ModalForgotPass";
import ModalCreateNote from "../src/Layouts/ModalCreateNote";
import Notes from "../src/Layouts/Notes";
import axios from "axios";
import { NotesContext } from "../src/Providers/NotesContext";
import { UserContext } from "../src/Providers/UserContext";
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';

export default function Home() {
  const [openSnackbar, setOpenSnackbar] = useState(true);

  const { notes, setNotes } = useContext(NotesContext);

  const { modalStatus, setModalStatus, blockScroll, setBlockScroll } =
    useContext(ModalContext);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      const parse = JSON.parse(localStorage.getItem("user"));
      verifyToken(parse.token);
      setUser(parse);
    }
  }, []);

  const openModal = (req) => {
    setModalStatus(req);
    setBlockScroll({ height: "100vh", overflow: "hidden" });
  };
  const logOut = () => {
    localStorage.removeItem("user");
    setUser();
  };

  return (
    <div style={blockScroll} className={styles.container}>
      {modalStatus == "access-acount" ? <ModalAccessAcount /> : null}
      {modalStatus == "create-acount" ? <ModalCreateUser /> : null}
      {modalStatus == "forgot-pass" ? <ModalForgotPass /> : null}
      {modalStatus == "create-note" ? <ModalCreateNote /> : null}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={9000}
        TransitionComponent={(props) => <Slide {...props} direction="up" />}
        onClose={() => setOpenSnackbar(false)}
        message={"Caros, Devs, favor testar as funções do backend como a criação de uma conta, redefinição de senha e a criação de um novo note!!"}
        action={""}
      />

      <nav className={styles.nav}>
        <Avatar src="/avatar.png" />
        {user !== undefined ? (
          <>
            <h5>Olá, {user.data.name}</h5>
            <a onClick={() => logOut()}>
              <h5>Sair</h5>
            </a>
          </>
        ) : (
          <>
            <a onClick={() => openModal("access-acount")}>
              <h5>Entrar</h5>
            </a>

            <a onClick={() => openModal("create-acount")}>
              <h5>Criar Conta</h5>
            </a>
          </>
        )}
      </nav>

      <main className={styles.main}>
        <h1 className={styles.title}>Notes For Coders</h1>

        <p className={styles.description}>
          Deixe aqui sua Note para outros Coders,
          <br />
          Qualquer dica, ou apenas uma messagem de apoio serve.
        </p>

        <div className={styles.grid}>
          <a onClick={() => openModal("create-note")} className={styles.card}>
            <Avatar
              style={{
                backgroundColor: "rgb(127,255,212)",
                height: "100px",
                width: "100px",
              }}
            >
              +
            </Avatar>
            <p>Crie seu note aqui</p>
            <div></div>
          </a>

          <Notes />
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://github.com/lucasdafonsecadepaula">
          Powered by <span>Lucas</span> <Avatar src="/eu.png" />
        </a>
      </footer>
    </div>
  );
}

const verifyToken = async (response) => {
  axios
    .get(`${process.env.NEXT_PUBLIC_URL_API_AUTH_VERIFY_TOKEN}`, {
      headers: {
        Authorization: `Bearer ${response}`,
      },
    })
    .then((res) => {
      if (res.error !== undefined) {
        localStorage.removeItem("user");
      }
    })
    .catch((error) => {});
};
