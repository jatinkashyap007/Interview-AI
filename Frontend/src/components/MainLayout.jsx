import React from 'react'
import Navbar from './Navbar'
import { Toaster } from 'react-hot-toast'

const MainLayout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117' }}>
            <Navbar />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#151B24',
                        color: '#F4F6F8',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                    },
                    success: {
                        iconTheme: {
                            primary: '#35E0C9',
                            secondary: '#151B24'
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#FF3B69',
                            secondary: '#151B24'
                        }
                    }
                }}
            />
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    )
}

export default MainLayout
