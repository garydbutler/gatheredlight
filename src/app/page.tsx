import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="font-serif text-2xl text-earth-800 tracking-tight">
          Gathered<span className="text-amber-500">Light</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="btn-ghost text-sm">Pricing</Link>
          <Link href="/join" className="btn-ghost text-sm">Join a Tribute</Link>
          <Link href="/auth" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-serif text-earth-800 leading-tight mb-6 animate-fade-in">
          Where memories find<br />
          <span className="text-amber-500 italic">their way home</span>
        </h1>
        <p className="text-xl text-earth-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
          Create a beautiful tribute for someone you love. Invite family and friends
          to share their stories, photos, and cherished moments -- all gathered in one place.
        </p>
        <div className="flex items-center justify-center gap-4 animate-slide-up">
          <Link href="/auth?mode=signup" className="btn-primary text-lg px-8 py-4">
            Create a Tribute
          </Link>
          <Link href="/join" className="btn-secondary text-lg px-8 py-4">
            Join with Code
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-cream-50 border-t border-cream-200 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-serif text-earth-800 text-center mb-16">
            A gentle place to remember together
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Gather Memories',
                desc: 'Invite family and friends to contribute photos, stories, and moments. Every voice adds to the tapestry of a life well lived.',
                icon: (
                  <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
              },
              {
                title: 'Memory Wall',
                desc: 'A beautiful mosaic of shared memories. Browse through photos and stories arranged like a treasured scrapbook.',
                icon: (
                  <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                ),
              },
              {
                title: 'Slideshow',
                desc: 'Watch memories come alive with a gentle Ken Burns slideshow -- like sitting together and turning the pages of an album.',
                icon: (
                  <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-2.625 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5c0 .621-.504 1.125-1.125 1.125m1.5 0h12m-12 0c-.621 0-1.125.504-1.125 1.125M18 12H6m12 0c.621 0 1.125-.504 1.125-1.125M18 12c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125M18 12c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125m0 3.75h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125M6 12c-.621 0-1.125-.504-1.125-1.125V9.375c0-.621.504-1.125 1.125-1.125m0 3.75c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M6 12h12" />
                  </svg>
                ),
              },
            ].map((f) => (
              <div key={f.title} className="card p-8 text-center">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  {f.icon}
                </div>
                <h3 className="text-xl font-serif text-earth-800 mb-3">{f.title}</h3>
                <p className="text-earth-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-24 text-center px-6">
        <blockquote className="max-w-2xl mx-auto">
          <p className="text-2xl font-serif italic text-earth-600 leading-relaxed mb-4">
            &ldquo;Every memory shared is a light that never goes out.&rdquo;
          </p>
        </blockquote>
        <div className="mt-12">
          <Link href="/auth?mode=signup" className="btn-primary text-lg px-8 py-4">
            Start a Tribute
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream-200 py-8 text-center text-earth-400 text-sm">
        <p>GatheredLight &mdash; With love, for those we carry with us.</p>
      </footer>
    </div>
  );
}
