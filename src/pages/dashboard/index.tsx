import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

import styles from './styles.module.css'
import Head from 'next/head'

export default function Dashboard() {

    return (
        <div className={styles.container}>
            <Head>
                <title>Meu Painel de tarefas</title>
            </Head>

            <h1>Pagina painel</h1>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    console.log("buscando pelo server side --------------")
    const session = await getSession({ req })
    console.log(session)
    if (!session?.user) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
    return {
        props: {},
    };
}
