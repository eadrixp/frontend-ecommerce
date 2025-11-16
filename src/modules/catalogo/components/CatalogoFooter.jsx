import React from "react";
//import { CgEnter } from "react-icons/cg";
//import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const CatalogoFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="catalogo-footer">
      <div className="catalogo-footer-content">
        {/* Company Section */}
        <div className="catalogo-footer-section">
          <h3 className="catalogo-footer-title">Empresa</h3>
          <div className="catalogo-footer-links">
            <a href="#about" className="catalogo-footer-link">Acerca de Nosotros</a>
            <a href="#contact" className="catalogo-footer-link">Contáctanos</a>
          </div>
        </div>

        {/* Customer Service Section */}
        <div className="catalogo-footer-section">
          <h3 className="catalogo-footer-title">Servicio al Cliente</h3>
          <div className="catalogo-footer-links">
            <a href="#contact-us" className="catalogo-footer-link">Contáctanos 24/7</a>
            <a href="#returns" className="catalogo-footer-link">Devoluciones</a>
          </div>
        </div>

        {/* Account Section */}
        <div className="catalogo-footer-section">
          <h3 className="catalogo-footer-title">Cuenta</h3>
          <div className="catalogo-footer-links">
            <a href="#account" className="catalogo-footer-link">Tu Cuenta</a>
            <a href="#wishlist" className="catalogo-footer-link">Mi Lista de Deseos</a>
            <a href="#orders" className="catalogo-footer-link">Mis Pedidos</a>
            <a href="#addresses" className="catalogo-footer-link">Mis Direcciones</a>
          </div>
        </div>

        {/* Categories Section */}
        <div className="catalogo-footer-section">
          <h3 className="catalogo-footer-title">Categorías</h3>
          <div className="catalogo-footer-links">
            <a href="#electronics" className="catalogo-footer-link">Electrónica</a>
            <a href="#computers" className="catalogo-footer-link">Computadores</a>
            <a href="#phones" className="catalogo-footer-link">Teléfonos</a>
            <a href="#accessories" className="catalogo-footer-link">Accesorios</a>
            <a href="#deals" className="catalogo-footer-link">Ofertas Especiales</a>
          </div>
        </div>
      </div>

      <div className="catalogo-footer-divider"></div>

      <div className="catalogo-footer-info" style={{textAlign:"center"}}>
        <div>
          <div>© {currentYear} Nexxus Tecnology. Todos los derechos reservados.</div>
          <div>Desarrollado por Altiplano Verde</div>
        </div>
        {/*<div className="catalogo-footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
            <FiFacebook size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
            <FiTwitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
            <FiInstagram size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <FiLinkedin size={20} />
          </a>
        </div>*/}
      </div>
    </footer>
  );
};

export default CatalogoFooter;
