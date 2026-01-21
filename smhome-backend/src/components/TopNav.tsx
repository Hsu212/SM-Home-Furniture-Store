import React from 'react';
import { FaShoppingCart, FaUser, FaHeart, FaGlobe, FaSun, FaMoon } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import '../styles/TopNav.css';
import { useTranslation } from 'react-i18next'; // ✅ Import the hook correctly

interface TopNavProps {
  cartCount: number;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
  isScrolled: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ cartCount, toggleTheme, theme, isScrolled }) => {
  // ✅ Initialize the translation hook
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // ✅ Actually change the language
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="top-nav">
      <Link to="/" className="logo">
        SM Home
      </Link>
      
      <div className={`search-bar-container ${isScrolled ? 'visible' : 'hidden'}`}>
        {isScrolled && <SearchBar />}
      </div>
      
      <div className="nav-items">
        {/* Language Switcher */}
        <div className="nav-icon language">
          <FaGlobe />
          <select 
            onChange={handleLanguageChange} 
            value={i18n.language} 
            className="language-select"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'inherit', 
              marginLeft: '5px', 
              cursor: 'pointer', 
              fontSize: '1rem',
              outline: 'none'
            }}
          >
            <option value="en" style={{ color: 'black' }}>English</option>
            <option value="es" style={{ color: 'black' }}>Spanish</option>
            <option value="fr" style={{ color: 'black' }}>French</option>
            <option value="vi" style={{ color: 'black' }}>Vietnamese</option>
          </select>
        </div>

        <Link to="/profile" className="nav-icon">
          <FaUser />
        </Link>
        <Link to="/favorites" className="nav-icon favorites">
          <FaHeart />
        </Link>
        <Link to="/cart" className="nav-icon cart">
          <FaShoppingCart />
          <span>{cartCount}</span>
        </Link>
        <div className="nav-icon theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </div>
      </div>
    </div>
  );
};

export default TopNav;