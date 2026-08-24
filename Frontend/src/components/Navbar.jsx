import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import toast from 'react-hot-toast'
import './Navbar.scss'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const onLogout = async () => {
        setDropdownOpen(false)
        await handleLogout()
        toast.success("Logged out successfully!")
        navigate('/login')
    }

    const scrollToHistory = () => {
        if (location.pathname !== '/') {
            navigate('/')
            setTimeout(() => {
                const el = document.querySelector('.recent-reports') || document.querySelector('.history-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            }, 300)
        } else {
            const el = document.querySelector('.recent-reports') || document.querySelector('.history-section')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
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
                        New Plan
                    </Link>
                    <button
                        type="button"
                        onClick={scrollToHistory}
                        className="nav-link nav-link--button"
                    >
                        My History
                    </button>
                    {location.pathname.startsWith('/interview') && (
                        <span className="nav-link nav-link--active">
                            Active Session
                        </span>
                    )}
                </nav>

                <div className="nav-user" ref={dropdownRef}>
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
                                <div className="user-badge-row">
                                    <p className="info-name">{user?.username || 'User'}</p>
                                    <span className="pro-badge">PRO</span>
                                </div>
                                <p className="info-email">{user?.email || 'user@example.com'}</p>
                            </div>
                            <div className="dropdown-menu-links">
                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => {
                                        setDropdownOpen(false)
                                        toast.success(`Signed in as @${user?.username || 'user'}`)
                                    }}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    Profile Info
                                </button>
                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => {
                                        setDropdownOpen(false)
                                        scrollToHistory()
                                    }}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                                    My History
                                </button>
                            </div>
                            <button type="button" className="logout-btn" onClick={onLogout}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
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
                        New Plan
                    </Link>
                    <button
                        type="button"
                        className="mobile-link mobile-link--button"
                        onClick={() => {
                            setMobileMenuOpen(false)
                            scrollToHistory()
                        }}
                    >
                        My History
                    </button>
                </div>
            )}
        </header>
    )
}

export default Navbar
