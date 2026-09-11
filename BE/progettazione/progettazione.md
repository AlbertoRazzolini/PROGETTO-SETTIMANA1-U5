
### Progettazione Social Network

Post con foto (fotocamera diretta o upload di più immagini), mappa (posizione collegata alla foto postata e visualizzazione di post sulla mappa in base a dei points of interest POI) e documenti (OCR o immagini presenti nel locale)

## ENTITIES

### Post

- Id UUID
- Titolo String (nullable false)
- Descrizione TEXT (nullable false)
- CreatedAt Instant
- @ManyToOne id_POI (optional) UUID

### Foto

- Id UUID
- Contenuto String (è un url quindi nullable=false)
- Grandezza Long
- CreatedAt Instant
- @ManyToOne id_post (nullable=false) UUID

### POI

- Id UUID
- Latitudine BigDecimal (index) (precisione=8, scale=6) (nullable=false)
- Longitudine BigDecimal (index) (precisione=9, scale=6)(nullable=false)
- Indirizzo string (nullable=true)

### Documento

- Id UUID
- Titolo String (nullable false)
- Contenuto String (nullable false)
- Testo TEXT (dall'OCR)
- Grandezza Long
- CreatedAt Instant

____________________________________________________________________________________________________________

## ENDPOINTS

@RequestMapping("/api/posts")
	PostsController
	1. POST http://localhost:5173/api/posts (+request.body), risponde 201 CREATED
		 creazione e salvataggio di un nuovo post con foto opzionale e posizione opzionale
	2. GET  http://localhost:5173/api/posts  responseStatus NOT_FOUND se non trovato (404)
		 ricerca dei post
	3. GET  http://localhost:5173/api/posts/{postId}  responseStatus NOT_FOUND se non trovato (404)
		 ricerca di un post
	4. PATCH  http://localhost:5173/api/posts/{postId} (+request.body)
		 modifica di uno o più campi di un post
	5. DELETE http://localhost:5173/api/posts/{postId} ritorna void
		 cancellazione di un post specifico

@RequestMapping("/api/fotos")
	FotosController
	1. POST http://localhost:5173/api/fotos (+request.body con postId obbligatorio) risponde 201 CREATED
		creazione e salvataggio di una foto legata al post fatta da uno scatto della fotocamera o da un upload di una o più foto
	2. GET  http://localhost:5173/api/fotos  responseStatus NOT_FOUND se non trovato (404)
		 ricerca delle foto
	3. GET http://localhost:5173/api/fotos/{fotosId}  responseStatus NOT_FOUND se non trovato (404)
		 ricerca di una foto
	4. PATCH http://localhost:5173/api/fotos/{fotosId} (+request.body)
		 modifica di un campo della foto
	5. DELETE http://localhost:5173/api/fotos/{fotosId} ritorna void
		cancellazione di una foto specifica

@RequestMapping("/api/pois")
	PoisController
	1. POST http://localhost:5173/api/pois (+request.body)
	   risponde 201 CREATED
		 Creazione e salvataggio di un POI
	2. GET http://localhost:5173/api/pois responseStatus NOT_FOUND se non trovato (404)
		 ricerca dei POI
	3. GET http://localhost:5173/api/pois/{poiId} responseStatus NOT_FOUND se non trovato (404)
		ricerca di un POI
	4. GET http://localhost:5173/api/pois/ricquadro
	    riquadro delimitato dai punti cardinali  quindi con i requestParam adatti
	5. DELETE http://localhost:5173/api/pois/{poiId} ritorna void
		Eliminazione di un POI specifico

@RequestMapping("/api/documenti")
	 DocumentiController
	1. POST http://localhost:5173/api/documenti (+request.body)
		creazione e salvataggio di un documento che in creazione non avrà il testo dato dall'OCR che invece avrà nella risposta (se non sbaglio)
	2. GET http://localhost:5173/api/documenti responseStatus NOT_FOUND se non trovato (404)
		ricerca dei documenti
	3. GET http://localhost:5173/api/documenti/{documentiId} responseStatus NOT_FOUND se non trovato (404)
		ricerca di un documento
	4. PATCH http://localhost:5173/api/documenti/{documentiId}
		 Modifica di uno o più campi del documento
	5. DELETE http://localhost:5173/api/documenti/{documentiId} ritorna void
		 Eliminazione di un documento specifico