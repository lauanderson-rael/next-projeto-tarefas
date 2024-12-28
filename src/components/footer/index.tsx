import React from 'react';

export function Footer() {
    return (
        <>
            <footer style={styles.footer}>
                <p style={styles.text}>© 2024 Lauanderson Rael. Todos os direitos reservados.</p>
            </footer>
        </>
    );
};

const styles = {
    footer: {
        backgroundColor: 'var(--secondary)',
        color: '#ffffff',
        textAlign: 'center' as const,
        padding: '1rem',
        position: 'absolute' as const,
        botton: 0,
        width: '100%',
    },
    text: {
        margin: 0,
    },
};
