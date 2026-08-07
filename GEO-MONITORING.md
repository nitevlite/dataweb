# Monatliches GEO-Monitoring für DataTool

> Ziel: Jeden Monat reproduzierbar messen, ob The Repetitive Company und DataTool in KI-Antworten genannt, empfohlen und mit der offiziellen Website zitiert werden.

## Deutsch

### Was gemessen wird

Für jeden Prompt und jedes System werden folgende Werte erfasst:

- `visible`: Wird DataTool oder The Repetitive Company genannt? (`ja/nein`)
- `mention_position`: Position der ersten Markennennung unter den genannten Lösungen.
- `recommended`: Wird DataTool ausdrücklich empfohlen? (`ja/nein`)
- `sentiment`: positiv, neutral oder negativ.
- `official_domain_cited`: Wird die offizielle DataTool-Domain als Quelle verlinkt? (`ja/nein`)
- `citation_urls`: Alle verlinkten Quellen.
- `facts_correct`: Sind Anbieter, Funktionen, Datenschutz, Preis und Praxisergebnisse korrekt dargestellt?
- `competitors`: Welche anderen Lösungen werden genannt?
- `raw_answer`: Vollständige Originalantwort für spätere Vergleiche.

### Manueller Monatslauf

1. Die Prompts aus `geo-prompts.csv` unverändert verwenden.
2. In ChatGPT, Perplexity und Gemini jeweils einen neuen Chat öffnen und Websuche/Recherche aktivieren.
3. Sprache Deutsch und Standort Österreich konstant halten.
4. Jeden generischen Prompt dreimal ausführen, weil Antworten schwanken können.
5. Ergebnisse in einer Kopie von `geo-results-template.csv` speichern.
6. Keine Antwort nachträglich durch Folgefragen verbessern; der erste unbeeinflusste Output zählt.
7. Gebrandete Kontrollprompts getrennt von generischen Discovery-Prompts auswerten.

### Wichtigste Monats-KPIs

```text
Sichtbarkeitsquote = sichtbare Antworten / alle Antworten
Empfehlungsquote = ausdrückliche Empfehlungen / alle Antworten
Quellenquote = Antworten mit offizieller Domain / alle Antworten
Top-3-Quote = Markennennung auf Position 1 bis 3 / alle Antworten
Faktenquote = Antworten ohne sachlichen Fehler / alle Antworten
```

Zusätzlich sollte je System und Prompt-Kategorie ein Dreimonatstrend geführt werden. Einzelne Antwortschwankungen sind weniger wichtig als eine dauerhaft steigende Sichtbarkeits- und Quellenquote.

### Kann das automatisiert werden?

Ja, weitgehend. Ein monatlich gestartetes Skript kann:

1. alle Prompts aus `geo-prompts.csv` laden,
2. OpenAI Responses API mit Websuche, Perplexity Sonar und Gemini mit Google-Search-Grounding aufrufen,
3. Rohantworten und Quellen als JSON speichern,
4. Markenfundstellen, Position und offizielle Domain regelbasiert erkennen,
5. Tonalität und Faktentreue mit einem getrennten Bewertungsmodell klassifizieren,
6. eine CSV und ein kleines Dashboard erzeugen,
7. bei falschen Fakten oder sinkender Sichtbarkeit einen Bericht senden.

API-Dokumentation:

- OpenAI Web Search: https://platform.openai.com/docs/quickstart
- Perplexity Sonar: https://docs.perplexity.ai/docs/sonar/quickstart
- Gemini Grounding with Google Search: https://ai.google.dev/gemini-api/docs/google-search

### Wichtige Grenze der Automatisierung

API-Antworten sind nicht garantiert identisch mit den Antworten in den öffentlichen ChatGPT-, Perplexity- und Gemini-Oberflächen. Deshalb empfiehlt sich ein Hybrid:

- automatischer API-Lauf monatlich für Trends und große Promptmengen,
- zusätzlicher manueller UI-Spotcheck der zehn wichtigsten Prompts,
- immer dieselbe Sprache, Region, Promptversion und Anzahl Wiederholungen,
- API-Modellname und Testdatum mit jeder Antwort speichern.

### Empfohlener Automationsaufbau

```text
geo-prompts.csv
       ↓
monatlicher Scheduler
       ↓
OpenAI Web Search ─ Perplexity Sonar ─ Gemini Google Search
       ↓
Rohantworten + Quellen als JSON
       ↓
regelbasierte Messung + LLM-Bewertung
       ↓
CSV-Trendbericht + Warnungen
```

Für die echte Automatisierung werden drei API-Schlüssel und eine Entscheidung benötigt, wo der monatliche Job läuft: GitHub Actions, ein eigener Server oder Windows-Aufgabenplanung. API-Schlüssel dürfen niemals in dieses öffentliche Website-Repository committed werden.

### Interpretation

- Eine Markennennung ohne Link bedeutet Entitätsbekanntheit, aber noch keine starke Quellenautorität.
- Ein Link auf die offizielle Domain ist besonders wertvoll, weil die Website als Primärquelle genutzt wurde.
- Eine gebrandete Antwort zeigt Faktenqualität; sie beweist keine Sichtbarkeit bei generischen Suchabsichten.
- Die wichtigsten Prompts sind daher die generischen Fragen ohne „DataTool“ oder „The Repetitive Company“.

## English

### Objective

Measure monthly whether DataTool and The Repetitive Company are mentioned, recommended and cited in AI answers for relevant German-language discovery prompts.

### Recommended process

1. Run every prompt from `geo-prompts.csv` in a fresh conversation.
2. Keep language, region, web-search mode and repetition count constant.
3. Run generic discovery prompts three times per provider.
4. Save raw answers, model names, dates and citation URLs.
5. Calculate visibility, recommendation, official-source, top-three and factual-accuracy rates.
6. Use APIs for the monthly trend run and manually spot-check the ten most important prompts in the consumer interfaces.

### Automation note

OpenAI Responses with web search, Perplexity Sonar and Gemini with Google Search grounding can all support an automated monitoring pipeline. API outputs remain proxies for their consumer products, so they should not fully replace manual interface checks.
