import React from 'react'
import Navbar from './Navbar'

const MainLayout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117' }}>
            <Navbar />
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    )
}

export default MainLayout
