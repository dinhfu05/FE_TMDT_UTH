import React from 'react';
import Header from './components/admin/Header';
import Footer from './components/admin/Footer';
import TongQuan from './pages/admin/Tongquan';

function App() {
  return (
    <div className="App">
      <Header />
      
      {/* Sau này bạn sẽ dùng React Router để
        hiển thị đúng trang, tạm thời ta
        hiển thị trang Tổng Quan
      */}
      <TongQuan /> 

      <Footer />
    </div>
  );
}

export default App;