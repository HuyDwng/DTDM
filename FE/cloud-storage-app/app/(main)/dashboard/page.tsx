"use client";
import React, { useState, useEffect } from "react";
import "./dashboard.css";

export default function Dashboard() {
  // Toggle dropdown menu với auto positioning
  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const dropdown = e.currentTarget.nextElementSibling as HTMLElement;

    // Đóng tất cả dropdown khác
    document.querySelectorAll(".dropdown-menu.active").forEach((menu) => {
      if (menu !== dropdown) {
        menu.classList.remove("active");
      }
    });

    if (dropdown) {
      // Nếu đang đóng thì mở và tính vị trí
      if (!dropdown.classList.contains("active")) {
        const btnRect = e.currentTarget.getBoundingClientRect();
        const dropdownWidth = 220;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Tính vị trí top
        let top = btnRect.bottom + window.scrollY + 8;

        // Kiểm tra nếu dropdown vượt quá chiều cao màn hình
        if (btnRect.bottom + 300 > windowHeight) {
          top = btnRect.top + window.scrollY - 300;
        }

        // Tính vị trí left
        let left = btnRect.right + window.scrollX - dropdownWidth;

        if (btnRect.right + 100 > windowWidth) {
          left = btnRect.left + window.scrollX - dropdownWidth - 10;
        }

        if (left < 10) {
          left = btnRect.left + window.scrollX;
        }

        dropdown.style.top = `${top}px`;
        dropdown.style.left = `${left}px`;
      }

      dropdown.classList.toggle("active");
    }
  };

  // Cập nhật thanh tiến trình lưu trữ khi component được mount
  // Fetch API sau
  useEffect(() => {
    const used = 90;
    const total = 100;
    const percent = (used / total) * 100;

    const barMask = document.querySelector('.bar-mask') as HTMLElement;
    const storageText = document.querySelector('.storage-text') as HTMLElement;
    
    if (barMask && storageText) {
      barMask.style.width = (100 - percent) + '%';
      storageText.textContent = `${used}GB / ${total}GB Used`;
    }
  }, []);

  return (
    <>

      <main className="home-content">
        <div className="files-grid">
          {/* File Card 1 */}
          <div className="file-card">
            <div className="file-preview">
              <img src="/images/word-file.png" alt="Word Document" />
            </div>
            <div className="file-info">
              <div className="file-header">
                <h3 className="file-name">Project Proposal.docx</h3>
                <button className="menu-btn" onClick={toggleDropdown}>
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <i className="bi bi-eye"></i>
                      <span>View</span>
                    </li>
                    <li>
                      <i className="bi bi-download"></i>
                      <span>Download</span>
                    </li>
                    <li>
                      <i className="bi bi-share"></i>
                      <span>Share</span>
                    </li>
                    <li>
                      <i className="bi bi-pencil"></i>
                      <span>Rename</span>
                    </li>
                    <li>
                      <i className="bi bi-star"></i>
                      <span>Add to Starred</span>
                    </li>
                    <li className="divider"></li>
                    <li className="danger">
                      <i className="bi bi-trash"></i>
                      <span>Delete</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="file-meta">
                <div className="owner">
                  <img
                    src="/images/pic1.png"
                    alt="Owner"
                    className="owner-avatar"
                  />
                  <span>John Doe</span>
                </div>
                <span className="file-date">2 hours ago</span>
              </div>
              <div className="file-size">1.2 MB</div>
            </div>
          </div>

          {/* File Card 2 */}
          <div className="file-card">
            <div className="file-preview">
              <img src="/images/file-pdf.png" alt="PDF Document" />
            </div>
            <div className="file-info">
              <div className="file-header">
                <h3 className="file-name">Report 2024.pdf</h3>
                <button className="menu-btn" onClick={toggleDropdown}>
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <i className="bi bi-eye"></i>
                      <span>View</span>
                    </li>
                    <li>
                      <i className="bi bi-download"></i>
                      <span>Download</span>
                    </li>
                    <li>
                      <i className="bi bi-share"></i>
                      <span>Share</span>
                    </li>
                    <li>
                      <i className="bi bi-pencil"></i>
                      <span>Rename</span>
                    </li>
                    <li>
                      <i className="bi bi-star"></i>
                      <span>Add to Starred</span>
                    </li>
                    <li className="divider"></li>
                    <li className="danger">
                      <i className="bi bi-trash"></i>
                      <span>Delete</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="file-meta">
                <div className="owner">
                  <img
                    src="/images/pic1.png"
                    alt="Owner"
                    className="owner-avatar"
                  />
                  <span>John Doe</span>
                </div>
                <span className="file-date">5 hours ago</span>
              </div>
              <div className="file-size">3.5 MB</div>
            </div>
          </div>

          {/* File Card 3 */}
          <div className="file-card">
            <div className="file-preview">
              <img src="/images/vacation.jpg" alt="Image" />
            </div>
            <div className="file-info">
              <div className="file-header">
                <h3 className="file-name">Vacation Photo.jpg</h3>
                <button className="menu-btn" onClick={toggleDropdown}>
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <i className="bi bi-eye"></i>
                      <span>View</span>
                    </li>
                    <li>
                      <i className="bi bi-download"></i>
                      <span>Download</span>
                    </li>
                    <li>
                      <i className="bi bi-share"></i>
                      <span>Share</span>
                    </li>
                    <li>
                      <i className="bi bi-pencil"></i>
                      <span>Rename</span>
                    </li>
                    <li>
                      <i className="bi bi-star"></i>
                      <span>Add to Starred</span>
                    </li>
                    <li className="divider"></li>
                    <li className="danger">
                      <i className="bi bi-trash"></i>
                      <span>Delete</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="file-meta">
                <div className="owner">
                  <img
                    src="/images/pic1.png"
                    alt="Owner"
                    className="owner-avatar"
                  />
                  <span>John Doe</span>
                </div>
                <span className="file-date">Yesterday</span>
              </div>
              <div className="file-size">5.8 MB</div>
            </div>
          </div>

          {/* File Card 4 */}
          <div className="file-card">
            <div className="file-preview">
              <img src="/images/word-file.png" alt="Word Document" />
            </div>
            <div className="file-info">
              <div className="file-header">
                <h3 className="file-name">Project Proposal.docx</h3>
                <button className="menu-btn" onClick={toggleDropdown}>
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <i className="bi bi-eye"></i>
                      <span>View</span>
                    </li>
                    <li>
                      <i className="bi bi-download"></i>
                      <span>Download</span>
                    </li>
                    <li>
                      <i className="bi bi-share"></i>
                      <span>Share</span>
                    </li>
                    <li>
                      <i className="bi bi-pencil"></i>
                      <span>Rename</span>
                    </li>
                    <li>
                      <i className="bi bi-star"></i>
                      <span>Add to Starred</span>
                    </li>
                    <li className="divider"></li>
                    <li className="danger">
                      <i className="bi bi-trash"></i>
                      <span>Delete</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="file-meta">
                <div className="owner">
                  <img
                    src="/images/pic1.png"
                    alt="Owner"
                    className="owner-avatar"
                  />
                  <span>John Doe</span>
                </div>
                <span className="file-date">2 hours ago</span>
              </div>
              <div className="file-size">1.2 MB</div>
            </div>
          </div>

          {/* File Card 5 */}
          <div className="file-card">
            <div className="file-preview">
              <img src="/images/word-file.png" alt="Word Document" />
            </div>
            <div className="file-info">
              <div className="file-header">
                <h3 className="file-name">Project Proposal.docx</h3>
                <button className="menu-btn" onClick={toggleDropdown}>
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <i className="bi bi-eye"></i>
                      <span>View</span>
                    </li>
                    <li>
                      <i className="bi bi-download"></i>
                      <span>Download</span>
                    </li>
                    <li>
                      <i className="bi bi-share"></i>
                      <span>Share</span>
                    </li>
                    <li>
                      <i className="bi bi-pencil"></i>
                      <span>Rename</span>
                    </li>
                    <li>
                      <i className="bi bi-star"></i>
                      <span>Add to Starred</span>
                    </li>
                    <li className="divider"></li>
                    <li className="danger">
                      <i className="bi bi-trash"></i>
                      <span>Delete</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="file-meta">
                <div className="owner">
                  <img
                    src="/images/pic1.png"
                    alt="Owner"
                    className="owner-avatar"
                  />
                  <span>John Doe</span>
                </div>
                <span className="file-date">2 hours ago</span>
              </div>
              <div className="file-size">1.2 MB</div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
