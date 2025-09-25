import Header from './components/Header';
import Footer from './components/Footer';
import MainDataGrid from './components/MainDataGrid';


export default function App() {
  return (
    <div style={{ width: '100%' }}>
      <Header />
      <main style={{ padding: '250px' }}>
        <MainDataGrid />
      </main>
      <Footer />
    </div>
  );
}