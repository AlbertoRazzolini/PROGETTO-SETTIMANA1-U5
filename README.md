# Wandr — Social Network con Post, Mappa e Documenti OCR

Progetto full-stack: post con foto (upload o fotocamera diretta), posizione su mappa tramite POI, e archivio documenti con estrazione testo automatica via OCR.

- **`BE/`** — API REST in Java / Spring Boot
- **`FE/`** — Single Page Application in React / TypeScript

---

## Indice

- [Architettura e stack](#architettura-e-stack)
- [Modello dati](#modello-dati)
- [Endpoint API](#endpoint-api)
- [Avvio del backend](#avvio-del-backend)
- [Avvio del frontend](#avvio-del-frontend)
- [Funzionalità del frontend](#funzionalità-del-frontend)
- [Note e limiti noti](#note-e-limiti-noti)
- [Struttura del repository](#struttura-del-repository)

---

## Architettura e stack

### Backend (`BE/`)

| | |
|---|---|
| Linguaggio | Java 25 |
| Framework | Spring Boot 4.1.1 (Web MVC, Data JPA, Validation, WebSocket) |
| Database | PostgreSQL |
| OCR | Tess4J 5.13.0 (wrapper Java per Tesseract OCR) |
| Build | Maven (wrapper incluso, `mvnw`) |
| Boilerplate | Lombok |

Architettura a livelli classica: `controllers` → `services` → `repositories` → `entities`, con `payloads` (DTO in/out) e `exceptions` per la gestione centralizzata degli errori (`@RestControllerAdvice`).

### Frontend (`FE/`)

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Routing | React Router 7 |
| Mappa | Leaflet 1.9.4 + react-leaflet 5 (tile OpenStreetMap, nessuna API key) |
| Stile | CSS custom (design tokens in `src/index.css`), light/dark automatico |

Nessuna libreria UI esterna: componenti scritti a mano in `src/components/`, pagine in `src/pages/`, layer di accesso API tipizzato in `src/api/`.

---

## Modello dati

```
Post
 ├─ id: UUID
 ├─ titolo: String
 ├─ descrizione: TEXT
 ├─ createdAt: Instant
 └─ poi: POI (opzionale, ManyToOne)

Foto
 ├─ id: UUID
 ├─ contenuto: String   (URL dell'immagine)
 ├─ grandezza: Long     (byte)
 ├─ createdAt: Instant
 └─ post: Post (ManyToOne, obbligatorio)

POI
 ├─ id: UUID
 ├─ latitudine: BigDecimal(8,6)   (indicizzata)
 ├─ longitudine: BigDecimal(9,6)  (indicizzata)
 └─ indirizzo: String (opzionale)

Documento
 ├─ id: UUID
 ├─ titolo: String
 ├─ contenuto: String   (path assoluto del file sul server)
 ├─ testo: TEXT         (estratto via OCR alla creazione)
 ├─ grandezza: Long
 └─ createdAt: Instant
```

## Endpoint API

Base URL: `http://localhost:5174/api`

| Risorsa | Metodo | Path | Note |
|---|---|---|---|
| Post | `POST` | `/posts` | crea post, con POI e foto opzionali inline |
| | `GET` | `/posts` | lista (404 se vuota) |
| | `GET` | `/posts/{id}` | dettaglio |
| | `PATCH` | `/posts/{id}` | modifica parziale |
| | `DELETE` | `/posts/{id}` | elimina (cascata sulle foto) |
| Foto | `POST` | `/fotos` | crea foto legata a un post (`postId` obbligatorio) |
| | `GET` | `/fotos`, `/fotos/{id}` | lista / dettaglio |
| | `PATCH` / `DELETE` | `/fotos/{id}` | modifica / elimina |
| POI | `POST` | `/pois` | crea punto di interesse |
| | `GET` | `/pois`, `/pois/{id}` | lista / dettaglio |
| | `GET` | `/pois/ricquadro` | ricerca per bounding box (`nord,sud,est,ovest`) |
| | `DELETE` | `/pois/{id}` | elimina |
| Documenti | `POST` | `/documenti` | `multipart/form-data`: `titolo` + `immagine`; esegue OCR e salva il testo estratto |
| | `GET` | `/documenti`, `/documenti/{id}` | lista / dettaglio |
| | `PATCH` / `DELETE` | `/documenti/{id}` | modifica titolo/testo / elimina (rimuove anche il file) |

Errori restituiti come `{ "message": string, "timestamp": ISO-8601 }`. Le liste vuote rispondono **404** anziché array vuoto (gestito lato FE).

---

## Avvio del backend

### Prerequisiti

- JDK 25
- PostgreSQL in esecuzione, con un database `db-PS1U5`
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) installato sul sistema, con i dati di lingua `eng` disponibili

### Configurazione

`BE/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/db-PS1U5
spring.datasource.username=postgres
spring.datasource.password=1234
server.port=5174

app.upload.dir=uploads/documenti
app.ocr.tessdata=${TESSDATA_PREFIX:C:/Program Files/Tesseract-OCR/tessdata}
app.ocr.lang=eng
```

Adatta credenziali DB e percorso `tessdata` al tuo ambiente (o esporta la variabile d'ambiente `TESSDATA_PREFIX`).

### Avvio

```bash
cd BE
./mvnw spring-boot:run
```

Il server parte su `http://localhost:5174`. Con `spring.jpa.hibernate.ddl-auto=update`, lo schema viene creato/aggiornato automaticamente al primo avvio.

### CORS

Il backend accetta richieste solo da `http://localhost:5173` (`BE/.../config/CorsConfig.java`) — è la porta di default del dev server Vite. Se il frontend gira su un'altra porta, va aggiornata qui.

---

## Avvio del frontend

### Prerequisiti

- Node.js 24+

### Installazione e avvio

```bash
cd FE
npm install
npm run dev
```

L'app si apre su `http://localhost:5173`. Altri comandi disponibili: `npm run build` (build di produzione + type-check), `npm run lint`, `npm run preview`.

Il backend deve essere già attivo su `:5174` perché il frontend funzioni (nessuna configurazione: l'URL base è fissato in `FE/src/api/client.ts`).

---

## Funzionalità del frontend

- **Feed** (`/`) — elenco post con anteprima foto, badge posizione, data
- **Nuovo post** (`/nuovo-post`) — titolo, descrizione, posizione (nessuna / POI esistente / nuovo POI scelto cliccando sulla mappa) e foto multiple (file, fotocamera diretta, o URL)
- **Dettaglio post** (`/posts/:id`) — modifica campi, mappa della posizione, aggiunta/rimozione foto, eliminazione
- **Mappa** (`/mappa`) — tutti i POI su mappa interattiva; creazione di un POI cliccando sulla mappa; ricerca dei POI nel riquadro visibile; popup con i post collegati a ciascun POI
- **Documenti** (`/documenti`) — upload di un'immagine (file o fotocamera diretta) con estrazione automatica del testo via OCR; elenco con anteprima del testo
- **Dettaglio documento** — testo OCR modificabile, eliminazione

### Fotocamera diretta

Sia per le foto dei post sia per i documenti, oltre alla scelta file è disponibile un pulsante **📸 Fotocamera** che apre uno stream live (`getUserMedia`) e permette di scattare direttamente dal browser. Richiede un contesto sicuro (funziona su `localhost`; in rete servirebbe HTTPS) e il permesso della fotocamera concesso dall'utente.

---

## Note e limiti noti

- **Foto dei post come URL**: l'endpoint `/api/fotos` salva solo una coppia `(url, dimensione)`, senza upload binario. Il frontend genera quindi una *data URL* base64 dai file locali/scatti fotocamera e la invia come se fosse l'URL della foto; è anche possibile incollare direttamente un URL immagine esterno.
- **Documenti non visualizzabili come immagine**: `Documento.contenuto` è il path assoluto del file **sul filesystem del server**, non un URL raggiungibile dal browser — non esiste un endpoint che serva quel file via HTTP. Il frontend mostra quindi solo i metadati e il testo estratto dall'OCR, non un'anteprima dell'immagine originale.
- Le liste vuote (`GET` senza risultati) rispondono con **404** invece di un array vuoto: il frontend lo normalizza internamente in lista vuota.

---

## Struttura del repository

```
BE/
  src/main/java/com/example/progettosettimana1u5/
    controllers/   endpoint REST
    services/      logica applicativa
    repositories/  Spring Data JPA
    entities/      entità JPA
    payloads/      DTO di richiesta/risposta
    exceptions/    gestione errori centralizzata
    config/        CORS
  src/main/resources/application.properties

FE/
  src/
    api/           client HTTP tipizzato per ogni risorsa
    components/    componenti riutilizzabili (mappa, fotocamera, picker foto/POI, ecc.)
    pages/         una pagina per rotta
    utils/         formattazione date/byte, conversione file→dataURL
    App.tsx        definizione delle rotte
    main.tsx       bootstrap dell'app
```
