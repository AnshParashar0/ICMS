const CONTACT_EMAIL = 'parasharansh445@gmail.com'
const APP_NAME = 'ICMS'
const LAST_UPDATED = 'October 25, 2026'

const SECTIONS = [
  {
    id: 'collect',
    title: 'Information we collect',
    body: [
      'We collect only what is needed to run your account and handle your complaints:',
    ],
    list: [
      'Account details: your name and email address.',
      'Google sign-in details: if you sign in with Google, we receive your name, email address, and profile picture from Google.',
      'Complaint details: the descriptions, categories, and photos you submit when reporting an infrastructure issue.',
      'Basic technical data: server logs such as IP address and request time, used for security and debugging.',
    ],
  },
  {
    id: 'use',
    title: 'How we use your information',
    list: [
      'Create your account and verify your email address.',
      'Let you submit, track, and manage complaints.',
      'Send one-time verification codes and service messages about your account or complaints.',
      'Keep the service secure and fix technical problems.',
    ],
    after: ['We do not use your information for advertising.'],
  },
  {
    id: 'google',
    title: 'Google user data',
    body: [
      `${APP_NAME} uses Google only to verify your email address. We access no other Google data, and we never read your inbox or contacts.`,
      `${APP_NAME} sends verification emails from its own sender account. That account is not connected to yours.`,
      `${APP_NAME}'s use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.`,
    ],
  },
  {
    id: 'sharing',
    title: 'Sharing your information',
    body: [
      'We do not sell your personal data. We share it only in these cases:',
    ],
    list: [
      'With your institution\u2019s administrators and assigned staff, so they can resolve the complaints you submit.',
      'With service providers that run the platform for us, such as hosting, database, and image storage providers. They process data only on our behalf.',
      'When the law requires it.',
    ],
  },
  {
    id: 'retention',
    title: 'How long we keep your data',
    body: [
      'We keep your account and complaint records while your account is active, or as long as your institution needs them to manage infrastructure issues. You can ask us to delete your account at any time, and we will remove your personal data unless we must keep it by law.',
    ],
  },
  {
    id: 'security',
    title: 'Security',
    body: [
      'We protect your data with encrypted connections (HTTPS), hashed passwords, and access controls. No online service is completely secure, so we cannot guarantee absolute security.',
    ],
  },
  {
    id: 'rights',
    title: 'Your choices',
    list: [
      'Ask for a copy of the personal data we hold about you.',
      'Ask us to correct or delete your data.',
      'Revoke Google access at any time at myaccount.google.com/permissions.',
    ],
    after: ['To use any of these, email us at the address below.'],
  },
  {
    id: 'children',
    title: 'Children',
    body: [
      `${APP_NAME} is not intended for children under 13, and we do not knowingly collect their data.`,
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: [
      'If we change this policy, we will update the date at the top of this page. Material changes will also be announced in the app.',
    ],
  },
]

const s = {
  page: {
    background: '#f8fafc',
    minHeight: '100vh',
    padding: 'clamp(24px, 6vw, 64px) clamp(16px, 4vw, 24px)',
    color: '#1f2937',
    fontFamily:
      '"Inter", "Segoe UI", system-ui, -apple-system, Roboto, sans-serif',
  },
  card: {
    maxWidth: 760,
    margin: '0 auto',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: 'clamp(24px, 5vw, 48px)',
  },
  h1: {
    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    margin: 0,
    color: '#0f172a',
  },
  meta: { margin: '8px 0 0', color: '#64748b', fontSize: '0.9rem' },
  summary: {
    margin: '28px 0 0',
    padding: '16px 20px',
    background: '#f1f5f9',
    borderLeft: '3px solid #2563eb',
    borderRadius: '0 8px 8px 0',
    lineHeight: 1.65,
  },
  nav: {
    margin: '28px 0 0',
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px 16px',
    fontSize: '0.9rem',
  },
  link: { color: '#2563eb', textDecoration: 'none' },
  section: {
    marginTop: 36,
    paddingTop: 28,
    borderTop: '1px solid #e2e8f0',
    scrollMarginTop: 16,
  },
  h2: {
    fontSize: '1.2rem',
    margin: '0 0 12px',
    color: '#0f172a',
    letterSpacing: '-0.01em',
  },
  p: { margin: '0 0 12px', lineHeight: 1.75 },
  ul: { margin: '0 0 12px', paddingLeft: 22, lineHeight: 1.75 },
  li: { marginBottom: 6 },
}

function Section({ id, title, body = [], list, after = [] }) {
  const paragraphs = (items) =>
    items.map((t) => (
      <p key={t} style={s.p}>
        {t}
      </p>
    ))

  return (
    <section id={id} style={s.section}>
      <h2 style={s.h2}>{title}</h2>
      {paragraphs(body)}
      {list && (
        <ul style={s.ul}>
          {list.map((item) => (
            <li key={item} style={s.li}>
              {item}
            </li>
          ))}
        </ul>
      )}
      {paragraphs(after)}
    </section>
  )
}

export default function Privacy() {
  return (
    <main style={s.page}>
      <article style={s.card}>
        <h1 style={s.h1}>Privacy Policy</h1>
        <p style={s.meta}>Last updated {LAST_UPDATED}</p>

        <p style={s.summary}>
          {APP_NAME} is an infrastructure complaint management system. This
          policy explains what data we collect, why we collect it, and the
          choices you have. In short: we collect only what we need, and we do
          not sell your data.
        </p>

        <ul style={s.nav}>
          {SECTIONS.map(({ id, title }) => (
            <li key={id}>
              <a href={`#${id}`} style={s.link}>
                {title}
              </a>
            </li>
          ))}
        </ul>

        {SECTIONS.map((sec) => (
          <Section key={sec.id} {...sec} />
        ))}

        <section id="contact" style={s.section}>
          <h2 style={s.h2}>Contact us</h2>
          <p style={s.p}>
            Questions or requests about your data? Email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={s.link}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  )
}