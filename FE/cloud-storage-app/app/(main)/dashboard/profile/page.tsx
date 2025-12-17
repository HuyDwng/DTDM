'use client'
import React, { useState } from 'react'
import './profile.css'

export default function EditProfile() {
    const [activeTab, setActiveTab] = useState(0)
    const [avatarPreview, setAvatarPreview] = useState('/images/pic1.png')
    const [sidebarActive, setSidebarActive] = useState(false);

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };

    const tabs = (index: number) => {
        setActiveTab(index)
    }

        const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <>
        <div className='leftbox'>
            <nav>
                <a 
                onClick={() => tabs(0)} 
                className={`tab ${activeTab === 0 ? 'active' : ''}`}
                >
                <i className="fa fa-user"></i>
                </a>

                <a 
                onClick={() => tabs(1)} 
                className={`tab ${activeTab === 1 ? 'active' : ''}`}
                >
                <i className="fa fa-camera"></i>
                </a>

                <a 
                onClick={() => tabs(2)} 
                className={`tab ${activeTab === 2 ? 'active' : ''}`}
                >
                <i className="fa fa-lock"></i>
                </a>
            </nav>
        </div>

        <div className="rightbox">
            <div 
                className={`profile tabShow ${activeTab === 0 ? 'active' : ''}`}
                style={{ display: activeTab === 0 ? 'block' : 'none' }}
            >                
                <h1>Personal Info</h1>
                <h2>Full Name</h2>
                <input type="text" className="input" />
                <h2>Email</h2>
                <input type="email" className="input" />
                <h2>Gender</h2>
                <select className="input">
                    <option value="male">Male</option>
                    <option value="female"> Female</option>
                    <option value="other"> Other</option>
                </select>
                <h2>Phone Number</h2>
                <input type="text" className="input" />
                <button className="btn">Save Changes</button>
            </div>

            <div 
                className={`avatar tabShow ${activeTab === 1 ? 'active' : ''}`}
                style={{ display: activeTab === 1 ? 'block' : 'none' }}
            >
                <h1>Change Avatar</h1>
                <div className="avatar-upload-container">
                    <div className="avatar-preview">
                        <img src={avatarPreview} alt="Current Avatar" />
                        <div className="avatar-overlay">
                            <i className="fa fa-camera"></i>
                        </div>
                    </div>
                    
                    <label htmlFor="avatar-upload" className="custom-file-upload">
                        <i className="fa fa-upload"></i>
                        Choose Image
                    </label>
                    <input 
                        id="avatar-upload"
                        type="file" 
                        className="file-input" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                    
                    <p className="file-hint">
                        <i className="fa fa-info-circle"></i>
                        JPG, PNG or GIF (MAX. 5MB)
                    </p>
                </div>
                <button className="btn">Upload New Avatar</button>
            </div>

            <div 
                className={`password tabShow ${activeTab === 2 ? 'active' : ''}`}
                style={{ display: activeTab === 2 ? 'block' : 'none' }}
            >
                <h1>Password</h1>
                <h2>Current Password</h2>
                <input type="password" className="input"/>
                <h2>New Password</h2>
                <input type="password" className="input" />
                <h2>Confirm New Password</h2>
                <input type="password" className="input" />
                <button className="btn">Change Password</button>
            </div>
        </div>
        </>
    )
}