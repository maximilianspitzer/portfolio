'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function Impressum() {
  const { dictionary } = useLanguage();

  const content = {
    de: {
      title: 'Impressum',
      subtitle: 'Angaben gemäß § 5 DDG',
      sections: {
        contact: {
          title: 'Kontakt',
          content: `Maximilian Spitzer

Stahnsdorfer Str. 81
14482 Potsdam

Vertreten durch:
Maximilian Spitzer

Kontakt:
Telefon: +49-15736252636
E-Mail: hello@maximilianspitzer.de`
        },
        liability: {
          title: 'Haftungsausschluss',
          subsections: {
            content: {
              title: 'Haftung für Inhalte',
              content: `Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.`
            },
            links: {
              title: 'Haftung für Links',
              content: `Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.`
            },
            copyright: {
              title: 'Urheberrecht',
              content: `Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.`
            },
            privacy: {
              title: 'Datenschutz',
              content: `Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.`
            }
          }
        }
      }
    },
    en: {
      title: 'Legal Notice',
      subtitle: 'Information according to § 5 DDG',
      sections: {
        contact: {
          title: 'Contact',
          content: `Maximilian Spitzer

Stahnsdorfer Str. 81
14482 Potsdam
Germany

Represented by:
Maximilian Spitzer

Contact:
Phone: +49-15736252636
Email: hello@maximilianspitzer.de`
        },
        liability: {
          title: 'Disclaimer',
          subsections: {
            content: {
              title: 'Liability for Content',
              content: `The contents of our pages have been created with the greatest care. However, we cannot guarantee the accuracy, completeness and timeliness of the content. As service providers, we are responsible for our own content on these pages according to general laws in accordance with § 7 Para.1 DDG. According to §§ 8 to 10 DDG, however, we as service providers are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information according to general laws remain unaffected. However, liability in this regard is only possible from the time of knowledge of a specific infringement. Upon becoming aware of corresponding legal violations, we will remove this content immediately.`
            },
            links: {
              title: 'Liability for Links',
              content: `Our offer contains links to external websites of third parties, on whose contents we have no influence. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the contents of the linked pages. The linked pages were checked for possible legal violations at the time of linking. Illegal contents were not recognizable at the time of linking. However, a permanent content control of the linked pages is not reasonable without concrete evidence of a legal violation. Upon becoming aware of legal violations, we will remove such links immediately.`
            },
            copyright: {
              title: 'Copyright',
              content: `The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution and any kind of exploitation outside the limits of copyright require the written consent of the respective author or creator. Downloads and copies of this page are only permitted for private, non-commercial use. Insofar as the content on this page was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please inform us accordingly. Upon becoming aware of legal violations, we will remove such content immediately.`
            },
            privacy: {
              title: 'Data Protection',
              content: `The use of our website is usually possible without providing personal data. Insofar as personal data (for example name, address or email addresses) is collected on our pages, this is always done on a voluntary basis as far as possible. This data will not be passed on to third parties without your express consent.
We point out that data transmission on the Internet (e.g. when communicating by email) can have security gaps. Complete protection of data from access by third parties is not possible.
We hereby expressly object to the use of contact data published within the framework of the imprint obligation by third parties for sending unsolicited advertising and information materials. The operators of the pages expressly reserve the right to take legal action in the event of unsolicited advertising information being sent, for example through spam emails.`
            }
          }
        }
      }
    }
  };

  const { language } = useLanguage();
  const pageContent = content[language];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/" 
              className="text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
            >
              ← {language === 'de' ? 'Zurück zur Startseite' : 'Back to home'}
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {pageContent.title}
            </h1>
            <p className="text-muted-foreground">
              {pageContent.subtitle}
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(pageContent.sections).map(([key, section]) => (
              <div key={key} className="bg-accent p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {section.title}
                </h2>
                {'content' in section ? (
                  <div className="text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {'subsections' in section && Object.entries(section.subsections).map(([subKey, subsection]) => (
                      <div key={subKey}>
                        <h3 className="text-lg font-medium text-foreground mb-3">
                          {subsection.title}
                        </h3>
                        <div className="text-muted-foreground whitespace-pre-line">
                          {subsection.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}