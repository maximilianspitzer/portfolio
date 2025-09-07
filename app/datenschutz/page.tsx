'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function DatenschutzPage() {
  // const dictionary = getDictionary();

  const content = {
    de: {
      title: 'Datenschutzerklärung',
      subtitle: 'Stand: 6. September 2025',
      sections: {
        preambel: {
          title: 'Präambel',
          content: `Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als "Daten" bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung gilt für alle von uns durchgeführten Verarbeitungen personenbezogener Daten, sowohl im Rahmen der Erbringung unserer Leistungen als auch insbesondere auf unseren Webseiten, in mobilen Applikationen sowie innerhalb externer Onlinepräsenzen, wie z. B. unserer Social-Media-Profile (nachfolgend zusammenfassend bezeichnet als "Onlineangebot").

Die verwendeten Begriffe sind nicht geschlechtsspezifisch.`,
        },
        verantwortlicher: {
          title: 'Verantwortlicher',
          content: `Maximilian Spitzer
Stahnsdorfer Str. 81
14482 Potsdam

E-Mail-Adresse: hello@maximilianspitzer.de`,
        },
        uebersicht: {
          title: 'Übersicht der Verarbeitungen',
          content: `Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.

Arten der verarbeiteten Daten:
• Bestandsdaten
• Zahlungsdaten
• Kontaktdaten
• Inhaltsdaten
• Vertragsdaten
• Nutzungsdaten
• Meta-, Kommunikations- und Verfahrensdaten
• Protokolldaten

Kategorien betroffener Personen:
• Leistungsempfänger und Auftraggeber
• Interessenten
• Kommunikationspartner
• Nutzer
• Geschäfts- und Vertragspartner

Zwecke der Verarbeitung:
• Erbringung vertraglicher Leistungen und Erfüllung vertraglicher Pflichten
• Kommunikation
• Sicherheitsmaßnahmen
• Reichweitenmessung
• Büro- und Organisationsverfahren
• Organisations- und Verwaltungsverfahren
• Profile mit nutzerbezogenen Informationen
• Bereitstellung unseres Onlineangebotes und Nutzerfreundlichkeit
• Informationstechnische Infrastruktur
• Geschäftsprozesse und betriebswirtschaftliche Verfahren`,
        },
        rechtsgrundlagen: {
          title: 'Maßgebliche Rechtsgrundlagen',
          content: `Maßgebliche Rechtsgrundlagen nach der DSGVO: Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte nehmen Sie zur Kenntnis, dass neben den Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder Sitzland gelten können.

• Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO) - Die betroffene Person hat ihre Einwilligung in die Verarbeitung der sie betreffenden personenbezogenen Daten für einen spezifischen Zweck oder mehrere bestimmte Zwecke gegeben.

• Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO) - Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich.

• Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c) DSGVO) - Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich, der der Verantwortliche unterliegt.

• Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO) - Die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten notwendig.

Nationale Datenschutzregelungen in Deutschland: Zusätzlich zu den Datenschutzregelungen der DSGVO gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu gehört insbesondere das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der Datenverarbeitung (Bundesdatenschutzgesetz – BDSG).`,
        },
        sicherheit: {
          title: 'Sicherheitsmaßnahmen',
          content: `Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmaßes der Bedrohung der Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.

Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit und ihrer Trennung.`,
        },
        datenuebermittlung: {
          title: 'Übermittlung von personenbezogenen Daten',
          content: `Im Rahmen unserer Verarbeitung von personenbezogenen Daten kommt es vor, dass diese an andere Stellen, Unternehmen, rechtlich selbstständige Organisationseinheiten oder Personen übermittelt beziehungsweise ihnen gegenüber offengelegt werden. Zu den Empfängern dieser Daten können z. B. mit IT-Aufgaben beauftragte Dienstleister gehören oder Anbieter von Diensten und Inhalten, die in eine Website eingebunden sind. In solchen Fällen beachten wir die gesetzlichen Vorgaben und schließen insbesondere entsprechende Verträge bzw. Vereinbarungen, die dem Schutz Ihrer Daten dienen, mit den Empfängern Ihrer Daten ab.`,
        },
        internationale_transfers: {
          title: 'Internationale Datentransfers',
          content: `Datenverarbeitung in Drittländern: Sofern wir Daten in ein Drittland (d. h. außerhalb der Europäischen Union (EU) oder des Europäischen Wirtschaftsraums (EWR)) übermitteln oder dies im Rahmen der Nutzung von Diensten Dritter oder der Offenlegung bzw. Übermittlung von Daten an andere Personen, Stellen oder Unternehmen geschieht, erfolgt dies stets im Einklang mit den gesetzlichen Vorgaben.

Für Datenübermittlungen in die USA stützen wir uns vorrangig auf das Data Privacy Framework (DPF), welches durch einen Angemessenheitsbeschluss der EU-Kommission vom 10.07.2023 als sicherer Rechtsrahmen anerkannt wurde.`,
        },
        datenspeicherung: {
          title: 'Allgemeine Informationen zur Datenspeicherung und Löschung',
          content: `Wir löschen personenbezogene Daten, die wir verarbeiten, gemäß den gesetzlichen Bestimmungen, sobald die zugrundeliegenden Einwilligungen widerrufen werden oder keine weiteren rechtlichen Grundlagen für die Verarbeitung bestehen.

Aufbewahrung und Löschung von Daten nach deutschem Recht:
• 10 Jahre - Aufbewahrungsfrist für Bücher und Aufzeichnungen, Jahresabschlüsse, Inventare
• 8 Jahre - Buchungsbelege, wie z. B. Rechnungen und Kostenbelege
• 6 Jahre - Übrige Geschäftsunterlagen
• 3 Jahre - Daten für Gewährleistungs- und Schadensersatzansprüche`,
        },
        rechte: {
          title: 'Rechte der betroffenen Personen',
          content: `Rechte der betroffenen Personen aus der DSGVO: Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu:

• Widerspruchsrecht: Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung Widerspruch einzulegen.

• Widerrufsrecht bei Einwilligungen: Sie haben das Recht, erteilte Einwilligungen jederzeit zu widerrufen.

• Auskunftsrecht: Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden.

• Recht auf Berichtigung: Sie haben das Recht, die Vervollständigung oder Berichtigung Ihrer Daten zu verlangen.

• Recht auf Löschung und Einschränkung der Verarbeitung: Sie haben das Recht, dass Sie betreffende Daten unverzüglich gelöscht werden.

• Recht auf Datenübertragbarkeit: Sie haben das Recht, Ihre Daten in einem strukturierten, maschinenlesbaren Format zu erhalten.

• Beschwerde bei Aufsichtsbehörde: Sie haben das Recht auf Beschwerde bei einer Aufsichtsbehörde.`,
        },
        geschaeftliche_leistungen: {
          title: 'Geschäftliche Leistungen',
          content: `Wir verarbeiten Daten unserer Vertrags- und Geschäftspartner, z. B. Kunden und Interessenten im Rahmen von vertraglichen und vergleichbaren Rechtsverhältnissen sowie damit verbundenen Maßnahmen und im Hinblick auf die Kommunikation mit den Vertragspartnern.

Wir verwenden diese Daten, um unsere vertraglichen Verpflichtungen zu erfüllen. Dazu gehören insbesondere die Pflichten zur Erbringung der vereinbarten Leistungen, etwaige Aktualisierungspflichten und Abhilfe bei Gewährleistungs- und sonstigen Leistungsstörungen.`,
        },
        webhosting: {
          title: 'Bereitstellung des Onlineangebots und Webhosting',
          content: `Wir verarbeiten die Daten der Nutzer, um ihnen unsere Online-Dienste zur Verfügung zu stellen. Zu diesem Zweck verarbeiten wir die IP-Adresse des Nutzers, die notwendig ist, um die Inhalte und Funktionen unserer Online-Dienste an den Browser oder die Applikation des Nutzers zu übermitteln.`,
        },
        cookies: {
          title: 'Einsatz von Cookies',
          content: `Cookies sind kleine Textdateien bzw. sonstige Speichervermerke, die Informationen auf Endgeräten speichern und aus ihnen auslesen. Wir setzen Cookies zu verschiedenen Zwecken und auf Grundlage verschiedener Rechtsgrundlagen ein.

Hinweise zu Rechtsgrundlagen: Auf welcher Rechtsgrundlage wir Ihre personenbezogenen Daten mit Hilfe von Cookies verarbeiten, hängt davon ab, ob wir Sie um eine Einwilligung bitten. Falls ja und Sie in die Nutzung von Cookies einwilligen, ist die Rechtsgrundlage die Einwilligung.`,
        },
        webanalyse: {
          title: 'Webanalyse, Monitoring und Optimierung',
          content: `Die Webanalyse (auch als "Reichweitenmessung" bezeichnet) dient der Auswertung der Besucherströme unseres Onlineangebotes und kann Verhalten, Interessen oder demographische Informationen zu den Besuchern, wie z. B. das Alter oder das Geschlecht, als pseudonyme Werte umfassen.

Mit Hilfe der Reichweitenmessung können wir z. B. erkennen, zu welcher Zeit unser Onlineangebot oder dessen Funktionen oder Inhalte am häufigsten genutzt werden oder zur Wiederverwendung einladen. Ebenso können wir nachvollziehen, welche Bereiche der Optimierung bedürfen.`,
        },
      },
    },
    en: {
      title: 'Privacy Policy',
      subtitle: 'Last updated: September 6, 2025',
      sections: {
        preambel: {
          title: 'Preamble',
          content: `With the following privacy policy, we would like to inform you about the types of your personal data (hereinafter also referred to as "data") that we process, for what purposes and to what extent. The privacy policy applies to all processing of personal data carried out by us, both in the context of providing our services and in particular on our websites, in mobile applications and within external online presences, such as our social media profiles (hereinafter collectively referred to as "online offering").

The terms used are not gender-specific.`,
        },
        verantwortlicher: {
          title: 'Data Controller',
          content: `Maximilian Spitzer
Stahnsdorfer Str. 81
14482 Potsdam
Germany

Email address: hello@maximilianspitzer.de`,
        },
        uebersicht: {
          title: 'Overview of Processing',
          content: `The following overview summarizes the types of data processed and the purposes of their processing and refers to the data subjects.

Types of data processed:
• Master data
• Payment data
• Contact data
• Content data
• Contract data
• Usage data
• Meta, communication and procedural data
• Log data

Categories of data subjects:
• Service recipients and clients
• Interested parties
• Communication partners
• Users
• Business and contractual partners

Purposes of processing:
• Provision of contractual services and fulfillment of contractual obligations
• Communication
• Security measures
• Reach measurement
• Office and organizational procedures
• Organizational and administrative procedures
• Profiles with user-related information
• Provision of our online offering and user-friendliness
• Information technology infrastructure
• Business processes and business procedures`,
        },
        rechtsgrundlagen: {
          title: 'Relevant Legal Bases',
          content: `Relevant legal bases according to GDPR: Below you will receive an overview of the legal bases of the GDPR on which we process personal data. Please note that in addition to the GDPR regulations, national data protection requirements may apply in your or our country of residence.

• Consent (Art. 6 Para. 1 S. 1 lit. a) GDPR) - The data subject has given consent to the processing of personal data concerning them for one or more specific purposes.

• Contract performance and pre-contractual inquiries (Art. 6 Para. 1 S. 1 lit. b) GDPR) - Processing is necessary for the performance of a contract to which the data subject is party or to take steps at the request of the data subject prior to entering into a contract.

• Legal obligation (Art. 6 Para. 1 S. 1 lit. c) GDPR) - Processing is necessary for compliance with a legal obligation to which the controller is subject.

• Legitimate interests (Art. 6 Para. 1 S. 1 lit. f) GDPR) - Processing is necessary for the purposes of legitimate interests pursued by the controller or by a third party.

National data protection regulations in Germany: In addition to the data protection regulations of the GDPR, national data protection regulations apply in Germany, in particular the Federal Data Protection Act (BDSG).`,
        },
        sicherheit: {
          title: 'Security Measures',
          content: `We take appropriate technical and organizational measures in accordance with legal requirements, taking into account the state of the art, implementation costs and the nature, scope, circumstances and purposes of processing as well as the different probabilities of occurrence and the extent of the threat to the rights and freedoms of natural persons, in order to ensure a level of protection appropriate to the risk.

The measures include, in particular, securing the confidentiality, integrity and availability of data by controlling physical and electronic access to the data as well as access, input, disclosure, ensuring availability and separation relating to them.`,
        },
        datenuebermittlung: {
          title: 'Transmission of Personal Data',
          content: `In the course of our processing of personal data, it happens that this data is transmitted to other bodies, companies, legally independent organizational units or persons or disclosed to them. Recipients of this data may include, for example, service providers commissioned with IT tasks or providers of services and content that are integrated into a website. In such cases, we observe the legal requirements and conclude appropriate contracts or agreements that serve to protect your data with the recipients of your data.`,
        },
        internationale_transfers: {
          title: 'International Data Transfers',
          content: `Data processing in third countries: Insofar as we transmit data to a third country (i.e. outside the European Union (EU) or the European Economic Area (EEA)) or this occurs in the context of the use of third-party services or the disclosure or transmission of data to other persons, bodies or companies, this always takes place in accordance with legal requirements.

For data transfers to the USA, we primarily rely on the Data Privacy Framework (DPF), which was recognized as a secure legal framework by an adequacy decision of the EU Commission dated July 10, 2023.`,
        },
        datenspeicherung: {
          title: 'General Information on Data Storage and Deletion',
          content: `We delete personal data that we process in accordance with legal provisions as soon as the underlying consent is revoked or there are no further legal bases for processing.

Storage and deletion of data according to German law:
• 10 years - Retention period for books and records, annual accounts, inventories
• 8 years - Accounting documents, such as invoices and cost receipts
• 6 years - Other business documents
• 3 years - Data for warranty and damage claims`,
        },
        rechte: {
          title: 'Rights of Data Subjects',
          content: `Rights of data subjects under GDPR: As a data subject, you have various rights under the GDPR:

• Right to object: You have the right to object at any time to processing for reasons arising from your particular situation.

• Right to withdraw consent: You have the right to withdraw consent at any time.

• Right of access: You have the right to request confirmation as to whether relevant data is being processed.

• Right to rectification: You have the right to request completion or correction of your data.

• Right to erasure and restriction of processing: You have the right to request that data concerning you be deleted immediately.

• Right to data portability: You have the right to receive your data in a structured, machine-readable format.

• Right to lodge a complaint with a supervisory authority: You have the right to lodge a complaint with a supervisory authority.`,
        },
        geschaeftliche_leistungen: {
          title: 'Business Services',
          content: `We process data of our contractual and business partners, e.g. customers and interested parties, in the context of contractual and comparable legal relationships as well as associated measures and with regard to communication with the contractual partners.

We use this data to fulfill our contractual obligations. This includes, in particular, the obligations to provide the agreed services, any update obligations and remedies for warranty and other performance disruptions.`,
        },
        webhosting: {
          title: 'Provision of Online Services and Web Hosting',
          content: `We process users' data in order to provide them with our online services. For this purpose, we process the user's IP address, which is necessary to transmit the content and functions of our online services to the user's browser or application.`,
        },
        cookies: {
          title: 'Use of Cookies',
          content: `Cookies are small text files or other storage notes that store information on end devices and read it from them. We use cookies for various purposes and on the basis of various legal bases.

Notes on legal bases: The legal basis on which we process your personal data with the help of cookies depends on whether we ask for your consent. If so and you consent to the use of cookies, the legal basis is consent.`,
        },
        webanalyse: {
          title: 'Web Analysis, Monitoring and Optimization',
          content: `Web analysis (also referred to as "reach measurement") serves to evaluate the visitor flows of our online offering and can include behavior, interests or demographic information about visitors, such as age or gender, as pseudonymous values.

With the help of reach measurement, we can recognize, for example, at what time our online offering or its functions or content are used most frequently or invite reuse. We can also understand which areas require optimization.`,
        },
      },
    },
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
            <p className="text-muted-foreground">{pageContent.subtitle}</p>
          </div>

          <div className="space-y-8">
            {Object.entries(pageContent.sections).map(([key, section]) => (
              <div
                key={key}
                className="bg-accent p-6 rounded-lg border border-border"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {section.title}
                </h2>
                <div className="text-muted-foreground whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
