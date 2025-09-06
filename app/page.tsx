export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <section id="about" className="min-h-screen flex items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Willkommen</h1>
          <p className="text-muted-foreground">
            Dies ist eine leere Seite zum Testen des Layouts.
          </p>
        </div>
      </section>
      
      <section id="projects" className="min-h-screen flex items-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Projekte</h2>
          <p className="text-muted-foreground">Platzhalter für Projekte</p>
        </div>
      </section>
      
      <section id="experience" className="min-h-screen flex items-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Erfahrung</h2>
          <p className="text-muted-foreground">Platzhalter für Erfahrung</p>
        </div>
      </section>
      
      <section id="contact" className="min-h-screen flex items-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Kontakt</h2>
          <p className="text-muted-foreground">Platzhalter für Kontakt</p>
        </div>
      </section>
    </div>
  );
}
