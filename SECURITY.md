# Sikkerhetstiltak for CI/CD-pipeline

Dette dokumentet forklarer sikkerhetstiltakene som er implementert for å beskytte mot forsyningskjedeangrep (eng. _supply chain attacks_).

## Implementerte tiltak

### 1. **Deaktivering av npm/pnpm scripts** ✅
- **Fil**: `.npmrc`
- **Tiltak**: `ignore-scripts=true`
- **Beskyttelse mot**: Ondsinnede postinstall/preinstall scripts fra kompromitterte pakker
- **Impact**: Forhindrer automatisk kjøring av kode fra tredjepartspakker under installasjon

### 2. **HTTPS registry** ✅
- **Fil**: `.npmrc`
- **Endring**: `http://` → `https://`
- **Beskyttelse mot**: Man-in-the-middle angrep under pakkenedlasting
- **Impact**: Kryptert kommunikasjon med npm registry

### 3. **Frozen lockfile** ✅
- **Fil**: `.github/workflows/build.yml`
- **Tiltak**: `--frozen-lockfile` flagg
- **Beskyttelse mot**: Uventet endring av dependencies under bygg
- **Impact**: Garanterer at samme versjoner installeres som i pnpm-lock.yaml

### 4. **Minste privilegium (Least Privilege)** ✅
- **Fil**: `.github/workflows/build.yml`
- **Tiltak**: `permissions: contents: read`
- **Beskyttelse mot**: Kompromitterte workflows som kan endre kode eller hemmeligheter
- **Impact**: Begrenser hva workflow kan gjøre i GitHub

### 5. **Oppdaterte GitHub Actions** ✅
- **Fil**: `.github/workflows/build.yml`
- **Endring**: `actions/checkout@v3` → `actions/checkout@v4`
- **Beskyttelse mot**: Kjente sårbarheter i eldre action-versjoner
- **Impact**: Sikrer at vi bruker siste sikkerhetsoppdateringer

### 6. **Linting i CI/CD** ✅
- **Fil**: `.github/workflows/build.yml`
- **Tiltak**: `pnpm lint` som del av pipeline
- **Beskyttelse mot**: Kodekvalitetsproblemer og potensielle sikkerhetshull
- **Impact**: Stopper deployment hvis koden ikke møter kvalitetsstandarder

### 7. **Dependabot** ✅
- **Fil**: `.github/dependabot.yml`
- **Tiltak**: Automatisk oppdatering av dependencies og GitHub Actions
- **Beskyttelse mot**: Kjente sårbarheter i utgåtte pakker
- **Impact**: Automatiske PR-er for sikkerhetsoppdateringer

## Workflow-flyt med sikkerhet

```
1. Code push/PR
   ↓
2. Checkout kode (read-only)
   ↓
3. Install pnpm
   ↓
4. Setup Node med cache
   ↓
5. Install dependencies (UTEN scripts, frozen lockfile, HTTPS)
   ↓
6. Run lint (blokkerer ved feil)
   ↓
7. Run tests (blokkerer ved feil)
   ↓
8. Build (blokkerer ved feil)
   ↓
9. Deploy (kun main branch, kun hvis alt over passerer)
```

## Ytterligere mulige tiltak

### A. **npm audit** i pipeline
Legg til før deploy:
```yaml
- name: Security audit
  run: pnpm audit --audit-level=high
  continue-on-error: true  # Advarsler stopper ikke deploy
```

### B. **SBOM (Software Bill of Materials)**
For større prosjekter, generer SBOM:
```yaml
- name: Generate SBOM
  run: npx @cyclonedx/cyclonedx-npm --output-file sbom.json
```

### C. **Artifact signing**
For kritiske applikasjoner, signer byggartefakter med Sigstore/cosign.

### D. **Renovate som alternativ til Dependabot**
Mer konfigurerbar dependency management.
