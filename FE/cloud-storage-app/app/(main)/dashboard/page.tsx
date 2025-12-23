'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import './dashboard.css'

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

      try {
        const res = await fetch(
          'http://localhost:5000/api/files/my-files',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (res.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
          return
        }

        const data = await res.json()
        setFiles(data)
      } catch (err) {
        console.error('Fetch files error:', err)
      }
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

    requestAnimationFrame(() => {
      const dropdownWidth = 220
      const dropdownHeight = 260

      let top = rect.bottom + 8
      let left = rect.right - dropdownWidth

      if (rect.bottom + dropdownHeight > window.innerHeight) {
        top = rect.top - dropdownHeight - 8
      }

      if (left < 10) {
        left = rect.left
      }

      setOpenMenu(prev =>
        prev?.fileId === fileId
          ? null
          : {
              fileId,
              top,
              left,
            }
      )
    })
  }

  // ================= CLOSE MENU =================
  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      if (
        target.closest('.menu-btn') ||
        target.closest('.dropdown-menu')
      ) {
        return
      }

      setOpenMenu(null)
    }

    document.addEventListener('mousedown', closeMenu)
    return () =>
      document.removeEventListener('mousedown', closeMenu)
  }, [])

// ================= ACTION =================
const handleAction = async (file: FileType, action: string) => {
  const token = localStorage.getItem('token');
  if (!token) return alert('Bạn chưa login');

  // ===== VIEW =====
  if (action === 'view') {
    // Mở route public kèm token query
    window.open(
      `http://localhost:5000/api/files/${file.id}/view-public?token=${token}`,
      '_blank'
    );
  }

  // ===== DOWNLOAD =====
if (action === 'download') {
  const token = localStorage.getItem('token');
  if (!token) return alert('Bạn chưa login');

  // Gọi route download-public kèm token
  window.open(
    `http://localhost:5000/api/files/${file.id}/download-public?token=${token}`,
    '_blank'
  );
}


// ===== SHARE =====
if (action === 'share') {
  const token = localStorage.getItem('token');
  if (!token) return alert('Bạn chưa login');

  try {
    // Gọi API share trên BE, trả về presigned URL
    const res = await fetch(
      `http://localhost:5000/api/files/${file.id}/share`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    if (data.shareUrl) {
      navigator.clipboard.writeText(data.shareUrl);
      alert('Link chia sẻ đã được copy! Bạn có thể gửi link này qua FB, email, ...');
    } else {
      alert('Không lấy được link chia sẻ');
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi khi chia sẻ file');
  }
}

  // ===== RENAME =====
if (action === 'rename') {
  const newName = prompt('Nhập tên mới', file.name);
  if (!newName || newName.trim() === file.name) return;

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/files/${file.id}/rename`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newName: newName.trim() }),
    });

    if (!res.ok) throw new Error('Rename failed');

    const updated = await res.json();
    setFiles(prev =>
      prev.map(f => (f.id === file.id ? { ...f, name: updated.file.name } : f))
    );
    alert('Đổi tên file thành công!');
  } catch (err) {
    console.error(err);
    alert('Đổi tên file thất bại');
  }
}

// ===== DELETE =====
if (action === 'delete') {
  if (!confirm(`Bạn chắc chắn muốn xoá "${file.name}"?`)) return;

  const token = localStorage.getItem('token');
  if (!token) return alert('Bạn chưa login');

  fetch(`http://localhost:5000/api/files/${file.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    setFiles(prev => prev.filter(f => f.id !== file.id));
  })
  .catch(err => console.error(err));
}

};


  // ================= FILE ICON =================
  const getFileIcon = (file: FileType) => {
    if (file.type === 'folder') return '/images/folder.png'
    if (file.name.endsWith('.pdf')) return '/images/file-pdf.png'
    if (file.name.endsWith('.doc') || file.name.endsWith('.docx'))
      return '/images/word-file.png'
    if (file.name.match(/\.(jpg|png|jpeg)$/))
      return file.previewUrl || '/images/image-file.png'
    return '/images/file.png'
  }

  // ================= RENDER =================
  return (
    <main className="home-content">
      <div className="files-grid">
        {files.map(file => (
          <div key={file.id} className="file-card">
            {/* ===== PREVIEW ===== */}
            <div className="file-preview">
              <img src={getFileIcon(file)} alt={file.name} />
            </div>

            {/* ===== INFO ===== */}
            <div className="file-info">
              <div className="file-header">
                <h3 className="file-name">{file.name}</h3>

                {/* ===== 3 DOTS ===== */}
                <button
                  className="menu-btn"
                  onClick={e =>
                    handleMenuClick(e, file.id)
                  }
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </button>

                {/* ===== DROPDOWN ===== */}
                {openMenu?.fileId === file.id && (
                  <div
                    className="dropdown-menu active"
                    style={{
                      top: openMenu.top,
                      left: openMenu.left,
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <ul>
                      <li
                        onClick={() =>
                          handleAction(file, 'view')
                        }
                      >
                        <i className="bi bi-eye"></i>
                        <span>View</span>
                      </li>

                      <li
                        onClick={() =>
                          handleAction(file, 'download')
                        }
                      >
                        <i className="bi bi-download"></i>
                        <span>Download</span>
                      </li>

                      <li
                        onClick={() =>
                          handleAction(file, 'share')
                        }
                      >
                        <i className="bi bi-share"></i>
                        <span>Share</span>
                      </li>

                      <li
                        onClick={() =>
                          handleAction(file, 'rename')
                        }
                      >
                        <i className="bi bi-pencil"></i>
                        <span>Rename</span>
                      </li>

                      <li className="divider"></li>

                      <li
                        className="danger"
                        onClick={() =>
                          handleAction(file, 'delete')
                        }
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
                <span className="file-date">
                  {file.createdAt}
                </span>
              </div>

              <div className="file-size">{file.size}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
