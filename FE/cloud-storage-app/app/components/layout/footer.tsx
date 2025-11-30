// import a from "next/Link";
import React from "react";

export default function Footer() {
    return (
        <>
            {/* footer section starts */}
            <section className="footer">
                <div className="box-container">

                    <div className="box">
                        <h3>quick links</h3>
                        <a href="#home">home</a>
                        <a href="#features">about</a>
                        <a href="#pricing">services</a>
                        <a href="#reviews">reviews</a>
                        <a href="#faq">contact</a>
                    </div>

                    <div className="box">
                        <h3>extra links</h3>
                        <a href="#home">my account</a>
                        <a href="#features">my orders</a>
                        <a href="#pricing">my favorites</a>
                    </div>

                    <div className="box">
                        <h3>locations</h3>
                        <a href="#home">vietnam</a>
                        <a href="#features">india</a>
                        <a href="#pricing">USA</a>
                        <a href="#faq">france</a>
                    </div>

                    <div className="box">
                        <h3>contact info</h3>
                        <a href="#home">+84-749-235-678</a>
                        <a href="#features">example@gmail.com</a>
                        <a href="#pricing">abc, vietnam</a>
                        <img src="images/payment.png" alt="" />
                    </div>

                </div>

                <div className="credit"> created by <span> mr.web</span> | all rights reserved</div>

            </section>
            {/* footer section ends */}
        </>
    );
}
