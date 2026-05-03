# DramaStream Backend

Node.js + Express + MongoDB backend for the DramaStream application.

## Project Structure

```text
backend/
├── package-lock.json
├── package.json
├── README.md
└── src/
    ├── config/
    ├── constants/
    ├── controllers/
    ├── jobs/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── services/
    └── utils/
```

## Setup

1. Install dependencies:

    ```bash
    npm install
    ```

2. Create a `.env` file from your environment template and configure:

    - `MONGODB_URI`: MongoDB connection string
    - `JWT_SECRET`: Secret key for JWT tokens
    - `CORS_ORIGIN`: Frontend URL for CORS, for example `http://localhost:3002`

3. Start the backend:

    ```bash
    npm run dev
    ```

The API runs at `http://localhost:3001`.

## Step For Adding Drama

Use this section when you want to add a drama manually or through TMDB.

### 1) Manual Drama Creation

Use this endpoint to create a new drama record directly in MongoDB:

- `POST http://localhost:3001/api/content`
- `POST http://localhost:3001/content`

The backend accepts both routes. The body can be sent directly or wrapped inside `{ "item": ... }`.

Example body:

```json
{
   "title": "Absolute Value of Romance",
   "type": "series",
   "description": "A quiet student by day, a romance novelist by night.",
   "thumbnail": "https://example.com/poster.jpg",
   "trailerUrl": "https://youtu.be/xxxxxxxxxxx",
   "genre": ["Drama", "Comedy"],
   "releaseYear": 2026,
   "rating": 8.5,
   "source": "manual",
   "episodes": []
}
```

Accepted field names:

- `thumbnail` or `posterUrl`
- `genre` as an array or a comma-separated string
- `releaseYear` as a number
- `rating` as a number
- `source` can be `manual` or `tmdb`
- `episodes` as an array of episode objects

Content `type` values:

- `movie`
- `series`
- `anime`

### 2) Add New Episodes Manually

If the drama already exists, you can store episodes on the content document itself using create/update.

Update the drama with episodes:

- `PUT http://localhost:3001/api/content/:id`
- `PUT http://localhost:3001/content/:id`

Example body:

```json
{
   "episodes": [
      {
         "episodeNumber": 1,
         "title": "Episode 1",
         "servers": [
            {
               "name": "Streamtape",
               "url": "https://streamtape.com/e/abcd1234"
            }
         ],
         "duration": "45"
      },
      {
         "episodeNumber": 2,
         "title": "Episode 2",
         "servers": [
            {
               "name": "Streamtape",
               "url": "https://streamtape.com/e/wxyz5678"
            }
         ],
         "duration": "46"
      }
   ]
}
```

The player page reads the first available episode from the `episodes` array and uses the first server entry for playback.

### 3) Add Episodes Through TMDB/Streamtape Endpoint

Use this endpoint when you want to append episodes to an existing drama.

- `POST http://localhost:3001/tmdb/episodes/:id`

You can send either `episodes` or `links`.

Example using `episodes`:

```json
{
   "episodes": [
      {
         "episodeNumber": 1,
         "title": "Episode 1",
         "servers": [
            {
               "name": "Streamtape",
               "url": "https://streamtape.com/e/abcd1234"
            }
         ],
         "duration": "45"
      }
   ]
}
```

Example using `links`:

```json
{
   "links": [
      "https://streamtape.com/e/abcd1234",
      "https://streamtape.com/e/wxyz5678"
   ]
}
```

What the backend does:

- Converts Streamtape links into episode objects
- Saves the playback URL in `url`
- Derives a thumbnail when possible
- Appends the new episodes to the existing `episodes` array

### 4) Import Series From TMDB

Use this endpoint to fetch popular series from TMDB and store them in MongoDB:

- `POST http://localhost:3001/tmdb/import/series`

This endpoint does not need a request body.

It will create or update content records with:

- `tmdbId`
- `title`
- `type: "series"`
- `thumbnail`
- `rating`
- `releaseYear`
- `description`
- `trailerUrl`
- `source: "tmdb"`

## CRUD Operations

### Create

Create a drama:

- `POST /api/content`
- `POST /content`

Required fields:

- `title`
- `type`

Optional fields:

- `description`
- `thumbnail` / `posterUrl`
- `trailerUrl`
- `genre`
- `releaseYear`
- `rating`
- `source`
- `episodes`
- `tmdbId`

### Read

Get all dramas:

- `GET /api/content`
- `GET /content`

Query examples:

- `?type=series`
- `?genre=drama`
- `?language=Korea`
- `?year=2026`
- `?rating=8`

Get a single drama:

- `GET /api/content/:id`
- `GET /content/:id`

Get featured content:

- `GET /content/featured`

Get trending content:

- `GET /content/trending`

Get top 10 by type:

- `GET /content/top10?type=series`

Search content:

- `GET /content/search?q=romance`

### Update

Update a drama:

- `PUT /api/content/:id`
- `PUT /content/:id`

Example body:

```json
{
   "title": "Updated Title",
   "description": "Updated description",
   "rating": 9.1,
   "genre": ["Drama", "Romance"]
}
```

Update only the trailer URL:

- `PATCH /content/:id/trailer`

Example body:

```json
{
   "trailerUrl": "https://youtu.be/xxxxxxxxxxx"
}
```

### Delete

Delete is not implemented in the current backend codebase.
If you need delete support, you will need to add a `DELETE /content/:id` endpoint and wire it to the `Content` model.

## Authentication

Protected endpoints require a JWT token in the `Authorization` header:

```text
Authorization: Bearer <token>
```

## Health

- `GET /health` - Health check endpoint
