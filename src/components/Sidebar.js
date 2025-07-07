import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Import icons dari lucide-react
import { Home, FileText, Settings, LogOut, Menu, X } from 'lucide-react';

const Sidebar = () => {
  const [active, setActive] = useState('Dashboard');
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={32} />, path: '/' },
    { name: 'Master', icon: <Settings size={32} />, path: '/masteraccount' },
    { name: 'LHKAN', icon: <FileText size={32} />, path: '/lhkan' },
    { name: 'LHKPN', icon: <FileText size={32} />, path: '/laporan' }, // Menggunakan FileText lagi untuk konsistensi
    { name: 'Logout', icon: <LogOut size={32} />, path: '/login' },
  ];

  return (
    <div>
      <button className="p-4 md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={32} /> : <Menu size={32} />}
      </button>
      <aside className={`w-80 bg-[rgba(240,240,240,0.4)] h-screen p-8 fixed md:relative transform md:translate-x-0 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="text-left mb-16">
          <h1 className="text-2xl font-bold text-[#0062FF]">APLIKASI PELAPORAN</h1>
        </div>
        <ul className="space-y-6">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center p-3 rounded-md cursor-pointer 
              ${active === item.name ? 'bg-[#0062FF] text-white border-2' : 'text-gray-700'}
              hover:bg-[#0062FF] hover:text-white transition-colors duration-200`}
            >
              <Link
                to={item.path}
                onClick={() => setActive(item.name)}
                className="flex items-center w-full"
              >
                {item.icon}
                <span className="ml-6 text-lg">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;