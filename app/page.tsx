import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Temporary Header */}
      <header className="sticky top-0 z-50 bg-white shadow-navbar">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-2xl font-bold text-primary-black">
            Fliegercamp
          </div>
          <nav className="flex gap-6">
            <Link
              href="/flugplaetze"
              className="text-sm text-primary-black hover:text-neutral-gray-700"
            >
              Flugplätze
            </Link>
            <Link
              href="/login"
              className="text-sm text-primary-black hover:text-neutral-gray-700"
            >
              Anmelden
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-6">Finde deinen perfekten Flugplatz</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Organisiere unvergessliche Fluglager mit der führenden
            Buchungsplattform für Segelflugvereine.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/flugplaetze"
              className="rounded-lg bg-accent-yellow px-8 py-3 font-semibold text-primary-black transition-all hover:bg-accent-yellowHover hover:-translate-y-0.5"
            >
              Flugplätze entdecken
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-neutral-gray-100 bg-white px-8 py-3 font-semibold transition-all hover:bg-neutral-background"
            >
              Jetzt registrieren
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center">Warum Fliegercamp?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border border-neutral-gray-100 bg-white p-6 shadow-section">
                <h3 className="mb-4">🏔️ Flugplätze finden</h3>
                <p>
                  Durchsuche hunderte Flugplätze und finde den perfekten Ort
                  für dein nächstes Fluglager.
                </p>
              </div>
              <div className="rounded-lg border border-neutral-gray-100 bg-white p-6 shadow-section">
                <h3 className="mb-4">📅 Einfach buchen</h3>
                <p>
                  Stelle Anfragen, verwalte Teilnehmer und Flugzeuge - alles an
                  einem Ort.
                </p>
              </div>
              <div className="rounded-lg border border-neutral-gray-100 bg-white p-6 shadow-section">
                <h3 className="mb-4">💬 Direkt kommunizieren</h3>
                <p>
                  Bleibe mit Flugplatzverwaltern in Kontakt und kläre alle
                  Details.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-gray-900 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-neutral-gray-300">
            © 2025 Fliegercamp. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}
