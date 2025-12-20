'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

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

    const [sidebarActive, setSidebarActive] = useState(false);

    const [currentUser, setCurrentUser] = useState<{ id: number; name: string; email: string; avatar?: string } | null>(null);

        useEffect(() => {
    const userStr = localStorage.getItem('user'); // đọc thông tin user đã login
        if (userStr) setCurrentUser(JSON.parse(userStr));
    }, []);

    // Xử lý logout
    const handleLogout = () => {
        localStorage.removeItem('user'); // Xoá thông tin user
        setCurrentUser(null);
        router.push('/login');
    };

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };

    // Upload dropdown và chọn loại upload là file hay folder
    const [uploadDropdownActive, setUploadDropdownActive] = useState(false)
    const [uploadType, setUploadType] = useState<'file' | 'folder'>('file')
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const folderInputRef = useRef<HTMLInputElement>(null)

    const uploadLinkRef = useRef<HTMLLIElement>(null)
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

    const toggleUploadDropdown = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        e.stopPropagation()
        
        // Tính vị trí dropdown
        if (uploadLinkRef.current) {
            const rect = uploadLinkRef.current.getBoundingClientRect()
            setDropdownPosition({
                top: rect.top,
                left: rect.right + 10
            })
        }
        
        setUploadDropdownActive(!uploadDropdownActive)
    }

    const selectUploadType = (type: 'file' | 'folder') => {
        setUploadType(type)
        setUploadDropdownActive(false)
        setShowUploadModal(true)
        setSelectedFiles(null) // Reset files khi chọn type mới
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(e.target.files)
        }
    }

    const handleBrowseClick = () => {
        if (uploadType === 'file') {
            fileInputRef.current?.click()
        } else {
            folderInputRef.current?.click()
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.add('drag-over')
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove('drag-over')
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.classList.remove('drag-over')
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFiles(e.dataTransfer.files)
        }
    }
////////// Upload files to server
const handleUpload = async () => {
  if (!selectedFiles) return;

  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  setIsUploading(true);
  setUploadDone(false);
  setUploadProgress(0);

  const formData = new FormData();
  Array.from(selectedFiles).forEach(file => formData.append('file', file));

  try {
    const res = await fetch('http://localhost:5000/api/files/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    console.log('Upload response:', data);

    if (!res.ok) alert('Upload thất bại: ' + data.message);

    // Animation loop
    const animateUpload = () => {
      setUploadProgress(prev => {
        const next = prev + 0.02;
        if (next < 1) setTimeout(animateUpload, 50);
        else setUploadDone(true);
        return next;
      });
    };
    animateUpload();
  } catch (err) {
    console.error(err);
    alert('Upload thất bại');
    setIsUploading(false);
  }
};


    // Upload modal states
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadDone, setUploadDone] = useState(false)
    
    const circleRef = useRef<HTMLDivElement>(null)
    const uploadRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const bubblesRef = useRef<HTMLDivElement[]>([])

    const openUploadModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        setShowUploadModal(true)
    }

    // Reset khi đóng modal
    const closeUploadModal = () => {
        setShowUploadModal(false)
        setSelectedFiles(null)
        resetUpload()
    }

    // Random float helper
    const randomFloat = (min: number, max: number): number => {
        return Math.random() * (max - min) + min
    }

    // Progress dim - hide upload button area
    const progressDim = () => {
        const uploadButton = uploadRef.current?.querySelector('[data-upload-button]') as HTMLButtonElement
        if (uploadButton?.parentElement) {
            uploadButton.parentElement.setAttribute('aria-hidden', 'true')
        }
    }

    // Progress loop - update progress and create bubbles
    const progressLoop = () => {
        setUploadProgress(prev => {
            const newProgress = prev + 0.01
            
            // Create bubble
            if (circleRef.current) {
                const bubble = document.createElement("div")
                const duration = randomFloat(2, 3)
                const brightness = randomFloat(0.6, 1)
                const rotate = randomFloat(-15, 15)
                const size = randomFloat(1, 2)

                bubble.classList.add("upload__bubble")
                bubble.style.setProperty("--dur", `${duration}s`)
                bubble.style.filter = `brightness(${brightness})`
                bubble.style.transform = `translateX(-50%) rotate(${rotate}deg)`
                bubble.style.width = `${size}em`
                bubble.style.height = `${size}em`
                
                bubblesRef.current.push(bubble)
                circleRef.current.appendChild(bubble)
            }

            // Continue loop or finish
            if (newProgress < 1) {
                timeoutRef.current = setTimeout(progressLoop, 50)
            } else {
                timeoutRef.current = setTimeout(progressDim, 500)
                setUploadDone(true)
                setIsUploading(false)
            }

            return newProgress
        })
    }

    // Start upload - CHỈ khi có file


    // Reset upload
    const resetUpload = () => {
        // Clear timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
        
        // Remove all bubbles
        if (circleRef.current) {
            while (circleRef.current.firstChild) {
                if (circleRef.current.lastChild) {
                    circleRef.current.removeChild(circleRef.current.lastChild)
                }
            }
            circleRef.current.removeAttribute("style")
        }

        // Reset states
        bubblesRef.current = []
        setIsUploading(false)
        setUploadProgress(0)
        setUploadDone(false)
        
        // Reset button area
        const uploadButton = uploadRef.current?.querySelector('[data-upload-button]') as HTMLButtonElement
        if (uploadButton?.parentElement) {
            uploadButton.parentElement.setAttribute('aria-hidden', 'false')
        }
    }

    // Update circle size based on progress
    useEffect(() => {
        if (circleRef.current && isUploading && !uploadDone) {
            const startSize = 13
            const enlargeBy = 10
            const size = startSize + enlargeBy * uploadProgress
            circleRef.current.style.width = `${size}em`
            circleRef.current.style.height = `${size}em`
        }
    }, [uploadProgress, isUploading, uploadDone])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    // Sửa lại useEffect - chỉ chạy khi sidebar active hoặc sau khi render
    useEffect(() => {
        // Delay để đảm bảo DOM đã render
        const timer = setTimeout(() => {
            const used = 30; // 
            const total = 100;
            const percent = (used / total) * 100;

            const barMask = document.getElementById('barMask') as HTMLElement; // ✅ Dùng ID thay vì querySelector
            const storageText = document.getElementById('storageText') as HTMLElement;
            
            console.log('Bar Mask:', barMask); 
            console.log('Storage Text:', storageText); 
            
            if (barMask && storageText) {
                barMask.style.width = (100 - percent) + '%';
                storageText.textContent = `${used}GB / ${total}GB Used`;
                console.log('Updated!'); 
            } else {
                console.log('Elements not found!'); 
            }
        }, 100); // 

        return () => clearTimeout(timer);
    }, [sidebarActive]); 


    // Đóng dropdown khi click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            // Đóng upload dropdown
            const uploadDropdown = document.querySelector('.upload-dropdown-menu')
            const uploadLink = document.querySelector('.upload-link')
            if (uploadDropdown && !uploadLink?.contains(e.target as Node)) {
                setUploadDropdownActive(false)
            }



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
                <img 
                    src={currentUser?.avatar || "/images/pic1.png"} 
                    alt="User Avatar" 
                />
                <h2 className='user-name'>{currentUser?.name || "User"}</h2>

                {/* User Dropdown Menu */}
                <div className={`user-dropdown-menu ${userMenuActive ? 'active' : ''}`}>
                    <ul>
                    <li className="user-info-menu">
                        <img 
                        src={currentUser?.avatar || "/images/pic1.png"} 
                        alt="User" 
                        />
                        <div>
                        <h4>{currentUser?.name || "User"}</h4>
                        <span>{currentUser?.email || "user@email.com"}</span>
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
                        localStorage.removeItem('token'); // xóa token
                        localStorage.removeItem('user');  // xóa user
                        router.push('/login');
                    }}>
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </li>
                    </ul>
                </div>
                </div>

        </header>

        <div className="container">
        {!isProfilePage && (
            <aside className={`sidebar ${sidebarActive ? "active" : ""}`}>
                <div className="sidebar-header">
                <i className="bi bi-list" id="btn" onClick={toggleSidebar}></i>
                </div>

                <ul className="sidebar-links">
                <li className="upload-link" style={{ position: 'relative' }} ref={uploadLinkRef}>
                    <a href="#" onClick={toggleUploadDropdown}>
                    <i className="bi bi-upload"></i>
                    <span className="link-name">Upload</span>
                    </a>
                    <span className="tooltip">Upload</span>
                </li>

                <li>
                    <a href="/dashboard/files">
                    <i className="bi bi-folder"></i>
                    <span className="link-name">My Files</span>
                    </a>
                    <span className="tooltip">My Files</span>
                </li>
                <li>
                    <a href="/dashboard/analytics">
                    <i className="bi bi-bar-chart-line"></i>
                    <span className="link-name">Statistics</span>
                    </a>
                    <span className="tooltip">Statistics</span>
                </li>
                <li>
                    <a href="/dashboard/trash">
                    <i className="bi bi-trash"></i>
                    <span className="link-name">Trash</span>
                    </a>
                    <span className="tooltip">Trash</span>
                </li>

                <li>
                    <a href="/dashboard/settings">
                    <i className="bi bi-gear"></i>
                    <span className="link-name">Settings</span>
                    </a>
                    <span className="tooltip">Settings</span>
                </li>

                <li>
                    <a href="/dashboard/used-storage">
                    <i className="bi bi-hdd"></i>
                    <span className="link-name">Used Storage</span>
                    </a>
                    <span className="tooltip">Used Storage</span>
                </li>
                </ul>

                <div className="storage-widget">
                    <div className="bar-container">
                        <div className="bar-mask" id="barMask">
                        </div>
                    </div>

                    <div className="storage-text" id="storageText">0GB of 100GB used</div>

                    <div className="legend">
                        <div className="legend-item">
                            <div className="dot green">
                            </div>       
                            <span>0-50%: Safe</span>                     
                        </div>

                        <div className="legend-item">
                            <div className="dot orange">
                            </div>
                            <span>51-80%: Warning</span>
                        </div>

                        <div className="legend-item">
                            <div className="dot red">
                            </div>
                            <span>81-100%: Full</span>
                        </div>
                            
                    </div>
                </div>
            </aside>
        )}

        {/* Upload Dropdown - Render outside sidebar */}
        {uploadDropdownActive && (
            <div 
                className="upload-dropdown-menu active"
                style={{
                    top: `${dropdownPosition.top}px`,
                    left: `${dropdownPosition.left}px`
                }}
            >
                <ul>
                    <li onClick={() => selectUploadType('file')}>
                        <i className="bi bi-file-earmark"></i>
                        <span>Upload File</span>
                    </li>
                    <li onClick={() => selectUploadType('folder')}>
                        <i className="bi bi-folder"></i>
                        <span>Upload Folder</span>
                    </li>
                </ul>
            </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
            <div className="upload-modal-overlay" onClick={closeUploadModal}>
              <div className="upload-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={closeUploadModal}>
                  <i className="bi bi-x-lg"></i>
                </button>
                
                <div className="uploadmodal">
                  {/* Hiện drag area KHI CHƯA UPLOAD */}
                  {!isUploading && !uploadDone && (
                    <div 
                      className={`drag-area ${selectedFiles ? 'has-files' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="icon"><i className="fas fa-cloud-upload-alt"></i></div>
                      <div className='drag-header'>
                        {uploadType === 'file' 
                          ? 'Drag & Drop to Upload File' 
                          : 'Drag & Drop to Upload Folder'}
                      </div>
                      
                      {selectedFiles && (
                        <div className="selected-files-info">
                          <i className="bi bi-check-circle-fill"></i>
                          <p>{selectedFiles.length} file(s) selected</p>
                        </div>
                      )}
                      
                      <span>OR</span>
                      <button className="browse-btn" onClick={handleBrowseClick}>
                        {uploadType === 'file' ? 'Browse File' : 'Browse Folder'}
                      </button>
                      
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        multiple 
                        hidden
                        onChange={handleFileSelect}
                      />
                      <input 
                        ref={folderInputRef}
                        type="file" 
                        webkitdirectory="" 
                        directory="" 
                        multiple 
                        hidden
                        onChange={handleFileSelect}
                      />
                      
                      {/* CHỈ HIỆN NÚT UPLOAD KHI CÓ FILE */}
                      {selectedFiles && (
                        <button 
                          className="upload__button start-upload-btn" 
                          type="button" 
                          onClick={handleUpload}

                        >
                          <i className="bi bi-upload"></i>
                          Start Upload
                        </button>
                      )}
                    </div>
                  )}

                  {/* Hiện animation upload KHI ĐANG/XONG UPLOAD */}
                  {(isUploading || uploadDone) && (
                    <div 
                      ref={uploadRef}
                      className={`upload ${isUploading ? 'upload--running' : ''} ${uploadDone ? 'upload--done' : ''}`}
                    >
                      <div className="upload__bubbles">
                        <div className="upload__cloud-explode">
                          <div className="upload__finish">
                            <svg 
                              role="img" 
                              aria-label="Checkmark in circle" 
                              className="upload__check" 
                              viewBox="0 0 128 128" 
                              width="128" 
                              height="128"
                            >
                              <g 
                                fill="none" 
                                stroke="hsl(223,90%,50%)" 
                                strokeWidth="4" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <circle 
                                  className="upload__check-ring" 
                                  r="62" 
                                  cx="64" 
                                  cy="64" 
                                  strokeDasharray="389.56 389.56" 
                                  strokeDashoffset="389.56" 
                                  transform="rotate(-90,64,64)" 
                                />
                                <polyline 
                                  className="upload__check-line" 
                                  points="40,64 56,80 88,48" 
                                  strokeDasharray="68 68" 
                                  strokeDashoffset="68" 
                                />
                              </g>
                            </svg>
                            <p className="upload__feedback">
                              {uploadType === 'file' ? 'File' : 'Folder'} has been uploaded successfully!
                            </p>
                            <button 
                              className="upload__button" 
                              type="button" 
                              onClick={closeUploadModal}
                            >
                              OK
                            </button>
                          </div>
                        </div>
                        <div className="upload__cloud-left"></div>
                        <div className="upload__cloud-middle" ref={circleRef}></div>
                        <div className="upload__cloud-right"></div>
                      </div>
                      <div aria-hidden={uploadDone ? 'true' : 'false'}>
                        <div className="upload__progress" data-progress>
                          {isUploading && !uploadDone ? `${Math.floor(uploadProgress * 100)}%` : ''}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
        )}
            <div
            className="dashboard-page-wrapper"
            onClick={(e) => e.stopPropagation()}
            >
            {children}
            </div>

        </div>
        </>
    )
}