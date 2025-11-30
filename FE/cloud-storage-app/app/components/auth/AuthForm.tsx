'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from "next/navigation";
import "./module.css";

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
    const router = useRouter();
    const pathname = usePathname();

    // luôn sync theo URL
    const [isRegister, setIsRegister] = useState(type === 'register');

    console.log('Type:', type);
    console.log('isRegister:', isRegister);

    const handleRegisterClick = () => {
        router.push("/register");
    };

    const handleLoginClick = () => {
        router.push("/login");
    };
    return (
        <div className={`container ${isRegister ? 'active' : ''}`}>
            {/* Login Form */}
            <div className="form-box login">
                <form action="#">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required/>
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' required/>
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className="forget-link">
                        <a href="#">Forgot Password?</a>
                    </div>
                    <div className="btn-box">
                        <button type="submit" className="btn">Login</button>
                    </div>
                </form>
            </div>

            {/* Register Form */}
            <div className="form-box register">
                <form action="#">
                    <h1>Rigistration</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required/>
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder='Email' required/>
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Password' required/>
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder='Confirm Password' required/>
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className="btn-box">
                        <button type="submit" className="btn">Register</button>
                    </div>
                </form>
            </div>

            {/* Toggle Box */}
            <div className="toggle-box">
                {/* Toggle Box Left */}
                <div className="toggle-panel toggle-left">
                    <h1>Hello, Welcome!</h1>
                    <p>Don't have an account?</p>
                    <button 
                        className="btn register-btn" id="register-btn" 
                        onClick={handleRegisterClick} 
                        type="button">Register</button>
                </div>

                {/* Toggle Box Right */}
                <div className="toggle-panel toggle-right">
                    <h1>Welcome Back!</h1>
                    <p>Already have an account?</p>
                    <button 
                        className="btn login-btn" id="login-btn"
                        onClick={handleLoginClick}
                        type="button">Login</button>
                </div>
            </div>


        </div>
    )
}
