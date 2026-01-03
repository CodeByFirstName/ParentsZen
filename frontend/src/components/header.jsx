import React, { useState } from "react";
import { colors, font } from "../styles/designSystem";
import Modal from "../components/modal";
import SignUpForm from "../components/signUpForm";
import LoginForm from "../components/loginForm";
import VerificationCodeForm from "../components/verificationCodeForm";
import { Link } from "react-router-dom"; // ➕ Pour utiliser les <Link>

export default function Header({ logo }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const buttonStyle = {
    backgroundColor: "#FFD9B3",
    color: "#333",
    padding: "0.5rem 1rem",
    borderRadius: "1rem",
    textDecoration: "none",
    transition: "background-color 0.3s",
    display: "inline-block",
    cursor: "pointer",
  };

  const handleHover = (e, isHover) => {
    e.currentTarget.style.backgroundColor = isHover ? "#FFB066" : "#FFD9B3";
  };

  const openLoginModal = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const openSignUpModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  const handleRegister = () => {
    setShowSignUpModal(false);
    setShowVerificationModal(true);
  };

  const handleCodeSubmit = (code) => {
    console.log("Code vérifié :", code);
    setShowVerificationModal(false);
  };

  return (
    <header
      style={{
        backgroundColor: colors.background,
        padding: "1rem 2rem",
        fontFamily: font.family,
      }}
    >
      <div className="header-container flex justify-between items-center">
        <div className="logo">
          {logo ? (
            <img
              src="/images/logo_ParentsZen.png"
              alt="Logo ParentsZen"
              style={{ height: 50 }}
            />
          ) : (
            <h1
              style={{
                color: colors.primary,
                fontSize: font.sizes["2xl"],
                margin: 0,
              }}
            >
              ParentsZen
            </h1>
          )}
        </div>

        <button
          className="burger md:hidden text-3xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        <nav className="nav-desktop hidden md:block">
          <ul className="nav-links flex gap-6 items-center">
            <li>
              <Link to="/" className="text-gray-800 hover:text-orange-600">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-800 hover:text-orange-600">
                À propos
              </Link>
            </li>
            <li>
              <span
                style={buttonStyle}
                onClick={openSignUpModal}
                onMouseOver={(e) => handleHover(e, true)}
                onMouseOut={(e) => handleHover(e, false)}
              >
                S'inscrire
              </span>
            </li>
            <li>
              <span
                style={buttonStyle}
                onClick={openLoginModal}
                onMouseOver={(e) => handleHover(e, true)}
                onMouseOut={(e) => handleHover(e, false)}
              >
                Se connecter
              </span>
            </li>
          </ul>
        </nav>
      </div>

      {isMobileMenuOpen && (
        <nav className="nav-mobile mt-4 md:hidden">
          <ul className="nav-links flex flex-col gap-4">
            <li>
              <Link to="/" className="text-gray-800 hover:text-orange-600">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-800 hover:text-orange-600">
                À propos
              </Link>
            </li>
            <li>
              <span
                style={buttonStyle}
                onClick={openSignUpModal}
                onMouseOver={(e) => handleHover(e, true)}
                onMouseOut={(e) => handleHover(e, false)}
              >
                S'inscrire
              </span>
            </li>
            <li>
              <span
                style={buttonStyle}
                onClick={openLoginModal}
                onMouseOver={(e) => handleHover(e, true)}
                onMouseOut={(e) => handleHover(e, false)}
              >
                Se connecter
              </span>
            </li>
          </ul>
        </nav>
      )}

      {/* Modals */}
      <Modal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)}>
        <SignUpForm
          switchToLogin={openLoginModal}
          onClose={() => setShowSignUpModal(false)}
          onRegister={handleRegister}
        />
      </Modal>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm
          switchToSignup={openSignUpModal}
          onClose={() => setShowLoginModal(false)}
        />
      </Modal>

      <Modal isOpen={showVerificationModal} onClose={() => setShowVerificationModal(false)}>
        <VerificationCodeForm
          onClose={() => setShowVerificationModal(false)}
          onVerify={handleCodeSubmit}
        />
      </Modal>
    </header>
  );
}
