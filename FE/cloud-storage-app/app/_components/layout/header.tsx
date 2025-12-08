// import a from "next/Link";
import Link from "next/dist/client/link";
import React from "react";

export default function Header() {
    return (
        <>
            {/* header section starts */}
            <header>

                <input type="checkbox" name="" id="toggler" />
                <label htmlFor="toggler" className="fas fa-bars"></label>

                <a href="#" className="logo">Cloud Storage App</a>
                
                <nav className="navbar">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#services">Services</a>
                    <a href="#review">Reviews</a>
                    <a href="#contact">Contact</a>
                </nav>

                <div className="icons">
                    <a href="#" className="fas fa-heart" title="Favorites"></a>
                    <a href="#" className="fas fa-shopping-cart" title="Cart"></a>
                    <Link href="/dashboard" className="fas fa-home" title="Dashboard"></Link>
                    <Link href="/login" className="fas fa-user" title="Login"></Link>
                    <Link href="/register" className="fas fa-user-plus" title="Register"></Link>
                </div>
            </header>
            {/* header section ends */}
        </>
    );
}
