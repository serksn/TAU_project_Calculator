import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import "./Menu.css";

const Menu = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenuOnMobile = () => {
    setShowMenu(false);
    setActiveSubmenu(null);
  };

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  return (
    <header className="header">
      <nav className="nav container">
        <div className={`nav__menu ${showMenu ? "show-menu" : ""}`} id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item">
              <Link to="/" className="nav__link" onClick={closeMenuOnMobile}>
                Домашняя страница
              </Link>
            </li>
            <li className="nav__item">
              <div className="nav__link" onClick={() => toggleSubmenu(1)}>
                Тема 1
              </div>
              <ul className={`nav__submenu ${activeSubmenu === 1 ? "show-submenu" : ""}`}>
                <li className="nav__subitem">
                  <Link to="/term1/sub1" className="nav__sublink" onClick={closeMenuOnMobile}>
                    Подтема 1
                  </Link>
                </li>
                <li className="nav__subitem">
                  <Link to="/term1/sub2" className="nav__sublink" onClick={closeMenuOnMobile}>
                    Подтема 2
                  </Link>
                </li>
                <li className="nav__subitem">
                  <Link to="/term1/sub3" className="nav__sublink" onClick={closeMenuOnMobile}>
                    Подтема 3
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav__item">
              <div className="nav__link" onClick={() => toggleSubmenu(2)}>
                Тема 2
              </div>
              <ul className={`nav__submenu ${activeSubmenu === 2 ? "show-submenu" : ""}`}>
                <li className="nav__subitem">
                  <Link to="/term2/sub1" className="nav__sublink" onClick={closeMenuOnMobile}>
                    Подтема 1
                  </Link>
                </li>
                <li className="nav__subitem">
                  <Link to="/term2/sub2" className="nav__sublink" onClick={closeMenuOnMobile}>
                    Подтема 2
                  </Link>
                </li>
                <li className="nav__subitem">
                  <Link to="/term2/sub3" className="nav__sublink" onClick={closeMenuOnMobile}>
                    Подтема 3
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav__item">
              <div className="nav__link" onClick={() => toggleSubmenu(3)}>
                Тема 3
              </div>
              <ul className={`nav__submenu ${activeSubmenu === 3 ? "show-submenu" : ""}`}>
                <li className="nav__subitem">
                  <Link to="/term3/sub1" className="nav__sublink" onClick={closeMenuOnMobile}>
                    Подтема 1
                  </Link>
                </li>
                <li className="nav__subitem">
                  <Link to="/term3/sub2" className="nav__sublink" onClick={closeMenuOnMobile}>
                    Подтема 2
                  </Link>
                </li>
                <li className="nav__subitem">
                  <Link to="/term3/sub3" className="nav__sublink" onClick={closeMenuOnMobile}>
                    Подтема 3
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav__item">
              <Link to="/calc" className="nav__link" onClick={closeMenuOnMobile}>
                Калькулятор
              </Link>
            </li>
            <li className="nav__item">
              <Link to="/about" className="nav__link" onClick={closeMenuOnMobile}>
                О создателях
              </Link>
            </li>
          </ul>
          <div className="nav__close" id="nav-close" onClick={toggleMenu}>
            <IoClose />
          </div>
        </div>

        <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
          <IoMenu />
        </div>
      </nav>
    </header>
  );
};

export default Menu;