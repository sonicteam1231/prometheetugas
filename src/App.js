import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import LHKANPage from './pages/LHKANPage';
//  // This is the page from your screenshot
// import LHKPNPage from './pages/LHKPNPage';
// import MasterPage from './pages/MasterPage';
import LaporanPage from './pages/LaporanPage';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/lhkan" element={<LHKANPage />} />
              {/* 
              <Route path="/lhk-pn" element={<LHKPNPage />} />
              <Route path="/master" element={<MasterPage />} /> */}
              <Route path="/laporan" element={<LaporanPage />} />
              {/* Add other routes as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;