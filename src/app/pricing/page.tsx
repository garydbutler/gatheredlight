import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'For a single tribute',
    features: [
      '1 tribute',
      'Up to 5 contributors',
      '50 memories',
      'Memory wall',
      'Invite by code',
    ],
    cta: 'Get Started',
    href: '/auth?mode=signup',
    featured: false,
  },
  {
    name: 'Family',
    price: '$9',
    period: '/month',
    desc: 'For preserving family history',
    features: [
      'Up to 5 tributes',
      'Unlimited contributors',
      'Unlimited memories',
      'Ken Burns slideshow',
      'Photo albums',
      'Download & export',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    href: '/auth?mode=signup&plan=family',
    featured: true,
  },
  {
    name: 'Legacy',
    price: '$29',
    period: '/month',
    desc: 'For organizations & communities',
    features: [
      'Unlimited tributes',
      'Unlimited everything',
      'AI memory prompts',
      'Custom themes & branding',
      'Printed memorial book (add-on)',
      'Video tributes',
      'API access',
      'Dedicated support',
    ],
    cta: 'Contact Us',
    href: '/auth?mode=signup&plan=legacy',
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="font-serif text-2xl text-earth-800 tracking-tight">
          Gathered<span className="text-amber-500">Light</span>
        </Link>
        <Link href="/auth" className="btn-primary text-sm">Get Started</Link>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-earth-800 mb-4">
            Simple, gentle pricing
          </h1>
          <p className="text-xl text-earth-500 max-w-2xl mx-auto">
            Start free. Upgrade when you need more space for memories.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card p-8 flex flex-col ${
                plan.featured ? 'ring-2 ring-amber-400 shadow-lg scale-105' : ''
              }`}
            >
              {plan.featured && (
                <span className="badge-amber text-xs self-start mb-4">Most Popular</span>
              )}
              <h3 className="text-2xl font-serif text-earth-800">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2 mb-2">
                <span className="text-4xl font-bold text-earth-800">{plan.price}</span>
                <span className="text-earth-500">{plan.period}</span>
              </div>
              <p className="text-earth-500 text-sm mb-6">{plan.desc}</p>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-earth-600">
                    <svg className="w-5 h-5 text-sage-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={plan.featured ? 'btn-primary text-center' : 'btn-secondary text-center'}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 text-earth-500">
          <p>All plans include a 14-day free trial. No credit card required to start.</p>
        </div>
      </main>

      <footer className="border-t border-cream-200 py-8 text-center text-earth-400 text-sm">
        <p>GatheredLight &mdash; With love, for those we carry with us.</p>
      </footer>
    </div>
  );
}
