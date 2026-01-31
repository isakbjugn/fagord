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
