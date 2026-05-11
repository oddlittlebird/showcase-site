import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface SocialCardProps {
  href: string;
  label: string;
  icon: ReactNode;
  description: string;
}

function SocialCard({href, label, icon, description}: SocialCardProps) {
  return (
    <Link href={href} className={styles.card} target="_blank" rel="noopener noreferrer">
      <div className={styles.icon}>{icon}</div>
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.description}>{description}</span>
      </div>
    </Link>
  );
}

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="#0A66C2" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="#FF0000" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const CalendlyIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" fill="#006BFF" aria-hidden="true">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2z"/>
    <path d="M7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zM7 15h2v2H7zm4 0h2v2h-2z"/>
  </svg>
);

export default function SocialCards() {
  return (
    <div className={styles.grid}>
      <SocialCard
        href="https://www.linkedin.com/in/dianapayton/"
        label="LinkedIn"
        icon={<LinkedInIcon />}
        description="Connect professionally"
      />
      <SocialCard
        href="https://www.youtube.com/channel/UCdzER3fTHLN8mseLA_wtntg/"
        label="Technical Writing Uncensored"
        icon={<YouTubeIcon />}
        description="Watch on YouTube"
      />
      <SocialCard
        href="https://calendly.com/dfhauer/30min"
        label="Book a call"
        icon={<CalendlyIcon />}
        description="Schedule 30 minutes"
      />
    </div>
  );
}
