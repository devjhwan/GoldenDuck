import Header from './components/Header';
import Footer from './components/Footer';
import MainDataGrid from './components/MainDataGrid';

export default function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <MainDataGrid />
      </main>
      <Footer />
    </div>
  );
}