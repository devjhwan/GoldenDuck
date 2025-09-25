import Header from './components/Header';
import Footer from './components/Footer';
import MainDataGrid from './components/MainDataGrid';
import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
// import ProTip from './ProTip';

export default function App() {
  return (
    <div style={{ width: '100%' }}>
      <Header />
      <main style={{ padding: '90px' }}>
        <MainDataGrid />
      </main>
      <Footer />
    </div>
  );
}