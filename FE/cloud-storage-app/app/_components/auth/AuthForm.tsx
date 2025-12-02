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

    const [isRegister, setIsRegister] = useState(type === 'register');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // đồng bộ với URL
    useEffect(() => {
      setIsRegister(type === 'register');
      setErrorMsg(null); // reset lỗi khi chuyển form
    }, [type]);

    // ----------- Hàm gửi request BE -----------
    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const target = e.target as typeof e.target & {
        username: { value: string };
        password: { value: string };
      };
      const email = target.username.value;
      const password = target.password.value;

      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        console.log('Login response:', data);
        if (data.token) {
          localStorage.setItem('token', data.token);
          router.push('/dashboard'); // chuyển trang sau khi login thành công
        } else {
          setErrorMsg(data.message || 'Login failed');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Error login');
      }
    };

    const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const target = e.target as typeof e.target & {
        username: { value: string };
        email: { value: string };
        password: { value: string };
      };
      const username = target.username.value;
      const email = target.email.value;
      const password = target.password.value;

      try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        console.log('Register response:', data);

        if (data.token) {
          // Nếu muốn auto login sau register, lưu token
          // localStorage.setItem('token', data.token);
          // Nhưng bây giờ redirect về login
          router.push('/login'); 
        } else {
          setErrorMsg(data.message || 'Register failed');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Error register');
      }
    };

    // ----------- Toggle giữa login/register -----------
    const handleRegisterClick = () => router.push("/register");
    const handleLoginClick = () => router.push("/login");

    return (
        <div className={`container ${isRegister ? 'active' : ''}`}>
            {/* Login Form */}
            <div className="form-box login">
                <form onSubmit={handleLoginSubmit}>
                    <h1>Login</h1>
                    {errorMsg && !isRegister && <p className="error-msg">{errorMsg}</p>}
                    <div className="input-box">
                        <input name="username" type="text" placeholder='Username or Email' required/>
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="input-box">
                        <input name="password" type="password" placeholder='Password' required/>
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
                <form onSubmit={handleRegisterSubmit}>
                    <h1>Registration</h1>
                    {errorMsg && isRegister && <p className="error-msg">{errorMsg}</p>}
                    <div className="input-box">
                        <input name="username" type="text" placeholder='Username' required/>
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="input-box">
                        <input name="email" type="email" placeholder='Email' required/>
                        <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div className="input-box">
                        <input name="password" type="password" placeholder='Password' required/>
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className="input-box">
                        <input name="confirm" type="password" placeholder='Confirm Password' required/>
                        <i className="fa-solid fa-lock"></i>
                    </div>
                    <div className="btn-box">
                        <button type="submit" className="btn">Register</button>
                    </div>
                </form>
            </div>

            {/* Toggle Box */}
            <div className="toggle-box">
                <div className="toggle-panel toggle-left">
                    <h1>Hello, Welcome!</h1>
                    <p>Don't have an account?</p>
                    <button className="btn register-btn" onClick={handleRegisterClick} type="button">Register</button>
                </div>

                <div className="toggle-panel toggle-right">
                    <h1>Welcome Back!</h1>
                    <p>Already have an account?</p>
                    <button className="btn login-btn" onClick={handleLoginClick} type="button">Login</button>
                </div>
            </div>
        </div>
    )
}
