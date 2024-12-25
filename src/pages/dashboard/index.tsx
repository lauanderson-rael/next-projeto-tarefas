import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import styles from './styles.module.css'
import Head from 'next/head'
import Link from 'next/link'


import Textarea from '@/components/textarea'
import { FiShare2 } from 'react-icons/fi'
import { FaTrash } from 'react-icons/fa'
import { IoMdOpen } from "react-icons/io";

import { db } from '@/services/firebaseConnection'
import { addDoc, collection, query, orderBy, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import ConfirmDeleteModal from '@/components/modalDelete'

interface HomeProps {
    user: {
        email: string
    }
}

interface TaskProps {
    id: string;
    created: string;
    public: boolean;
    tarefa: string;
    user: string
}

export default function Dashboard({ user }: HomeProps) {
    const [input, setInput] = useState("")
    const [publicTask, setPublicTask] = useState(false)
    const [tasks, setTasks] = useState<TaskProps[]>([])
    // modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const openModal = (taskId: any) => {
        setTaskToDelete(taskId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setTaskToDelete(null);
        setIsModalOpen(false);
    };

    // end modal

    useEffect(() => {
        async function loadTarefas() {
            const tarefasRef = collection(db, "tarefas")
            const q = query(
                tarefasRef, orderBy("created", "desc"),
                where("user", "==", user?.email)
            )
            // sempre atualizar a lista, quando o banco mudar algo
            onSnapshot(q, (snapshot) => {
                let lista = [] as TaskProps[];
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa,
                        created: doc.data().created,
                        public: doc.data().public,
                        user: doc.data().user
                    })
                })
                setTasks(lista)
            })
        }

        loadTarefas()
    }, [user?.email])


    function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
        console.log(event.target.checked)
        setPublicTask(event.target.checked)
    }

    async function handleRegisterTask(event: FormEvent) {
        event.preventDefault();
        if (input === "") return;

        try {
            await addDoc(collection(db, "tarefas"), {
                tarefa: input,
                created: new Date(),
                user: user?.email,
                public: publicTask

            })
            setInput("")
            setPublicTask(false)

        } catch (error) {
            console.log(error)
        }
    }

    async function handleShare(id: string) {
        const siteURL = process.env.NODE_ENV === "development"
            ? "http://localhost:3000"  // URL de desenvolvimento
            : window.location.origin; // URL em produção (Vercel)
        const link = `${siteURL}/task/${id}`
        await navigator.clipboard.writeText(link);
        alert("URL copiada com sucesso!\nAgora voce pode compartilhar essa terefa com quem voce quiser.");
    }

    async function handleDeleteTask() {
        if (taskToDelete) {
            const id = taskToDelete
            const docRef = doc(db, "tarefas", id)
            await deleteDoc(docRef)
            closeModal();
        }
    }


    return (
        <div className={styles.container}>
            <Head>
                <title>Meu Painel de tarefas</title>
            </Head>

            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual sua nova tarefa?</h1>

                        <form action="" onSubmit={handleRegisterTask}>
                            <Textarea
                                placeholder='Digite qual sua tarefa ...'
                                value={input}
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                            />
                            <div className={styles.checkboxArea}>
                                <input type="checkbox" className={styles.checkbox}
                                    checked={publicTask}
                                    onChange={handleChangePublic}

                                />
                                <label htmlFor="">Deixar tarefa publica?</label>
                            </div>

                            <button className={styles.button} type='submit'>
                                Registrar
                            </button>
                        </form>
                    </div>
                </section>

                <section className={styles.taskContainer}>
                    <h1>Minhas terefas</h1>

                    {tasks.map((item) => (
                        <article className={styles.task} key={item.id}>
                            {item.public && (
                                // Publico e botao compartilhar e link
                                <div className={styles.tagContainer}>
                                    <label className={styles.tag}>PUBLICO</label>
                                    <button className={styles.shareButton} onClick={() => handleShare(item.id)}>
                                        <FiShare2 size={22} color='#3183ff' />
                                    </button>
                                    <button className={styles.shareButton}>
                                        <Link href={`task/${item.id}`}>
                                            <IoMdOpen size={22} color='#3183ff' />
                                        </Link>
                                    </button>
                                </div>
                            )}

                            <div className={styles.taskContent}>
                                {item.public ? (
                                    <Link href={`task/${item.id}`}>
                                        <p>{item.tarefa}</p>
                                    </Link>
                                ) : (
                                    <p>{item.tarefa}</p>
                                )}
                                <button className={styles.trashButton} onClick={() => openModal(item.id)} >
                                    <FaTrash size={24} color='#ea3140' />
                                </button>
                                <ConfirmDeleteModal
                                    isOpen={isModalOpen}
                                    onRequestClose={closeModal}
                                    onConfirm={handleDeleteTask}
                                />
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    )
}

// lado do servidor - buscanso dados do usuario se logado
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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
        props: {
            user: {
                email: session?.user?.email,
                // photoURL: session?.user?.image
            }
        },
    };
}
