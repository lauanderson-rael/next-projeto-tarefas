import { useSession, signIn, signOut } from "next-auth/react"
import styles from './styles.module.css'
import Link from 'next/link'
import perfilDefalt from '../../assets/profile.png'
import { useRouter } from 'next/router';

export function Header() {
    const { data: session, status } = useSession();
    const partesNome = session?.user?.name?.split(' ')
    const primeiroEsegundoNome = `${partesNome?.[0]}` + ' ' + `${partesNome?.[1] || ''}`;
    var perfil = session?.user?.image

    const router = useRouter();
    const { pathname } = router; // obtém a rota
    const textButton = pathname === "/task" ? "Home" : "Meu painel";

    return (
        <header className={styles.header}>
            <section className={styles.content}>
                <nav className={styles.nav}>
                    <Link href={'/'}>
                        <h1 className={styles.logo}>Tarefas<span>+</span></h1>
                    </Link>

                    {session?.user && (
                        <Link href={'/dashboard'} className={styles.link}>
                            {textButton}
                        </Link>
                    )}
                </nav>

                {status === "loading" ? (
                    <></>
                ) : session ? (
                    <button className={styles.loginButton} onClick={() => signOut()}>
                        Olá, {primeiroEsegundoNome}
                        <img src={`${perfil}` || "https://cdn-icons-png.flaticon.com/512/3237/3237472.png"} alt="perfil" />
                    </button>

                ) : (
                    <button className={styles.loginButton} onClick={() => signIn("google")}>
                        Acessar
                    </button>
                )
                }

            </section>
        </header>
    )
}
