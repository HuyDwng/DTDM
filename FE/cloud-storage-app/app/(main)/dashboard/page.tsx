'use client'
import React, { useEffect, useState } from 'react'
import './dashboard.css'
import { useRouter } from 'next/navigation'

interface FileType {
  id: number
  name: string
  size: string
  createdAt: string
  ownerName: string
  type: 'file' | 'folder'
  previewUrl?: string
}

export default function Dashboard() {
  const router = useRouter()

  const [files, setFiles] = useState<FileType[]>([])
  const [openMenu, setOpenMenu] = useState<{
    fileId: number
    top: number
    left: number
  } | null>(null)

  // ================= FETCH FILES =================
  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const res = await fetch('http://localhost:5000/api/files/my-files', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      setFiles(data)
    }

    fetchFiles()
  }, [router])

  // ================= CLICK 3 DOTS =================
  const handleMenuClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    fileId: number
  ) => {
    e.stopPropagation()

    const rect = e.currentTarget.getBoundingClientRect()

    setOpenMenu(prev =>
      prev?.fileId === fileId
        ? null
        : {
            fileId,
            top: rect.bottom + 6,
            left: rect.right - 220,
          }
    )
  }

  // ================= CLOSE MENU =================
  useEffect(() => {
    const closeMenu = () => setOpenMenu(null)
    document.addEventListener('click', closeMenu)
    return () => document.removeEventListener('click', closeMenu)
  }, [])

  // ================= ACTION =================
  const handleAction = (file: FileType, action: string) => {
    console.log(action, file)

    if (action === 'delete') {
      setFiles(prev => prev.filter(f => f.id !== file.id))
    }

    setOpenMenu(null)
  }

  const getFileIcon = (file: FileType) => {
    if (file.type === 'folder') return '/images/folder.png'
    if (file.name.endsWith('.pdf')) return '/images/file-pdf.png'
    if (file.name.endsWith('.doc') || file.name.endsWith('.docx'))
      return '/images/word-file.png'
    if (file.name.match(/\.(jpg|png|jpeg)$/))
      return file.previewUrl || '/images/image-file.png'
    return '/images/file.png'
  }

  return (
    <main className="home-content">
      <div className="files-grid">
        {files.map(file => (
          <div key={file.id} className="file-card">
            <div className="file-preview">
              <img src={getFileIcon(file)} alt={file.name} />
            </div>

            <div className="file-info">
              <div className="file-header">
                <h3 className="file-name">{file.name}</h3>

                {/* ===== 3 DOTS ===== */}
                <button
                  className="menu-btn"
                  onClick={e => handleMenuClick(e, file.id)}
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </button>

                {/* ===== DROPDOWN ===== */}
                {openMenu?.fileId === file.id && (
                  <div
                    className="dropdown-menu active"
                    style={{
                      position: 'fixed',
                      top: openMenu.top,
                      left: openMenu.left,
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <ul>
                      <li onClick={() => handleAction(file, 'view')}>
                        <i className="bi bi-eye"></i>
                        <span>View</span>
                      </li>
                      <li onClick={() => handleAction(file, 'download')}>
                        <i className="bi bi-download"></i>
                        <span>Download</span>
                      </li>
                      <li onClick={() => handleAction(file, 'share')}>
                        <i className="bi bi-share"></i>
                        <span>Share</span>
                      </li>
                      <li onClick={() => handleAction(file, 'rename')}>
                        <i className="bi bi-pencil"></i>
                        <span>Rename</span>
                      </li>
                      <li className="divider"></li>
                      <li
                        className="danger"
                        onClick={() => handleAction(file, 'delete')}
                      >
                        <i className="bi bi-trash"></i>
                        <span>Delete</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="file-meta">
                <div className="owner">
                  <img
                    src="/images/pic1.png"
                    alt="Owner"
                    className="owner-avatar"
                  />
                  <span>{file.ownerName}</span>
                </div>
                <span className="file-date">{file.createdAt}</span>
              </div>

              <div className="file-size">{file.size}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
