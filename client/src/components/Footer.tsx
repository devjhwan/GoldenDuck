export default function Footer() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#1976d2',
            marginTop: '20px',
            position: 'fixed',
            left: 0,
            bottom: 0,
            width: '100%',
            zIndex: 100
        }}>
            <footer style={{ color: 'white', paddingBlock: '5px' }}>
                <p>© 2025 GoldenDuck Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}