
import { useSession, signIn, signOut } from "next-auth/react";
import styles from './styles.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Loading from "../Loading";
import { useState } from "react";

export function Header() {
    const { data: session, status } = useSession();
    const partesNome = session?.user?.name?.split(' ');
    const primeiroEsegundoNome = `${partesNome?.[0]}` + ' ' + `${partesNome?.[1] || ''}`;

    const perfil = session?.user?.image || "https://cdn-icons-png.flaticon.com/512/3237/3237472.png"; // URL padrão

    const router = useRouter();
    const { pathname } = router;

    // Verificar se a rota contém a página dinâmica /task/:id
    const isTaskPage = pathname.startsWith("/task/");
    const textButton = isTaskPage ? "Voltar ao Painel" : "Painel de tarefas";

    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
        setLoading(true); // Ativa o loading
        await router.push(`/dashboard`);
        setLoading(false); // Desativa o loading após a navegação
    };

    return (
        <header className={styles.header}>
            {loading && <Loading />} {/*  carregando... */}
            <section className={styles.content}>
                <nav className={styles.nav}>
                    <Link href={'/'}>
                        <h1 className={styles.logo}>Tarefas<span>+</span></h1>
                    </Link>

                    {session?.user && (
                        <a className={styles.link} onClick={() => handleClick()}>
                            {textButton}
                        </a>
                    )}
                </nav>

                {status === "loading" ? (
                    <></>
                ) : session ? (
                    <button className={styles.loginButton} onClick={() => signOut()}>
                        Olá, {primeiroEsegundoNome}
                        <img
                            src={perfil}
                            alt="perfil"
                            onError={(e) => {
                                // Substitui pela imagem padrão se a imagem falhar ao carregar
                                e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3237/3237472.png";
                            }}
                        />
                    </button>
                ) : (
                    <button className={styles.loginButton} onClick={() => signIn("google")}>
                        Acessar
                    </button>
                )}
            </section>
        </header>
    );
}
