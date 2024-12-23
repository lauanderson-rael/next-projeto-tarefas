
import { ChangeEvent, useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import styles from "./styles.module.css";
import { db } from "@/services/firebaseConnection";
import { collection, doc, query, where, getDoc, getDocs, addDoc, deleteDoc } from "firebase/firestore";
import Textarea from "@/components/textarea";
import { FaTrash } from "react-icons/fa";

interface TaskProps {
    item: {
        tarefa: string;
        created: Date;
        public: boolean
        user: string;
        taskId: string;
    },
    params: {
        id: string;
    },
    allComments: CommentProps[],
}
interface CommentProps {
    id: string;
    comment: string;
    taskId: string;
    user: string;
    name: string
}

export default function Task({ item, allComments }: TaskProps) {
    const { data: session } = useSession()
    const [input, setInput] = useState("")
    const [comments, setComments] = useState<CommentProps[]>(allComments || [])

    async function handleCommnet(event: FormEvent) {
        event.preventDefault()
        if (input === "") return;

        if (!session?.user?.email || !session?.user?.name) return;

        try {
            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            });

            const data = {
                id: docRef.id,
                comment: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            }
            setComments([...comments, data])
            setInput("")

        } catch (error) {
            console.log(error)
        }

    }

    async function handleDeleteComment(id: string) {
        try {
            const docRef = doc(db, "comments", id)
            await deleteDoc(docRef)

            const deleteComment = comments.filter(comment => comment.id !== id)
            setComments(deleteComment)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Detalhes da tarefa</title>
            </Head>

            <main className={styles.main}>
                <h1>Tarefa</h1>
                <article className={styles.task}>
                    <p>
                        {item.tarefa}
                    </p>
                </article>
            </main>

            <section className={styles.commentsContainer}>
                <h2>Deixar comentário</h2>
                <form action="" onSubmit={handleCommnet}>
                    <Textarea
                        value={input}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                        placeholder="Digite seu comentário..."
                    />

                    <button className={styles.button} disabled={!session?.user}>Enviar comentário</button>
                </form>
            </section>

            <section className={styles.commentsContainer}>
                <h2>Todos os comentários</h2>


                {comments.length === 0 && <span>Nenhum comentário ainda...</span>}
                {comments.map((item) => (
                    <article key={item.id} className={styles.comment}>
                        <div className={styles.headComment}>
                            <label className={styles.commentsLabel}>{item.name}</label>
                            {item.user === session?.user?.email && (
                                <button className={styles.buttonTrash} onClick={() => handleDeleteComment(item.id)}>
                                    <FaTrash size={18} color="#ea3140" />
                                </button>
                            )}
                        </div>
                        <p>{item.comment}</p>
                    </article>
                ))}
            </section>
        </div>
    )
}

// lado do servidor - buscando dados da terefa[x] juntamente com os comentarios
export const getServerSideProps = async ({ params }: TaskProps) => {
    const id = params?.id as string
    // buscando comentarios
    const q = query(collection(db, "comments"), where("taskId", '==', id))
    const snapshotComments = await getDocs(q)

    let allComments: CommentProps[] = []
    snapshotComments.forEach((doc) => {
        allComments.push({
            id: doc.id,
            comment: doc.data().comment,
            taskId: doc.data().taskId,
            user: doc.data().user,
            name: doc.data().name
        })
    })


    // buscando tarefa
    const docRef = doc(db, "tarefas", id)
    const snapshopt = await getDoc(docRef)

    if (snapshopt.data() == undefined) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    if (snapshopt.data()?.public === false) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const miliseconds = snapshopt.data()?.created.seconds * 1000
    const task = {
        tarefa: snapshopt.data()?.tarefa,
        public: snapshopt.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshopt.data()?.user,
        taskId: id

    }

    console.log("tarefa buscada no banco: ", task)
    return {
        props: {
            item: task,
            allComments: allComments,
        }
    }
}
