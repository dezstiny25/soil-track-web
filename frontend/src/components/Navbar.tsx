import { useState } from 'react';
import { NavLink } from   'react-router-dom';
import { ChevronDownIcon, LayoutDashboard, Layers, Cpu, Settings } from 'lucide-react';


import navbarStyles from '../styles/navbar.module.css';

// Assets
import Logo from '../assets/logos/green_logo.png';


const tabs = [
  { name: 'Dashboard', icon: <LayoutDashboard size={16} />, to: '/' },
  { name: 'Plots', icon: <Layers size={16} />, to: '/plots' },
  { name: 'Devices', icon: <Cpu size={16} />, to: '/devices' },
  { name: 'Settings', icon: <Settings size={16} />, to: '/settings' }
];

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className={`${navbarStyles.navbar}`}>
      <div className="container mx-auto my-4 flex items-center justify-between py-4 px-0">
        {/* Logo Placeholder */}
        <div className="flex-shrink-0">
            <img src={Logo} alt="Your Logo" className="h-12 w-48 object-contain" />
        </div>

        {/* Tab Navigation */}
        <div className="flex-grow flex justify-center">
          <nav className="flex space-x-4 bg-gray-100 rounded-full">
            {tabs.map(({ name, icon, to }) => (
              <NavLink
                key={name}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-[30px] py-5 rounded-full font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-[#134F14] text-white'
                      : 'text-gray-800 hover:bg-gray-200'
                  }`
                }
              >
                {icon}
                <span>{name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Profile & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={`${navbarStyles.profileButton} profile-button flex items-center focus:outline-none`}
          >
            {/* Replace this with your actual logic for detecting if user has an image */}
            {false ? (
              <img
                src="https://via.placeholder.com/32"
                alt="Profile"
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className={`${navbarStyles.defaultProfileIcon} h-12 w-12 rounded-full flex items-center justify-center font-medium`}>
                {/* Replace with dynamic initials from user data */}
                <span className="text-black font-semibold text-xl">AB</span>
              </div>
            )}
            <ChevronDownIcon className="mr-3 ml-2 h-4 w-4 text-gray-600" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
              <NavLink
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile Settings
              </NavLink>
              <NavLink
                to="/account"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Account
              </NavLink>
              <button
                onClick={() => { /* handle logout */ }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      
    </nav>
  );
}
