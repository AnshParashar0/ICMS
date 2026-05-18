import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GetInTouch.css";

const ORG_TYPES = [
  "University / College",
  "Hospital / Healthcare",
  "Housing Society",
  "Corporate Office",
  "Government Institution",
  "Other",
];

export default function GetInTouchPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    org: "",
    orgType: "",
    message: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.org.trim()) errs.org = "Organization name is required";
    if (!form.orgType) errs.orgType = "Please select an organization type";
    if (!form.agree) errs.agree = "You must agree to be contacted";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="git-page">
      {/* Back button */}
      <button
        className="git-back-btn"
        onClick={() => navigate("/")}
        id="git-back-btn"
        aria-label="Go back to home"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </button>

      {/* Centered form card */}
      <div className="git-form-wrap">
        {!submitted ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="git-form-title">Send us a message</div>
            <div className="git-form-sub">
              Fill in your details and we'll be in touch shortly.
            </div>

            <div className="git-form-row">
              <div className="git-form-group">
                <label htmlFor="git-firstName">First Name *</label>
                <input
                  type="text"
                  id="git-firstName"
                  name="firstName"
                  placeholder="John"
                  value={form.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <span className="git-field-error">{errors.firstName}</span>}
              </div>
              <div className="git-form-group">
                <label htmlFor="git-lastName">Last Name *</label>
                <input
                  type="text"
                  id="git-lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <span className="git-field-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="git-form-group">
              <label htmlFor="git-email">Work Email *</label>
              <input
                type="email"
                id="git-email"
                name="email"
                placeholder="john@university.edu"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="git-field-error">{errors.email}</span>}
            </div>

            <div className="git-form-group">
              <label htmlFor="git-org">Organization Name *</label>
              <input
                type="text"
                id="git-org"
                name="org"
                placeholder="Your university / hospital / society"
                value={form.org}
                onChange={handleChange}
              />
              {errors.org && <span className="git-field-error">{errors.org}</span>}
            </div>

            <div className="git-form-group">
              <label htmlFor="git-orgType">Organization Type *</label>
              <select
                id="git-orgType"
                name="orgType"
                value={form.orgType}
                onChange={handleChange}
              >
                <option value="" disabled>Select your organization type</option>
                {ORG_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.orgType && <span className="git-field-error">{errors.orgType}</span>}
            </div>

            <div className="git-form-group">
              <label htmlFor="git-message">How can we help?</label>
              <textarea
                id="git-message"
                name="message"
                placeholder="Tell us about your infrastructure management challenges..."
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <div className="git-form-check">
              <input
                type="checkbox"
                id="git-agree"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
              />
              <label htmlFor="git-agree">
                I agree to be contacted by the ICMS team regarding my enquiry.
                We respect your privacy and will never share your data.
              </label>
            </div>
            {errors.agree && (
              <div className="git-field-error" style={{ marginTop: "-0.75rem", marginBottom: "1rem" }}>
                {errors.agree}
              </div>
            )}

            <button type="submit" className="git-btn-submit">
              Send Message <span>→</span>
            </button>
          </form>
        ) : (
          <div className="git-success-msg">
            <div className="git-success-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Message sent!</h3>
            <p>
              Thank you for reaching out. Our team will get back to you at
              your email within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
