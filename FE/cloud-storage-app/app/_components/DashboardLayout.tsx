'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const pathname = usePathname()
    const router = useRouter()
    // Chuyển đổi giao diện sáng/tối
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    const toggleTheme = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme)
        document.body.classList.toggle('dark-mode', newTheme === 'dark')
        localStorage.setItem('theme', newTheme)
    }

    const [userMenuActive, setUserMenuActive] = useState(false)

    const toggleUserMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        setUserMenuActive(!userMenuActive)
    }

        // Đóng dropdown khi click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // Đóng file dropdown
            const dropdowns = document.querySelectorAll('.dropdown-menu.active')
            dropdowns.forEach(dropdown => {
                if (!dropdown.parentElement?.contains(e.target as Node)) {
                    dropdown.classList.remove('active')
                }
            })

            // Đóng user menu
            const userMenu = document.querySelector('.user-dropdown-menu')
            const headerAvatar = document.querySelector('.header-avatar')
            if (userMenu && !headerAvatar?.contains(e.target as Node)) {
                setUserMenuActive(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const isProfilePage = pathname === '/dashboard/profile'
    
    return (
        <>
        <header className="main-header">
            <div className="logo-content">
                <div className="logo" 
                onClick={() => router.push('/dashboard')}
                style={{cursor: 'pointer'}}
            >
                    <i className="bi bi-cloud"></i>
                    <div className="logo-name">Cloud Storage</div>
                </div>
            </div>

            {!isProfilePage && (
                <div className="search-box">
                    <input type="text" placeholder="Search..."/>
                    <i className="fa fa-search"></i>
                </div>
            )}

                    
            <div className="header-avatar" onClick={toggleUserMenu}>
                <img src="/images/pic1.png" alt="User Avatar" />
                <h2 className='user-name'>User</h2>
                {/* User Dropdown Menu */}
                <div className={`user-dropdown-menu ${userMenuActive ? 'active' : ''}`}>
                    <ul>
                        <li className="user-info-menu">
                            <img src="/images/pic1.png" alt="User" />
                            <div>
                                <h4>User</h4>
                                <span>user@email.com</span>
                            </div>
                        </li>
                        <li className="divider"></li>
                        
                        <li onClick={() => router.push('/dashboard/profile')}>
                            <i className="bi bi-person"></i>
                            <span>Edit Profile</span>
                        </li>
                        
                        <li className="theme-toggle">
                            <i className="bi bi-palette"></i>
                            <span>Theme</span>
                            <div className="theme-options">
                                <button 
                                    className={`theme-btn light-mode ${theme === 'light' ? 'active' : ''}`}
                                    onClick={() => toggleTheme('light')}
                                >
                                    <i className="bi bi-sun"></i>
                                </button>
                                <button 
                                    className={`theme-btn dark-mode ${theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => toggleTheme('dark')}
                                >
                                    <i className="bi bi-moon"></i>
                                </button>
                            </div>
                        </li>
                        
                        <li onClick={() => router.push('/dashboard/settings')}>
                            <i className="bi bi-gear"></i>
                            <span>Settings</span>
                        </li>
                        
                        <li className="divider"></li>
                        
                        <li className="logout" onClick={() => {
                            // Handle logout
                            console.log('Logging out...')
                            router.push('/login')
                        }}>
                            <i className="bi bi-box-arrow-right"></i>
                            <span>Logout</span>
                        </li>
                    </ul>
                </div>
            </div>
        </header>

        <div className="container">
            {children}
        </div>
        </>
    )
}