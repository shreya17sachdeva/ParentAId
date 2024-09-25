import React from 'react';
import './frontpage.css';
import Family from '../images/front_image.png';


function LandingPage() {
  return (
    <section className='landing'>
      <div className="circle"></div>
      <div className="content">
        <div className="textBox">
          <h2><span>ParentAId</span><br />Bridging Curiosity with Clarity</h2>
          <p>
            Parenting comes with countless questions - ParentAId provides thoughtful, easy-to-understand answers 
            to help guide you through every stage. From everyday curiosities to the most challenging questions, 
            we're here to support you with clarity and confidence.
          </p>
        </div>
        <div className="imgBox">
          <img src={Family} alt="Front" className="starbucks" />
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
