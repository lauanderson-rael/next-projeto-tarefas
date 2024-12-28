import React from 'react';
import Modal from 'react-modal';
import styles from './styles.module.css';

Modal.setAppElement('#__next'); // Necessário para acessibilidade

const ModalUser = ({ isOpen, onRequestClose, name, url, email }: any) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <img src={url} alt={`${name}`} className={styles.avatar} />
                    <h2>{name}</h2>
                    <p>Email: <strong>{email}</strong></p>
                </div>
                <footer className={styles.cardFooter}>
                    <button
                        className={styles.button}
                        onClick={onRequestClose}
                        style={{ backgroundColor: 'green' }}
                    >
                        Fechar
                    </button>
                </footer>
            </div>
        </Modal>
    );
};

export default ModalUser;
