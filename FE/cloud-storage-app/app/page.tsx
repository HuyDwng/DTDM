import Link from "next/dist/client/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* main section starts */}
      <section className="home" id="home">

        <div className="content">
            <h3>Store Your Files </h3>
            <span>Securely</span>
            <p>Lưu trữ và quản lý files của bạn một cách an toàn với Cloud Storage App.</p>
            <a href="#" className="btn">Get Started</a>
        </div>
        
      </section>
      {/* main section ends */}

      {/* about section start */}
      <section className="about" id="about">

        <h1 className="heading"><span> about </span> us</h1>

        <div className="row">

          <div className="video-container">
            <video src="images/about-vid.mp4" loop autoPlay muted></video>
            <h3>best cloud storage</h3>
          </div>

          <div className="content">
            <h3>why choose us?</h3>
            <p>Cloud Storage App cung cấp giải pháp lưu trữ đám mây an toàn và tiện lợi, giúp bạn quản lý và truy cập dữ liệu mọi lúc, mọi nơi.</p>
            <p>Với giao diện thân thiện và tính năng bảo mật cao, chúng tôi cam kết mang đến trải nghiệm lưu trữ tốt nhất cho người dùng.</p>
            <a href="#" className="btn">learn more</a>
          </div>

        </div>
      </section>
      {/* about section ends */}

      {/* icons section starts */}
      <section className="icons-container">

        <div className="icons">
          <img src="images/icon-1.png" alt="" />
          <div className="info">
            <h3>Bảo mật cao</h3>
            <span>Mã hóa SSL 256-bit</span>
          </div>
        </div>

        <div className="icons">
          <img src="images/icon-2.png" alt="" />
          <div className="info">
            <h3>Upload nhanh</h3>
            <span>Tốc độ lên đến 100MB/s</span>
          </div>
        </div>

        <div className="icons">
          <img src="images/icon-3.png" alt="" />
          <div className="info">
            <h3>Đa thiết bị</h3>
            <span>Sync trên mọi thiết bị</span>
          </div>
        </div>

        <div className="icons">
          <img src="images/icon-4.png" alt="" />
          <div className="info">
            <h3>Hỗ trợ 24/7</h3>
            <span>Đội ngũ support luôn sẵn sàng</span>
          </div>
        </div>

      </section>
      {/* icons section ends */}

      {/* services section starts */}
      {/* <section className="services" id="services">

        <h1 className="heading"> our <span>services</span> </h1>

        <div className="box-container">
          
          <div className="box">
            <div className="image">
              <img src="images/service-1.png" alt="" />
            </div>
            <h3>secure storage</h3>
            <p>Đảm bảo an toàn tuyệt đối cho dữ liệu của bạn với công nghệ mã hóa tiên tiến.</p>
          </div>

          <div className="box">
            <div className="image">
              <img src="images/service-2.png" alt="" />
              <a href="" className="fas fa-share"></a>
            </div>
            <h3>file sharing</h3>
            <p>Dễ dàng chia sẻ tệp với bạn bè và đồng nghiệp chỉ với vài cú nhấp chuột.</p>
          </div>

          <div className="box">
            <div className="image">
              <img src="images/service-3.png" alt="" />
            </div>
            <h3>cloud backup</h3>
            <p>Tự động sao lưu dữ liệu quan trọng của bạn để tránh mất mát không mong muốn.</p>
          </div>

          <div className="box">
            <div className="image">
              <img src="images/service-4.png" alt="" />
            </div>
            <h3>multi-device access</h3>
            <p>Truy cập dữ liệu của bạn từ bất kỳ thiết bị nào, bất cứ lúc nào.</p>
          </div>
          
        </div>
      </section> */}
      {/* services section ends */}

      {/* reviews section starts */}
      <section className="review" id="review">
        <h1 className="heading"> customer's <span>review</span> </h1>

        <div className="box-container">

          <div className="box">
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <p>Cloud Storage App đã thay đổi cách tôi quản lý dữ liệu. Giao diện thân thiện và tính năng bảo mật tuyệt vời!</p>
            <div className="user">
              <img src="images/pic1.png" alt="" />
              <div className="user-info">
                <h3>Nguyen Van A</h3>
                <span>happy customer</span>
              </div>
            </div>
            <span className="fas fa-quote-right"></span>
          </div>

          <div className="box">
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <p>Cloud Storage App đã thay đổi cách tôi quản lý dữ liệu. Giao diện thân thiện và tính năng bảo mật tuyệt vời!</p>
            <div className="user">
              <img src="images/pic2.png" alt="" />
              <div className="user-info">
                <h3>Nguyen Van B</h3>
                <span>happy customer</span>
              </div>
            </div>
            <span className="fas fa-quote-right"></span>
          </div>

          <div className="box">
            <div className="stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </div>
            <p>Cloud Storage App đã thay đổi cách tôi quản lý dữ liệu. Giao diện thân thiện và tính năng bảo mật tuyệt vời!</p>
            <div className="user">
              <img src="images/pic3.png" alt="" />
              <div className="user-info">
                <h3>Nguyen Van C</h3>
                <span>happy customer</span>
              </div>
            </div>
            <span className="fas fa-quote-right"></span>
          </div>
        </div>
      </section>
      {/* reviews section ends */}

      {/*contact section starts */}
      <section className="contact" id="contact">
        <h1 className="heading"> <span> contact </span> us </h1>

        <div className="row">

          <form action="">
            <input type="text" placeholder="Your Name" className="box" />
            <input type="email" placeholder="Your Email" className="box" />
            <input type="number" placeholder="Your Number" className="box" />
            <textarea name="" id="" className="box" placeholder="message" cols={30} rows={10}></textarea>
            <input type="submit" value="send message" className="btn" />
          </form>

          <div className="image">
            <img src="images/contact-img.png" alt="" />
          </div>

        </div>
      </section>
      {/*contact section ends */}
    </>
  );
}
