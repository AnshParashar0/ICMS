import { Link } from 'react-router-dom'

const CONTACT_EMAIL = 'parasharansh445@gmail.com'
const LAST_UPDATED = 'October 25, 2026'

const sections = [
  {
    title: 'Using ICMS',
    text: 'ICMS helps users report and track infrastructure issues. Use the service only for its intended purpose and in compliance with your institution’s rules and applicable laws.',
  },
  {
    title: 'Your account',
    text: 'Provide accurate information when creating an account and keep your sign-in credentials secure. You are responsible for activity performed through your account. Contact us if you believe your account has been accessed without permission.',
  },
  {
    title: 'Complaints and content',
    text: 'Submit truthful, relevant complaint details and only upload content you are authorized to share. Do not submit unlawful, abusive, misleading, or harmful content, or attempt to disrupt or gain unauthorized access to the service.',
  },
  {
    title: 'Service availability',
    text: 'We work to keep ICMS available and reliable, but the service may occasionally be interrupted for maintenance, updates, or reasons outside our control. Features may change as the service develops.',
  },
  {
    title: 'Privacy',
    text: 'Our handling of personal information is described in the Privacy Policy.',
  },
]

const styles = {
  page: {
    minHeight: '100vh',
    padding: '40px 16px',
    background: '#f8fafc',
    color: '#334155',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  card: {
    maxWidth: 760,
    margin: '0 auto',
    padding: 'clamp(24px, 5vw, 48px)',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
  },
  title: {
    margin: 0,
    color: '#0f172a',
    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  meta: { margin: '8px 0 0', color: '#64748b', fontSize: '0.9rem' },
  intro: {
    marginTop: 28,
    padding: '16px 20px',
    background: '#f1f5f9',
    borderLeft: '3px solid #2563eb',
    borderRadius: '0 8px 8px 0',
    lineHeight: 1.7,
  },
  section: { marginTop: 28 },
  heading: { margin: '0 0 8px', color: '#0f172a', fontSize: '1.1rem' },
  text: { margin: 0, lineHeight: 1.75 },
  link: { color: '#2563eb', textDecoration: 'none' },
}

export default function Terms() {
  return (
    <main style={styles.page}>
      <article style={styles.card}>
        <h1 style={styles.title}>Terms of Use</h1>
        <p style={styles.meta}>Last updated {LAST_UPDATED}</p>

        <p style={styles.intro}>
          These terms explain the basic rules for using ICMS (Infrastructure
          Complaint Management System). By creating an account or using ICMS,
          you agree to follow them.
        </p>

        {sections.map(({ title, text }) => (
          <section key={title} style={styles.section}>
            <h2 style={styles.heading}>{title}</h2>
            <p style={styles.text}>
              {title === 'Privacy' ? (
                <>
                  Our handling of personal information is described in the{' '}
                  <Link to="/privacy" style={styles.link}>Privacy Policy</Link>.
                </>
              ) : text}
            </p>
          </section>
        ))}

        <section style={styles.section}>
          <h2 style={styles.heading}>Contact</h2>
          <p style={styles.text}>
            Questions about these terms? Email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={styles.link}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  )
}
