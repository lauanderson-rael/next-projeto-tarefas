import Head from "next/head";
import Image from "next/image";
import styles from "../styles/home.module.css"
import heroImg from "../assets/file.svg"
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConnection";

interface HomeProps {
  posts: number,
  comments: number
}

export default function Home({ posts, comments }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas + | Organize suas tarefas</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="Logo Tarefas+"
            src={heroImg}
            priority
          />
        </div>

        <h1 className={styles.title}>
          Sistema feito para você organizar <br />
          seus estudos e projetos
        </h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{posts} posts</span>
          </section>

          <section className={styles.box}>
            <span>+{comments} comentários</span>
          </section>

        </div>

      </main>
    </div>
  );
}


// lado do servidor - gerando pagina estatica a cada 60 segundos
export const getStaticProps: GetStaticProps = async () => {
  // buscar o banco os numeros e mandar pro componente
  const commentRef = collection(db, "comments")
  const postRef = collection(db, "tarefas")
  console.log("buscando pelo server side --------------")

  const commentSnacpshot = await getDocs(commentRef)
  const postSnapshot = await getDocs(postRef)

  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commentSnacpshot.size || 0
    },
    revalidate: 60 // sera revalidado a cada 60 segundos
  }
}
