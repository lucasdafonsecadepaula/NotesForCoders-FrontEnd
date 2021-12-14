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

export default function Home({ notes }) {
  const { setNotes } = useContext(NotesContext);

  const { modalStatus, setModalStatus, blockScroll, setBlockScroll } =
    useContext(ModalContext);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setNotes(notes);
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

export async function getServerSideProps(context) {
  const notes = await axios
    .get(`${process.env.URL_GET_NOTES}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return [];
    });

  return {
    props: { notes },
  };
}

const verifyToken = async (response) => {
  axios
    .get(`${process.env.URL_VERIFY_TOKEN}`, {
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
