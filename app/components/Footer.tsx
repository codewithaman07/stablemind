import Link from 'next/link';
import { FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="py-16 border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{ background: 'var(--accent-primary)' }}>
                <Logo size={15} />
              </div>
              <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                StableMind
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Your companion for navigating the challenges of placement season with confidence and mental wellness.
            </p>
            <div className="flex gap-3">
              {[FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center transition-all" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-surface)'; e.currentTarget.style.color = 'var(--accent-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}>
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Features",
              links: [
                { label: "AI Chat Support", href: "/dashboard" },
                { label: "Wellness Tools", href: "/wellness" },
                { label: "Mood Tracker", href: "/mood" },
                { label: "Daily Affirmations", href: "/affirmations" },
              ]
            },
            {
              title: "Resources",
              links: [
                { label: "Placement Tips", href: "/dashboard" },
                { label: "Interview Guides", href: "/dashboard" },
                { label: "Wellness Resources", href: "/wellness" },
                { label: "Affirmations", href: "/affirmations" },
              ]
            },
            {
              title: "Get Help",
              links: [
                { label: "Chat Support", href: "/dashboard" },
                { label: "Wellness Tools", href: "/wellness" },
                { label: "FAQ", href: "/dashboard" },
                { label: "Privacy Policy", href: "/" },
              ]
            }
          ].map((section, i) => (
            <div key={i} className="col-span-1">
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className="text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center" style={{ borderColor: 'var(--border-primary)' }}>
          <p className="text-sm mb-4 md:mb-0" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} StableMind. All rights reserved.
          </p>
          <p className="flex items-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Made with <FaHeart className="mx-1" style={{ color: 'var(--red-accent)' }} size={12} /> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
