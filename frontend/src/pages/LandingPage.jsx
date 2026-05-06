import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/LandingPage.css";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Data ---------- */
const PARTNERS_ROW_1 = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
  "BITS Pilani", "NIT Trichy", "NIT Surathkal", "Delhi University", "JNU",
  "University of Mumbai", "Calcutta University", "Anna University",
  "Savitribai Phule Pune University", "Manipal University", "Amity University",
  "VIT Vellore", "SRM Institute", "Chandigarh University", "LPU",
  "Tata Projects", "Larsen and Toubro Construction", "Shapoorji Pallonji",
  "GMR Group", "Afcons Infrastructure", "NCC Limited",
  "Hindustan Construction Company", "Gammon India",
];

const PARTNERS_ROW_2 = [
  "Sobha Constructions", "Godrej Construction", "DLF Engineering",
  "Reliance Infrastructure", "Adani Infrastructure", "Simplex Infrastructures",
  "Ahluwalia Contracts", "Capacite Infraprojects", "KNR Constructions",
  "PSP Projects", "Apollo Hospitals", "Fortis Healthcare", "Max Healthcare",
  "Manipal Hospitals", "Narayana Health", "Aster DM Healthcare",
  "KIMS Hospitals", "Medanta", "Artemis Hospitals", "Yashoda Hospitals",
  "BLK Max Super Speciality Hospital", "Ruby Hall Clinic",
  "Sri Ramachandra Hospital", "Rainbow Hospitals", "Care Hospitals",
  "Lilavati Hospital", "Kokilaben Dhirubhai Ambani Hospital",
];

const STATS = [
  { title: "24/7", desc: "Complaint submission and status visibility" },
  { title: "Role Based", desc: "Secure student and admin access using JWT" },
  { title: "Realtime", desc: "Email updates on every status transition" },
  { title: "Trackable", desc: "End-to-end audit trail from pending to resolved" },
];

const WORKFLOW = [
  { title: "Student Login", desc: "Secure authentication with role-based authorization." },
  { title: "Raise Complaint", desc: "Add category, location, priority, and optional photo evidence." },
  { title: "Admin Review", desc: "Filter complaints and assign action based on urgency." },
  { title: "Status Update", desc: "Pending, In Progress, and Resolved stages with notifications." },
  { title: "Analytics", desc: "Visual overview of category and complaint status trends." },
  { title: "Transparency", desc: "Students can continuously monitor all their submissions." },
];

/* ---------- Component ---------- */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  /* Refs for GSAP */
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);
  const partnersRef = useRef(null);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.classList.toggle("lp-no-scroll", menuOpen);
    return () => document.body.classList.remove("lp-no-scroll");
  }, [menuOpen]);

  /* Close mobile menu on nav click */
  const handleNavClick = useCallback(() => setMenuOpen(false), []);

  /* ---------- GSAP marquee ---------- */
  useEffect(() => {
    const tweens = [];
    const tracks = [track1Ref.current, track2Ref.current];

    tracks.forEach((track, idx) => {
      if (!track) return;
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 45 + idx * 6,
        ease: "none",
        repeat: -1,
      });
      tween.timeScale(-1);
      tweens.push(tween);
    });

    let trigger;
    if (partnersRef.current && tweens.length) {
      trigger = ScrollTrigger.create({
        trigger: partnersRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const scale = self.direction === 1 ? -1 : 1;
          tweens.forEach((tw) => tw.timeScale(scale));
        },
      });
    }

    return () => {
      tweens.forEach((tw) => tw.kill());
      if (trigger) trigger.kill();
    };
  }, []);

  /* ---------- GSAP fade-in on scroll ---------- */
  useEffect(() => {
    const elements = document.querySelectorAll(".lp-fade-in");
    const triggers = [];

    elements.forEach((el) => {
      const t = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
        },
      });
      triggers.push(t);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  /* ---------- Render helpers ---------- */
  const renderPartnerTrack = (partners, ref) => (
    <div className="lp-partners-row">
      <div className="lp-partners-track" ref={ref}>
        {/* Duplicate for seamless loop */}
        {[...partners, ...partners].map((name, i) => (
          <span className="lp-partner-pill" key={`${name}-${i}`}>{name}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="landing-page">
      {/* ===================== HEADER ===================== */}
      <header className="lp-header">
        <div className="lp-container lp-nav-wrap">
          <a className="lp-logo" href="#home" onClick={handleNavClick}>ICMS</a>

          {/* Desktop nav */}
          <nav className="lp-menu" id="lp-desktop-nav">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#partners">Partners</a>
            <a href="#contact">Contact</a>
          </nav>

          <a
            className="lp-btn lp-btn-dark lp-nav-signup"
            href="#"
            onClick={(e) => { e.preventDefault(); navigate("/register"); }}
          >
            Sign Up
          </a>

          {/* Hamburger */}
          <button
            className={`lp-hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            id="lp-hamburger-btn"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ===================== MOBILE MENU OVERLAY ===================== */}
      <nav
        className={`lp-mobile-menu ${menuOpen ? "open" : ""}`}
        id="lp-mobile-nav"
        aria-hidden={!menuOpen}
      >
        <a href="#features" onClick={handleNavClick}>Features</a>
        <a href="#workflow" onClick={handleNavClick}>Workflow</a>
        <a href="#partners" onClick={handleNavClick}>Partners</a>
        <a href="#contact" onClick={handleNavClick}>Contact</a>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); handleNavClick(); navigate("/register"); }}
          className="lp-btn lp-btn-primary"
          style={{ marginTop: "0.5rem" }}
        >
          Sign Up
        </a>
      </nav>

      {/* ===================== HERO ===================== */}
      <main id="home">
        <section className="lp-hero">
          <div className="lp-container lp-hero-grid">
            <div className="lp-hero-content lp-fade-in">
              <h1>
                <span className="lp-highlight">Report Faster</span>,<br />
                <span className="lp-highlight">Track Better</span>,<br />
                Resolve Campus Issues with ICMS
              </h1>
              <p>
                ICMS is a full-stack complaint management platform where students can
                submit infrastructure complaints and administrators can monitor,
                prioritize, and resolve them with complete transparency.
              </p>
              <div className="lp-hero-actions">
                <a className="lp-btn lp-btn-primary" href="#contact">For Students</a>
                <a className="lp-btn lp-btn-secondary" href="#contact">For Admin</a>
              </div>
            </div>
            <div className="lp-hero-image-card lp-fade-in">
              <img
                src="/landing-assets/cffe1fe8cc6044afb78bf8280589855c.jpg"
                alt="Students collaborating in campus environment"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ===================== TRUSTED STATS ===================== */}
        <section id="features" className="lp-section lp-section-lilac">
          <div className="lp-container">
            <h2 className="lp-fade-in">
              <span className="lp-highlight">Trusted</span> For Campus Operations
            </h2>
            <div className="lp-stats-grid">
              {STATS.map((s) => (
                <article key={s.title} className="lp-fade-in">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== WORKFLOW ===================== */}
        <section id="workflow" className="lp-section lp-section-dark">
          <div className="lp-container">
            <h2 className="lp-fade-in">
              <span className="lp-highlight">Endorsed</span> Workflow for Institutions
            </h2>
            <div className="lp-icon-grid">
              {WORKFLOW.map((w) => (
                <article key={w.title} className="lp-fade-in">
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== PARTNERS ===================== */}
        <section id="partners" className="lp-section" ref={partnersRef}>
          <div className="lp-container">
            <h2 className="lp-fade-in">
              Our <span className="lp-highlight">Partners</span>
            </h2>
            <div className="lp-partners-marquee">
              {renderPartnerTrack(PARTNERS_ROW_1, track1Ref)}
              {renderPartnerTrack(PARTNERS_ROW_2, track2Ref)}
            </div>

            <div className="lp-image-row lp-fade-in">
              <img
                src="/landing-assets/af48435a71106620efcfe205e38dab92.jpg"
                alt="Infrastructure sample one"
                loading="lazy"
              />
              <img
                src="/landing-assets/3e6f0de69e522b86390283a53c762753.jpg"
                alt="Infrastructure sample two"
                loading="lazy"
              />
              <img
                src="/landing-assets/infrasture.jpg"
                alt="Infrastructure issue visual"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ===================== CTA ===================== */}
      <section id="contact" className="lp-cta">
        <div className="lp-container lp-fade-in">
          <h2>We would love to improve your campus infrastructure</h2>
          <p>
            Use ICMS to digitize complaint handling, reduce delays, and increase
            accountability between students and institution teams.
          </p>
          <a
            href="#"
            className="lp-btn lp-btn-dark"
            onClick={(e) => { e.preventDefault(); navigate("/register"); }}
          >
            Get In Touch
          </a>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer-content">
          <div>
            <h3>ICMS</h3>
            <p>Infrastructure Complaint Management System</p>
          </div>
          <div className="lp-footer-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#partners">Partners</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
