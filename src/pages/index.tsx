import Head from "next/head";
import Image from "next/image";
import styles from "../styles/home.module.css"
import heroImg from "../assets/hero.png"

export default function Home() {
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

        <div  className={styles.infoContent}>
          <section className={styles.box}>
            <span>+12 posts</span>
          </section>

          <section className={styles.box}>
            <span>+90 comentários</span>
          </section>

        </div>

      </main>
    </div>
  );
}
