import { motion } from 'framer-motion'

// ── Contact info — edit these values to update your details ─────────────────
const CONTACT = {
  whatsappNumber: '961XXXXXXXX',
  whatsappDisplay: '+961 XX XXX XXX',
  whatsappMessage: 'Hello, I would like to ask about the café and padel court.',
  phone: '+961 71 234 567',
  email: 'hello@oliva.com',
  address: 'Beirut, Lebanon',
  hours: 'Open daily · 9am – 11pm',
  instagram: 'https://instagram.com/oliva.padel',
  instagramDisplay: '@oliva.padel',
}

function ContactItem({
  icon,
  label,
  value,
  href,
  delay,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
  delay: number
}) {
  const content = (
    <motion.div
      className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: 'rgba(74,103,65,0.1)',
          color: '#4a6741',
        }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-base font-medium text-stone-800 break-words">{value}</p>
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }
  return content
}

export default function ContactSection() {
  const waHref = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(CONTACT.whatsappMessage)}`

  return (
    <section id="contact" className="py-20 sm:py-32 bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-sm font-semibold text-olive-600 tracking-[0.3em] uppercase mb-3">
            General Enquiries
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 leading-tight">
            GET IN TOUCH WITH OUR TEAM
          </h2>
          <div className="w-16 h-1 bg-olive-600 rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <ContactItem
            label="WhatsApp"
            value={CONTACT.whatsappDisplay}
            href={waHref}
            delay={0}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.89-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            }
          />
          <ContactItem
            label="Phone"
            value={CONTACT.phone}
            href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
            delay={0.08}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            }
          />
          <ContactItem
            label="Email"
            value={CONTACT.email}
            href={`mailto:${CONTACT.email}`}
            delay={0.16}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 5L2 7" />
              </svg>
            }
          />
          <ContactItem
            label="Location"
            value={CONTACT.address}
            delay={0.24}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          />
          <ContactItem
            label="Opening Hours"
            value={CONTACT.hours}
            delay={0.32}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            }
          />
          <ContactItem
            label="Instagram"
            value={CONTACT.instagramDisplay}
            href={CONTACT.instagram}
            delay={0.40}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  )
}
