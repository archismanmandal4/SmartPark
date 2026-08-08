import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import heroImage from "../assets/smartpark-hero.png";


function Home() {

const navigate = useNavigate();


const [showIntro,setShowIntro] = useState(true);


const [isLoggedIn,setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);



const [stats,setStats] = useState({

totalParkings:14,

totalSlots:2490,

availableSlots:1305,

totalBookings:10

});




// INTRO

useEffect(()=>{

const timer=setTimeout(()=>{

setShowIntro(false);

},2400);


return ()=>clearTimeout(timer);


},[]);




// LOGIN CHECK

useEffect(()=>{


const checkLogin=()=>{

setIsLoggedIn(
!!localStorage.getItem("token")
);

};


window.addEventListener(
"storage",
checkLogin
);


window.addEventListener(
"focus",
checkLogin
);



return()=>{

window.removeEventListener(
"storage",
checkLogin
);


window.removeEventListener(
"focus",
checkLogin
);

};


},[]);





// DASHBOARD STATS

useEffect(()=>{


fetch(
"VITE_API_URL=https://smartpark-tvls.onrender.com/api/dashboard"
)

.then(res=>res.json())

.then(data=>{


setStats({

totalParkings:data.totalParkings ?? 14,

totalSlots:data.totalSlots ?? 2490,

availableSlots:data.availableSlots ?? 1305,

totalBookings:data.totalBookings ?? 10

});


})

.catch(()=>{});


},[]);





const handleBooking=()=>{


if(localStorage.getItem("token")){

navigate("/map");

}

else{

navigate("/login");

}


};





const handleLogout=()=>{


localStorage.removeItem("token");

localStorage.removeItem("user");

setIsLoggedIn(false);

navigate("/");


};





return(

<div className="smartpark-page">


<AnimatePresence>


{showIntro && (

<motion.div

className="intro-screen"

initial={{opacity:1}}

exit={{
opacity:0,
transition:{
duration:0.7
}
}}

>


<div className="intro-background-glow"/>



<motion.div

className="intro-logo"

initial={{
opacity:0,
scale:0.85
}}

animate={{
opacity:1,
scale:1
}}

transition={{
duration:0.9
}}

>

<span>
Smart
</span>

<strong>
Park
</strong>


</motion.div>



<div className="intro-word">

SMART PARK


</div>



<motion.p

initial={{opacity:0}}

animate={{opacity:1}}

transition={{
delay:0.9
}}

>

SMART PARKING. SMARTER CITY.

</motion.p>



</motion.div>

)}


</AnimatePresence>



<motion.div

className="main-site"

initial={{opacity:0}}

animate={{
opacity:showIntro ? 0 : 1
}}

transition={{
duration:0.7
}}
>{/* ================================
        NAVBAR
================================ */}


<header className="premium-navbar">


<div
className="premium-logo"
onClick={()=>navigate("/")}
>

<span>
Smart
</span>

<strong>
Park
</strong>

</div>




<nav className="premium-nav-links">


<button
className="nav-link active"
onClick={()=>navigate("/")}
>
Home
</button>



<button
className="nav-link"
onClick={()=>navigate("/map")}
>
Map
</button>




<button
className="nav-link"
onClick={()=>document
.getElementById("how-it-works")
?.scrollIntoView({
behavior:"smooth"
})}
>
How it Works
</button>




<button
className="nav-link"
onClick={()=>document
.getElementById("features")
?.scrollIntoView({
behavior:"smooth"
})}
>
Features
</button>






<button
className="nav-link"
onClick={()=>document
.getElementById("contact")
?.scrollIntoView({
behavior:"smooth"
})}
>
Contact
</button>




{isLoggedIn && (

<button

className="nav-link"

onClick={()=>navigate("/dashboard")}

>

Dashboard

</button>

)}



</nav>





<div className="navbar-actions">


{isLoggedIn ? (

<>



  <button
    className="nav-book-btn"
    onClick={handleBooking}
  >
    Book a Slot &ensp;
  </button>

  <button
    className="nav-logout-btn"
    onClick={() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      window.location.reload();
    }}
  >
    <span>↪</span>
    Logout 
  </button>
</>
):(


<>


<button

className="nav-link"

onClick={()=>navigate("/login")}

>

Login

</button> &ensp;



<button

className="nav-book-btn"

onClick={()=>navigate("/register")}

>

Register

</button> &ensp;




<button

className="nav-book-btn"

onClick={handleBooking}

>

Book a Slot

</button>



</>


)}



</div>



</header>








{/* ================================
        HERO
================================ */}



<section className="premium-hero">



<div className="hero-glow-one"/>

<div className="hero-glow-two"/>





<div className="hero-content">



<div className="network-badge">

<span className="live-dot"/>

Find Nearest Available Parking

</div>




<h1>

Your Space

<br/>

<span>
Before You
</span>

<br/>

<span>
Reach It !
</span>


</h1>





<p className="hero-description">

SmartPark connects you with available parking
around you, shows live availability, compares
prices and helps you reserve your space in advance.

</p>




<div className="hero-actions">


<button

className="hero-primary-btn"

onClick={()=>navigate("/map")}

>

Explore Parking

<span>
→
</span>


</button>




<button

className="hero-secondary-btn"

onClick={handleBooking}

>

Reserve a Space

</button>


</div>






<div className="hero-benefits">


<div className="benefit">

<div className="benefit-icon">
◉
</div>


<div>

<strong>
Live Availability
</strong>

<span>
Real-time updates
</span>

</div>


</div>





<div className="benefit">

<div className="benefit-icon">
⚡
</div>


<div>

<strong>
Instant Reservation
</strong>

<span>
Book in seconds
</span>

</div>


</div>






<div className="benefit">

<div className="benefit-icon">
♢
</div>


<div>

<strong>
Secure Platform
</strong>

<span>
100% protected
</span>

</div>


</div>



</div>



</div>








<div className="hero-visual">



<img

src={heroImage}

alt="SmartPark parking"

className="hero-car-image"

/>





<motion.div

>


<div className="parking-ring outer"/>

<div className="parking-ring middle"/>

<div className="parking-ring inner"/>



<div className="parking-pin">

<span>
P
</span>

</div>



</motion.div>





<div className="floating-info-card card-location">

<div className="info-icon">
♧
</div>


<div>

<strong>
{stats.totalParkings}
</strong>

<span>
Spots Nearby
</span>

<small>
Within 500m
</small>

</div>


</div>


<div className="floating-info-card card-price">


<div className="info-icon">
₹
</div>


<div>

<strong>
₹25
</strong>

<span>
Starting From
</span>

<small>
Per Hour
</small>

</div>


</div>





<div className="floating-info-card card-time">


<div className="info-icon">
◷
</div>


<div>

<strong>
2 <small>mins</small>
</strong>
<small>
From You
</small>
</div>
</div>
</div>
</section>{/* ================================
        STATS
================================ */}


<section className="stats-section">


<StatCard

icon="⌖"

value={stats.totalParkings}

label="Parking Locations"

/>



<StatCard

icon="▱"

value={stats.totalSlots}

label="Total Slots"

/>



<StatCard

icon="✓"

value={stats.availableSlots}

label="Available Slots"

/>



<StatCard

icon="♙"

value={stats.totalBookings}

label="Total Bookings"

/>



</section>







{/* ================================
        HOW IT WORKS
================================ */}


<section

className="simple-section"

id="how-it-works"

>


<div className="section-label">

SIMPLE PROCESS

</div>



<h2>

Park smarter in three steps.

</h2>




<p>

Find your space, reserve it and arrive without wasting time searching for parking.

</p>




<div className="steps-grid">



<div className="step-card">

<span>
01
</span>

<h3>
Find
</h3>

<p>

Discover available parking near your destination.

</p>

</div>





<div className="step-card">

<span>
02
</span>

<h3>
Reserve
</h3>

<p>

Choose your preferred slot and reserve it instantly.

</p>

</div>





<div className="step-card">

<span>
03
</span>

<h3>
Park
</h3>

<p>

Arrive, park and enjoy a completely stress-free experience.

</p>

</div>



</div>



</section>








{/* ================================
        FEATURES
================================ */}



<section

className="simple-section"

id="features"

>



<div className="section-label">

SMART FEATURES

</div>




<h2>

Everything you need to park better.

</h2>





<div className="feature-grid">



<div className="premium-feature">

<div>
◉
</div>


<h3>
Nearest Availability
</h3>


<p>
See nearest parking availability before you arrive.
</p>


</div>





<div className="premium-feature">

<div>
⚡
</div>


<h3>
Instant Booking
</h3>


<p>
Reserve your parking space before you arrive.
</p>


</div>





<div className="premium-feature">

<div>
₹
</div>


<h3>
Transparent Pricing
</h3>


<p>
Compare parking prices and choose confidently.
</p>


</div>





<div className="premium-feature">

<div>
♢
</div>


<h3>
Secure Platform
</h3>


<p>
Your bookings and account remain protected.
</p>


</div>



</div>



</section>








{/* ================================
        PRICING
================================ */}



<section

className="pricing-section"

id="pricing"

>


<div className="section-label">
Choose Parkings Based On User Ratings

</div>




<h2>

Instead of Roaming Around Looking For A Parking,
Find Nearest Available Spots Using Your Live Location. 

</h2>




<p>

No complicated plans. Find a spot and pay according to the parking location.

</p>



</section>








{/* ================================
        CTA
================================ */}



<section

className="final-cta"

id="contact"

>



<div>


<div className="section-label">

READY WHEN YOU ARE

</div>



<h2>

Your parking space is waiting.

</h2>




<p>

Stop searching. Start parking smarter.

</p>


</div>






<button

className="hero-primary-btn"

onClick={handleBooking}

>

Reserve a Space

<span>
→
</span>


</button>




</section>








{/* ================================
        FOOTER
================================ */}



<footer className="premium-footer">



<div className="premium-logo">

<span>
Smart
</span>

<strong>
Park
</strong>

</div>





<p>

Smart Parking Management System

</p>




<span>

© 2026 SmartPark. All Rights Reserved.

</span>




</footer>





</motion.div>


</div>


);

}







// ================================
// STAT CARD COMPONENT
// ================================


function StatCard({

icon,

value,

label

}){


return(

<motion.div

className="premium-stat-card"

whileHover={{
y:-6
}}

transition={{
duration:0.25
}}

>


<div className="stat-icon">

{icon}

</div>




<div>

<strong>

{value}

</strong>


<span>

{label}

</span>


</div>




</motion.div>


);


}



export default Home;