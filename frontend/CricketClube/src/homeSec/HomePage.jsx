import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import Register from "./Register";
function HomePage(){
    return(
        <>
        <Navbar/>
        <Hero/>
        <FeaturesSection/>
        <Footer/>
        </>
    );
}

export default HomePage;