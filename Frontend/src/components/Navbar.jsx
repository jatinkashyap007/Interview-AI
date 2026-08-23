import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import './Navbar.scss'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    const firstInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'U'

    return (
        <header className="app-navbar">
            <div className="navbar-container">
                <Link to="/" className="nav-brand">
                    <span className="brand-dot" />
                    Interview AI
                </Link>

                <nav className="nav-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}
                    >
                        Create Plan
                    </Link>
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname.startsWith('/interview') ? 'nav-link--active' : ''}`}
                    >
                        Interview Sessions
                    </Link>
                </nav>

                <div className="nav-user">
                    <button
                        type="button"
                        className="user-avatar-btn"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span className="avatar-circle">{firstInitial}</span>
                        <span className="username-text">{user?.username || 'User'}</span>
                        <span className={`chevron-icon ${dropdownOpen ? 'chevron-icon--open' : ''}`}>▼</span>
                    </button>

                    {dropdownOpen && (
                        <div className="user-dropdown">
                            <div className="dropdown-user-info">
                                <p className="info-name">{user?.username || 'User'}</p>
                                <p className="info-email">{user?.email || 'user@example.com'}</p>
                            </div>
                            <button type="button" className="logout-btn" onClick={onLogout}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                Log out
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="nav-container-mobile">
                    <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                        Create Plan
                    </Link>
                    <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                        Interview Sessions
                    </Link>
                </div>
            )}
        </header>
    )
}

export default Navbar
