import { HTMLProps } from 'react'
import styles from './styles.module.css'
const Textarea = ({ ...rest }: HTMLProps<HTMLTextAreaElement>) => {
    return (
        <textarea className={styles.textarea} {...rest}>

        </textarea>
    )
}

export default Textarea



//{... rest} --> resebe as prorpiedades inseridas no componente
