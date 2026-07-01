# Plan: Autentisering og autorisering for temasider (frontend)

Denne planen beskriver det **gjenstående** arbeidet med innlogging (autentisering)
og tilgangsstyring (autorisering) for temasider i **fagord** – React Router-appen.

Selve sikkerhetsgrensen – **fagord-rust-api** – er i hovedsak ferdig: magic-kode-flyt,
sesjoner (utstedelse + invalidering) og eier/admin-håndheving på artikkel-skriving er
bygd. Fasiten for backend er `CLAUDE.md` og `AUTH_PLAN.md` i det repoet; de gjentas
ikke her. Dette dokumentet handler om hva **appen** må gjøre for å ta backend i bruk.

> Kontekst: Fagord er en React Router 7-app (SSR) som er en tynn klient mot Rust-API-et.
> API-et eier alle data og er den reelle sikkerhetsgrensen – frontend-sjekker er kun for
> UX (skjule knapper, pene feilmeldinger) og kan omgås ved å kalle API-et direkte.

---

## Mål

- Brukere skal kunne **opprette** temasider.
- Kun **opprinnelig forfatter** eller en **admin** skal kunne **endre/slette** en temaside.
- Ingen passord – innlogging skjer med **engangskode** (magic-flyt).
- Brukere legges inn **manuelt** (ingen registreringsskjema foreløpig).
- Ingen ekstern auth-tjeneste – alt løses lokalt i API-et + appen.

---

## Status (per 2026-07-01)

**Backend (fagord-rust-api) – ferdig:**

- ✅ **Datamodell:** `contributor`, `article`, `magic_tokens` og `session` med
  migrasjoner og den gjenbrukbare `set_updated_at()`-triggeren.
- ✅ **Magic-kode-flyt:** `POST /auth/magic` (svarer alltid `202`), `POST /auth/verify`
  (oppretter sesjon, returnerer `session_token` + `expires_at` + rolle),
  `POST /auth/logout` (sletter sesjonsraden, idempotent).
- ✅ **Sesjoner:** eget sesjonstoken (256-bit, kun hash lagret), invaliderbart ved utlogging.
- ✅ **Skrive-endepunkter med håndheving:** `POST /articles` (krever innlogging),
  `PATCH`/`DELETE /articles/{slug}` (krever eier ELLER admin) via
  `AuthenticatedContributor`-extractoren i Rust.

**Frontend (fagord) – gjenstår:**

- ✅ **Lese-visning:** `temasider._index.tsx` (liste) og `temasider.$slug.tsx` (enkeltside).
- ⬜ **Sesjonslagring i React Router** – `createCookieSessionStorage`.
- ⬜ **Innloggings-/utloggingsflyt** i UI-et.
- ⬜ **`krevInnlogget`-hjelper** for loaders/actions.
- ⬜ **Skrive-flyt koblet til API-et** – `temasider.ny.tsx` er i dag kun en
  Markdown-forhåndsvisning («Ingenting lagres ennå»); den må sende `POST /articles`
  med sesjonstokenet. Deretter endre/slett.

---

## Arkitektur og ansvarsfordeling

Den reelle sikkerhetsgrensen er **Rust-API-et**, fordi det eier dataene og er direkte
tilgjengelig. Frontend-sjekker er kun for UX – de kan omgås ved å kalle API-et direkte.

```
                       REACT ROUTER (Node)              RUST-API (ferdig)
Logg inn:      skjema → action  ──POST /auth/magic──>  lag token, hash+lagre, logg kode
Verifiser:     kode ─────────────POST /auth/verify──>  sjekk hash/utløp/forbruk, lag sesjon
               ← sett signert sesjons-cookie ───────   ← session_token + expires_at + rolle
Opprett side:  action ─POST /articles (Bearer)──────>  håndhev: er du innlogget?
Endre/slett:   action ─PATCH/DELETE (Bearer)────────>  håndhev: eier ELLER admin?
Logg ut:       action ─POST /auth/logout (Bearer)───>  slett sesjonsraden
```

**Hvordan appen beviser hvem den handler på vegne av:** API-et utsteder et sesjonstoken
ved `/auth/verify`. Appen lagrer det i den signerte cookien og sender det tilbake som
`Authorization: Bearer <token>` på hvert skrivekall. Da holder API-et all sannhet –
autorisasjonsregelen «eier ELLER admin» håndheves i Rust, ikke i React Router-action-en.

---

## Sesjon i React Router

Dette er kjernen i det gjenstående arbeidet:

- **`createCookieSessionStorage`** for å lagre sesjonstokenet i en **signert, `HttpOnly`,
  `Secure`, `SameSite=Lax`** cookie. Cookien er `HttpOnly` fordi det er React
  Router-serveren (Node), ikke nettleseren, som leser den.
- En **`krevInnlogget`-hjelper** for loaders/actions som leser cookien, henter
  sesjonstokenet og videresender det på skrivekall (`Authorization: Bearer …`).
- **Innloggings- og utloggingsflyt** i UI-et (kode tastes inn *inne i appen* – se under).

### Vis innlogget brukers navn/e-post

Når brukeren er innlogget, skal appen kunne vise eget navn og/eller e-post. Planlagt
løsning: utvid `/auth/verify`-svaret med `name` og `email` (ved siden av rollen, som
allerede returneres) – dette er en liten **backend-endring som gjenstår**. React Router
lagrer dem i den **signerte** sesjons-cookien sammen med sesjonstokenet – én cookie er
bare én signert JSON-streng, så flere felter får plass. Serveren leser dem ut og gir dem
til komponentene som loader-data. Ingen ekstra API-kall per sidelast.

Disse feltene er kun display-cache uten autoritet: den ekte autorisasjonen skjer fortsatt
ved at Rust slår sesjonstokenet opp mot DB på hvert skrivekall (fersk rolle). Stale
`name`/`role` i cookien kan derfor kun skjule/vise en knapp, aldri omgå håndhevingen.
`name`/`email` endres i praksis ikke uten re-innlogging, så foreldede data er akseptabelt.

Et eget `GET /me`-endepunkt utsettes til profilredigering (`avatar_url`) gjør brukerdata
foranderlig – da blir en frisk kilde verdt rundturen. Til da er det YAGNI.

> **Vurdert og forkastet:** å gjøre cookien til et selvstendig JWT/PASETO der payloaden
> *er* sannheten. Det ville frata oss invaliderbarheten (et signert token er gyldig til
> utløp uansett utlogging). Den signerte cookien fra `createCookieSessionStorage` med et
> DB-oppslag i Rust gir samme sikkerhet med mindre maskineri.

---

## Innlogging: kode framfor ren lenke

Fagord er en installerbar PWA (`display: standalone` i `public/manifest.json`). En
hjem-skjerm-lagret PWA kjører i sin **egen, isolerte lagringskontekst** (særlig på iOS).
En magic link åpnet fra e-postappen ville sette sesjons-cookien i *nettleserens* krukke –
ikke appens – så brukeren forblir utlogget i appen.

**Løsning:** bruk en **engangskode** (f.eks. `ABC-123`) som brukeren skriver inn *inne i
appen der de allerede står*. Pakk samme kode inn i en klikkbar lenke i samme e-post
(praktisk på desktop). Da:

- Sesjonen havner garantert i riktig lagringskontekst (brukeren er allerede i appen).
- Fungerer likt på iOS, Android og desktop – ingen plattformspesifikke krumspring.
- Krever ingen Android link-capturing eller iOS deep-linking.

Manifestet er allerede på plass og trenger ingen endring for dette.

---

## E-postutsending (backend, men verdt å kjenne til)

Selve e-posten er den ene biten som ikke kan løses rent lokalt på sikt. I dag logges
koden kun til Rust-serverloggen. Veien videre (i backend), i økende rekkefølge:

1. **Nå (utvikling):** logg kode til serverloggen. ✅ Dette er dagens tilstand.
2. **Ekte e-post senere:** send via SMTP til en e-postkonto du allerede har (arver dens
   rykte/SPF/DKIM), f.eks. med `lettre`-craten. Én konfigurasjonsendring, ikke omskriving.
3. **Ved vekst til ukjente brukere:** flytt til en e-posttjeneste (Resend, Postmark, SES).

For appen betyr dette: under utvikling henter du koden fra Rust-loggen og taster den inn
i innloggingsskjemaet.

---

## Sikkerhetshensyn (frontend-ansvar)

Dekket i backend allerede: kryptografisk uforutsigbare tokens, korttlevde engangskoder,
kun hash lagret, forsøkssperre (`attempts`), og «ikke lekk om e-post finnes»
(`/auth/magic` svarer alltid `202`).

Gjenstår i appen / ved deploy:

| Hensyn | Hvorfor |
|---|---|
| Cookie: signert, `HttpOnly`, `Secure`, `SameSite=Lax` | Hindrer forfalskning, demper XSS og CSRF. Frontend-ansvar. |
| HTTPS i produksjon | Cookies over HTTP kan snappes opp. Sikres ved deploy. |
| Rate limiting (be om / verifisere kode) | Forsøkssperren demper gjetting på én kode, men begrenser ikke volum. Kan legges i API-et eller foran det. |

---

## Utsatt med vilje (egne, senere steg)

- **Profilbilder:** YAGNI nå. Blir én nullable `avatar_url` på `contributor` senere –
  ikke egen tabell, og selve fila lagres aldri i databasen.
- **Bildeopplasting i temasider:** start med **eksterne bilde-URL-er** i Markdown
  (`![alt](https://…)`). Egen opplasting krever en **bucket** (S3-kompatibel
  objektlagring) + en `bilder`-tabell for å kunne rydde foreldreløse filer. Drar med seg
  egen sikkerhetspakke (filtype, størrelse, ondsinnede filer) – håndteres isolert senere.
- **Revisjonshistorikk:** `created_by` + `updated_by` + `updated_at` dekker behovet nå.
  En egen revisjonstabell (wiki-modell med diff/tilbakerulling) er et fint senere steg
  hvis sidene blir samarbeidsdrevne.
- **Sletteforespørsler (GDPR):** `article.created_by` er `RESTRICT`, så en bidragsyter
  med artikler kan ikke slettes uten å håndtere artiklene først. Se `GDPR.md`.

---

## Byggerekkefølge (gjenstående, i fagord)

1. ⬜ **Sesjonslagring** – `createCookieSessionStorage` + `krevInnlogget`-hjelper.
2. ⬜ **Innlogging/utlogging** – skjema som kaller `POST /auth/magic`, deretter
   kode-inntasting som kaller `POST /auth/verify` og lagrer `session_token` i cookien;
   utlogging som kaller `POST /auth/logout` og sletter cookien.
3. ⬜ **Opprett temaside** – koble `temasider.ny.tsx` til `POST /articles` med Bearer-token.
4. ⬜ **Endre/slett temaside** – `PATCH`/`DELETE /articles/{slug}` med Bearer-token; skjul
   knappene for ikke-eiere (kun UX – håndhevingen ligger i Rust).
5. ⬜ **Vis navn/e-post** – utvid `/auth/verify`-svaret (backend) og les feltene fra cookien.
