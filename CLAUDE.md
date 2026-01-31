# Fagord

Nettapplikasjon for norsk fagterminologi – søk, visning og registrering av faguttrykk.

## Teknisk stack

- **Rammeverk**: React Router 7 (full-stack med SSR)
- **Språk**: TypeScript
- **Byggverktøy**: Vite
- **Pakkebehandler**: pnpm
- **Styling**: Bootstrap 5 + CSS-moduler
- **Testing**: Vitest + React Testing Library
- **Linting**: oxlint

## Kommandoer

```bash
pnpm dev      # Start utviklingsserver
pnpm build    # Bygg for produksjon
pnpm test     # Kjør tester
pnpm lint     # Kjør linter
```

## Prosjektstruktur

```
app/
├── routes/      # Sider og API-endepunkter
├── lib/         # Gjenbrukbare komponenter og hooks
├── types/       # TypeScript-typer
└── styles/      # CSS-moduler
```

## Hovedruter

- `/termliste` – Hovedside med termliste, filtrering og paginering
- `/term/$termId` – Visning av enkeltterm med varianter
- `/ny-term` – Skjema for å legge til nye termer

## Backend

Applikasjonen kobler til et Rust API via miljøvariabelen `FAGORD_RUST_API_DOMAIN`.

## Språkstøtte

Støtter både bokmål og nynorsk for norske termer og varianter.

## Utviklingsprinsipper

### Læringsprosjekt
Fagord er et læringsprosjekt. Nye løsninger bør implementeres på måter som gir innsikt i webteknologi – forklar gjerne underliggende konsepter og alternativer.

### HTML først
Foretrekk HTML og CSS fremfor JavaScript der det er mulig. Nettleserne har mye innebygd funksjonalitet som ofte er bedre enn JavaScript-løsninger.

### Bevisst bruk av biblioteker
Vurder alltid om et problem kan løses med egen kode før du tar inn et bibliotek. Spør: Er behovet avgrenset nok til at vi kan skrive det selv? Hva lærer vi av hver tilnærming?

### Rammeverk: React Router 7
Prosjektet bruker React Router 7 i framework-modus (tidligere Remix). To prinsipper gjelder:

1. **Bruk rammeverkets verktøy**: Løs problemer med React Routers innebygde funksjoner (f.eks. caching, data-lasting) fremfor eksterne biblioteker.

2. **Unngå innlåsing**: Vær oppmerksom på når noe blir vanskelig på grunn av React Router. Si fra når rammeverket skaper friksjon, slik at vi kan vurdere om det fortsatt er riktig valg.
