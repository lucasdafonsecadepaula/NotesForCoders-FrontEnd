import Head from "next/head";
import { ModalProvider } from "../src/Providers/ModalContext";
import { NoteProvider } from "../src/Providers/NotesContext";
import { UserProvider } from "../src/Providers/UserContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Notes For Coders</title>
        <link rel="icon" href="/icon.ico" />
      </Head>
      <UserProvider>
        <NoteProvider>
          <ModalProvider>
            <Component {...pageProps} />
          </ModalProvider>
        </NoteProvider>
      </UserProvider>
    </>
  );
}

export default MyApp;
