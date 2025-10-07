import React from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Background Image */}
      <div className="landing-bg"></div>

      {/* Navigation / Logo */}
      <nav className="landing-nav">
        <img src="/logo.png" alt="Logo" className="landing-logo" />
        <div className="nav-buttons">
          <SignInButton>
            <button className="btn-outline">Sign In</button>
          </SignInButton>
          <SignUpButton>
            <button className="btn">Sign Up</button>
          </SignUpButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <h1>Your AI Coding Mentor for Professional Success</h1>
        <p>Advance your coding skills and master DSA with personalized AI guidance and coding assistance.</p>
        <div className="hero-buttons">
          <SignUpButton>
            <button className="btn btn-hero">Get Started</button>
          </SignUpButton>
        </div>
      </section>
    </div>
  );
}
