import React from 'react';
import '../Footer/footer.css';
import BrownImage from '../../assets/Brown.png'; // Correct relative path to the image

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-left">
          <img src={BrownImage} alt="logo" />
          <p>Lorem ipsum dolor sit amet consectetur. Nullam aliquam tellus.</p>
          <div className="social">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="GitHub"><i class="fab fa-github"></i></a>
          </div>

        </div>
        <ul className="footer-right">
          <li>
            <h2>Quick Link</h2>
            <ul className="box">
              <li><a href='#'>Home</a></li>
              <li><a href='#'>My Shelf</a></li>
              <li><a href='#'>Contribute</a></li>
              <li><a href='#'>Events</a></li>
              <li><a href='#'>Announcements</a></li>
            </ul>
          </li>

          <li className='features'>
            <h2></h2>
            <ul className="box">
              <li><a href='#'>About Us</a></li>
              <li><a href='#'>Barrowing policy</a></li>
              <li><a href='#'>Privecy Policy</a></li>
              <li><a href='#'>Contact Us</a></li>
              <li><a href='#'>My Account</a></li>
              <li><a href='#'>Privecy Policy</a></li>
            </ul>
          </li>

          <li className='features'>
            <h2>Address</h2>
            <ul className="box">
              <li><a href='#'>127, Pitipana</a></li>
              <li><a href='#'>Thalagala Rd, Homagama</a></li>
              <li><a href='#'>Sri Lanka</a></li>
            </ul>
          </li>
        </ul>
        <div className="footer-bottom">
          <p> Brown INC © 2024. All rights reserved. </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
