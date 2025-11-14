import React from 'react';
import Header from './components/admin/Header/Header';
import Footer from './components/admin/Footer/Footer';
//import TongQuan from './pages/admin/Tongquan/Tongquan';
import BanHang from './pages/admin/BanHang/BanHang';

function App() {
  return (
    <div className="App">
      <Header />
      
      {
      
      <BanHang />
      }
      {/* <TongQuan /> */}

      <Footer />
    </div>
  );
}

export default App;