import React from "react";
import { FiShoppingBag, FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import UserMenu from "./UserMenu";

const CatalogoHeader = ({ 
  user, 
  isClienteLoggedIn, 
  cartCount, 
  onCartClick, 
  onUserClick,
  onLogout,
  searchTerm,
  onSearchChange,
  productos,
  selectedCategory,
  onCategoryChange
}) => {
  const navigate = useNavigate();
  return (
    <header className="catalogo-header">
      {/* Top Row - Logo and Actions */}
      <div className="catalogo-header-top">
        <div className="catalogo-header-logo" onClick={onUserClick}>
          <FiShoppingBag size={32} />
          <span>Nexxus Tecnology</span>
        </div>
        
        <div className="catalogo-header-actions">
          {user ? (
            <UserMenu 
              user={user} 
              onLogout={onLogout}
              onNavigate={navigate}
            />
          ) : (
            <div className="catalogo-header-user" onClick={onUserClick}>
              <FiShoppingBag size={20} style={{ width: '20px' }} />
              <span>Iniciar Sesión</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row - Filter, Search (centered), Cart */}
      <div className="catalogo-header-bottom">
        <div className="catalogo-header-filter">
          <CategoryFilter
            productos={productos}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
        <div className="catalogo-header-search">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={onSearchChange} 
          />
        </div>
        <button className="catalogo-header-cart-btn" onClick={onCartClick}>
          <FiShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="catalogo-header-cart-badge">{cartCount}</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default CatalogoHeader;
