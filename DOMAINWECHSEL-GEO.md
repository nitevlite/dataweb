# Domainwechsel: GEO- und SEO-Übergabe

> Zielgruppe: Die Person, die diese GitHub-Pages-Website auf die neue Domain umstellt. Ziel ist, bestehende Sichtbarkeit zu erhalten und die Auffindbarkeit in Google, ChatGPT, Perplexity, Gemini und Claude zu maximieren.

## Deutsch

### Vor dem Start

- Die endgültige Hauptdomain festlegen, zum Beispiel `https://www.example.com/`.
- Genau eine bevorzugte Variante bestimmen: `www` oder Domain ohne `www`.
- Die Domain im GitHub-Konto verifizieren und anschließend unter **Repository → Settings → Pages → Custom domain** eintragen.
- Erst danach die DNS-Einträge beim Domainanbieter setzen. Keine Wildcard-DNS-Einträge verwenden.
- Bei einer `www`-Domain einen `CNAME` direkt auf `nitevlite.github.io` setzen, nicht auf `nitevlite.github.io/dataweb`.
- Bei einer Apex-Domain die aktuellen, von GitHub dokumentierten `A`/`AAAA`- oder `ALIAS`/`ANAME`-Werte verwenden.
- Nach erfolgreicher Zertifikatsausstellung **Enforce HTTPS** aktivieren.

Offizielle Anleitung: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

### Dateien, die zwingend angepasst werden müssen

In allen folgenden Stellen `https://nitevlite.github.io/dataweb/` durch die neue kanonische Domain ersetzen:

1. `sitemap.xml`: jede `<loc>`-URL.
2. `robots.txt`: die absolute `Sitemap:`-URL.
3. `datatool.html`: bestehendes Canonical austauschen oder die Weiterleitungsseite entfernen, falls sie nicht mehr benötigt wird.
4. Alle neu ergänzten Canonical-, Open-Graph- oder JSON-LD-URLs.
5. Externe Unternehmensprofile und Verzeichniseinträge.

Die KI-Kurzversion in `site.js` erzeugt die Produkt-URL zur Laufzeit aus der aktuell geöffneten Domain und benötigt deshalb keine feste Domainänderung.

Sobald die neue Unternehmens-E-Mail-Adresse existiert, die bisherige Gmail-Adresse konsistent ersetzen in:

- `index.html` im `Organization`-JSON-LD,
- `llms.txt`,
- `impressum.html`,
- `datenschutz.html` und `agb.html`, sofern dort Kontaktangaben stehen,
- allen `mailto:`-Links und externen Unternehmensprofilen.

`llms.txt` und `llm.txt` verwenden bewusst relative Links und benötigen beim Domainwechsel keine Anpassung.

### Canonicals nach dem Wechsel

Jede indexierbare HTML-Seite benötigt eine absolute, selbstreferenzierende Canonical-URL:

```html
<link rel="canonical" href="https://NEUE-DOMAIN.TLD/pdf-toolkit.html" />
```

Zu pflegen sind mindestens:

- `/`
- `/pdf-toolkit.html`
- `/eckensetzer.html`
- `/demo/`
- `/impressum.html`
- `/datenschutz.html`
- `/agb.html`

`datatool.html` leitet aktuell auf `/demo/?step=1` weiter und darf nicht als eigenständige Inhaltsseite indexiert werden. Canonical-Ziel und Weiterleitung müssen dasselbe endgültige Ziel ausdrücken.

### Markenregel für KI-Systeme

- Auf Produkt-, Marketing-, Metadaten-, Schema.org- und LLM-Seiten immer **The Repetitive Company** als Anbieter/Marke verwenden.
- Den rechtlichen Firmennamen nur dort verwenden, wo er gesetzlich erforderlich ist, vor allem im Impressum, in Datenschutzinformationen, AGB und Rechnungs-/Vertragsangaben.
- Produktnamen immer identisch schreiben: **DataTool**, **PDF Toolkit**, **Eckensetzer**.

### Unmittelbar nach dem DNS-Wechsel

- Prüfen, dass HTTP auf HTTPS weiterleitet.
- Prüfen, dass nicht bevorzugte `www`-/Apex-Variante auf die Hauptdomain weiterleitet.
- Kontrollieren, dass alte GitHub-Pages-URLs auf der Custom Domain landen und keine Inhaltsduplikate entstehen.
- Alle Seiten, CSS-/JS-Dateien und Bilder auf Mixed Content und 404-Fehler prüfen.
- `https://NEUE-DOMAIN.TLD/robots.txt`, `/sitemap.xml`, `/llms.txt` und `/llm.txt` direkt im Browser öffnen.
- Sitemap in Google Search Console und Bing Webmaster Tools einreichen.
- Wichtige Seiten in beiden Tools zur erneuten Indexierung anstoßen.
- Domain und Sitemap in Analytics sowie im monatlichen GEO-Monitoring aktualisieren.

### Kopierbare Prüfkommandos unter PowerShell

```powershell
$geoDomain = 'https://NEUE-DOMAIN.TLD'
curl.exe -I "$geoDomain/"
curl.exe -I "$geoDomain/pdf-toolkit.html"
curl.exe -I "$geoDomain/robots.txt"
curl.exe -I "$geoDomain/sitemap.xml"
curl.exe -I "$geoDomain/llms.txt"
Resolve-DnsName 'NEUE-DOMAIN.TLD'
```

Erwartet werden `200` für die endgültigen URLs, HTTPS ohne Zertifikatswarnung und höchstens eine beabsichtigte Weiterleitung auf die kanonische Domain.

### Abschlussprüfung für GEO

- `robots.txt` erlaubt `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User`, `Google-Extended` und allgemeine Suchmaschinen-Crawler.
- Firewall/CDN/Bot-Schutz liefert den erlaubten Bots keine `403`- oder CAPTCHA-Seite.
- `sitemap.xml` enthält ausschließlich erreichbare kanonische URLs der neuen Domain.
- Sichtbare FAQ-Texte und `FAQPage`-JSON-LD stimmen wortgleich inhaltlich überein.
- DataTool wird in Seitentext, Metadaten, strukturierten Daten und `llms.txt` konsistent The Repetitive Company zugeordnet.

### Übergabehinweis: GEO-Monitoring automatisieren

Nach dem Domainwechsel soll das monatliche GEO-Monitoring nach Möglichkeit automatisiert werden. Die vorbereiteten Dateien liegen bereits im Projekt:

- `GEO-MONITORING.md`: Messkonzept, KPIs und Automationsablauf.
- `geo-prompts.csv`: feste generische und gebrandete Testprompts.
- `geo-results-template.csv`: einheitliches Ergebnisschema.

Für die Umsetzung werden API-Zugänge für OpenAI, Perplexity und Gemini sowie ein monatlicher Scheduler benötigt. Empfohlen ist ein GitHub-Actions-Workflow oder ein kleiner geplanter Serverjob, der:

1. jeden Prompt je Anbieter dreimal mit aktivierter Websuche ausführt,
2. Rohantwort, Modellname, Datum und Quellen-URLs speichert,
3. Markennennung, Position, Empfehlung und offizielle Domain automatisch erkennt,
4. Faktentreue und Tonalität getrennt bewertet,
5. die Monatswerte als CSV-Bericht archiviert,
6. bei falschen Fakten oder sinkender Sichtbarkeit eine Warnung erzeugt.

Wichtig: API-Antworten sind nicht garantiert identisch mit den öffentlichen Chat-Oberflächen. Zusätzlich sollen monatlich die zehn wichtigsten Prompts manuell in ChatGPT, Perplexity und Gemini geprüft werden. API-Schlüssel ausschließlich als verschlüsselte Repository-Secrets oder Server-Umgebungsvariablen speichern und niemals in dieses öffentliche Repository schreiben.

## English

### Objective

Move the GitHub Pages site to one canonical custom domain without losing discovery signals, while maximizing visibility in search engines and AI answer systems.

### Required migration steps

1. Choose one canonical HTTPS hostname (`www` or apex).
2. Verify the domain in GitHub, then add it under **Repository → Settings → Pages → Custom domain** before changing DNS.
3. Configure DNS using GitHub's current official values. A `www` CNAME must point directly to `nitevlite.github.io`, without `/dataweb`.
4. Enable **Enforce HTTPS** after certificate provisioning succeeds.
5. Replace every old GitHub Pages URL in `sitemap.xml`, `robots.txt`, canonicals, Open Graph metadata, JSON-LD and external profiles.
6. Keep `llms.txt` and `llm.txt` unchanged because their internal links are relative.
7. Submit the new sitemap in Google Search Console and Bing Webmaster Tools and request reindexing for the primary pages.
8. Confirm that the old GitHub Pages URLs do not remain as separately indexable duplicates.
9. Replace the temporary Gmail contact consistently in JSON-LD, `llms.txt`, legal pages, `mailto:` links and external profiles once the new domain email is active.

### Brand rule

Use **The Repetitive Company** in product content, metadata, structured data and LLM-facing files. Use the registered legal entity name only where legally required.

### Completion criteria

- One HTTPS canonical hostname.
- All canonical URLs and sitemap entries use the new domain.
- `/robots.txt`, `/sitemap.xml`, `/llms.txt` and all primary pages return HTTP 200.
- AI search crawlers are not blocked by robots rules, firewall rules, bot protection or CAPTCHAs.
- No mixed content, broken internal links or old-domain structured-data URLs remain.

### GEO monitoring automation hand-off

After migration, automate the prepared prompt set using web-grounded OpenAI, Perplexity and Gemini API calls on a monthly schedule. Store raw answers, citations, model versions and calculated visibility metrics. Keep API keys in encrypted secrets and retain a manual monthly spot-check of the ten most important prompts because API responses are not guaranteed to match the consumer chat interfaces.
