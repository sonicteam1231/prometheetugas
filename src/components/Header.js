import React from 'react';
import { Bell, Edit, Upload, ChevronDown, MessageCircle } from 'lucide-react'
// Assuming you have a profile image in src/assets
import ProfileImage from '../assets/profile.jpeg';


const Header = () => {
  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-400 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <select className="bg-white bg-opacity-20 text-white border border-white border-opacity-30 rounded px-4 py-2 pr-8 appearance-none">
                      <option value="2025">2025</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Bell className="w-6 h-6" />
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">MR</span>
                      </div>
                      <span className="font-medium">Muhammad Rezky</span>
                    </div>
                  </div>
                </div>
              </div>
  );
};

export default Header;