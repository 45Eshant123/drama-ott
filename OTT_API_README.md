# 🚀 OTT Backend API Guide

## BASE URL

```
http://localhost:3001/api/content
```

---

# 📚 COMPLETE API DOCUMENTATION

---

## 1️⃣ CREATE SHOW (POST)

**Endpoint**
```
POST /api/content
```

**Description**: Create a new drama/movie/anime show

**Request Body**
```json
{
  "title": "A Dream Within A Dream",
  "type": "series",
  "description": "A captivating drama about love and dreams",
  "thumbnail": "https://image-url.jpg",
  "trailerUrl": "https://youtu.be/nxvGVSc6Ls8?si=v5alGPNwVLvRnxEz",
  "genre": ["Drama", "Fantasy"],
  "releaseYear": 2026,
  "rating": 8.9
}
```

**Response**
```json
{
  "message": "Created",
  "item": {
    "id": "69f327a3a5c0e4d9ecb3caab",
    "title": "A Dream Within A Dream",
    "type": "series",
    "description": "A captivating drama about love and dreams",
    "thumbnail": "https://image-url.jpg",
    "trailerUrl": "https://youtu.be/sample",
    "genre": ["Drama", "Fantasy"],
    "releaseYear": 2026,
    "rating": 8.9,
    "seasons": []
  }
}
```

---

## 2️⃣ GET ALL CONTENT (WITH FILTERS)

**Endpoint**
```
GET /api/content?type=series&genre=Drama&page=1&limit=50
```

**Description**: Fetch content list with optional filters

**Query Parameters**
- `type` - Filter by type (movie, series, anime)
- `genre` - Filter by genre
- `year` - Filter by release year
- `rating` - Filter by minimum rating
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)

**Response**
```json
{
  "items": [
    {
      "id": "69f327a3a5c0e4d9ecb3caab",
      "title": "A Dream Within A Dream",
      "type": "series",
      "genre": ["Drama", "Fantasy"],
      "rating": 8.9,
      "seasons": [
        {
          "seasonNumber": 1,
          "episodes": []
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

---

## 3️⃣ SEARCH CONTENT

**Endpoint**
```
GET /api/content/search?q=Dream&genre=Drama
```

**Description**: Search content by title, description, or genre

**Query Parameters**
- `q` - Search query (title/description)
- `genre` - Filter by genre
- `year` - Filter by year
- `rating` - Filter by minimum rating

**Response**
```json
{
  "items": [
    {
      "id": "69f327a3a5c0e4d9ecb3caab",
      "title": "A Dream Within A Dream",
      "type": "series",
      "description": "A captivating drama...",
      "genres": ["Drama", "Fantasy"],
      "rating": 8.9
    }
  ]
}
```

---

## 4️⃣ GET FEATURED CONTENT

**Endpoint**
```
GET /api/content/featured?limit=5
```

**Description**: Get top-rated content (sorted by rating & views)

**Response**
```json
{
  "items": [
    {
      "id": "69f327a3a5c0e4d9ecb3caab",
      "title": "A Dream Within A Dream",
      "rating": 9.5,
      "seasons": []
    }
  ]
}
```

---

## 5️⃣ GET TRENDING CONTENT

**Endpoint**
```
GET /api/content/trending?limit=12
```

**Description**: Get trending content (sorted by recent views)

**Response**
```json
{
  "items": [
    {
      "id": "69f327a3a5c0e4d9ecb3caab",
      "title": "A Dream Within A Dream",
      "views": 1500,
      "seasons": []
    }
  ]
}
```

---

## 6️⃣ GET TOP 10 BY TYPE

**Endpoint**
```
GET /api/content/top10?type=series
```

**Description**: Get top 10 content of a specific type

**Query Parameters**
- `type` - series | movie | anime

**Response**
```json
{
  "items": [
    {
      "id": "69f327a3a5c0e4d9ecb3caab",
      "title": "A Dream Within A Dream",
      "type": "series",
      "rating": 9.2
    }
  ]
}
```

---

## 7️⃣ GET SINGLE CONTENT

**Endpoint**
```
GET /api/content/:id
GET /api/content/69f327a3a5c0e4d9ecb3caab
```

**Description**: Fetch complete details of a single drama/show

**Response**
```json
{
  "item": {
    "id": "69f327a3a5c0e4d9ecb3caab",
    "title": "A Dream Within A Dream",
    "type": "series",
    "description": "A captivating drama about love and dreams",
    "thumbnail": "https://image-url.jpg",
    "trailerUrl": "https://youtu.be/sample",
    "genre": ["Drama", "Fantasy"],
    "releaseYear": 2026,
    "rating": 8.9,
    "seasons": [
      {
        "seasonNumber": 1,
        "episodes": [
          {
            "episodeNumber": 1,
            "title": "Episode 1 - The Beginning",
            "videoUrl": "https://streamtape.com/e/abc1.mp4",
            "thumbnail": "https://thumb1.jpg"
          }
        ]
      }
    ]
  }
}
```

---

## 8️⃣ UPDATE SHOW DETAILS

**Endpoint**
```
PUT /api/content/:id
PUT /api/content/69f327a3a5c0e4d9ecb3caab
```

**Description**: Update show title, rating, description, etc.

**Request Body** (send only fields to update)
```json
{
  "title": "Updated Title",
  "rating": 9.2,
  "description": "Updated description",
  "genre": ["Drama", "Fantasy", "Romance"]
}
```

**Response**
```json
{
  "message": "Updated",
  "item": {
    "id": "69f327a3a5c0e4d9ecb3caab",
    "title": "Updated Title",
    "rating": 9.2,
    "seasons": []
  }
}
```

---

## 9️⃣ UPDATE SHOW TRAILER

**Endpoint**
```
PATCH /api/content/:id/trailer
PATCH /api/content/69f327a3a5c0e4d9ecb3caab/trailer
```

**Description**: Update trailer URL

**Request Body**
```json
{
  "trailerUrl": "https://youtu.be/newTrailer"
}
```

**Response**
```json
{
  "message": "Trailer updated",
  "item": {
    "id": "69f327a3a5c0e4d9ecb3caab",
    "trailerUrl": "https://youtu.be/newTrailer",
    "seasons": []
  }
}
```

---

## 🔟 ADD SINGLE EPISODE

**Endpoint**
```
PATCH /api/content/:id/episodes
PATCH /api/content/69f327a3a5c0e4d9ecb3caab/episodes
```

**Description**: Add a single episode to a season

**Request Body**
```json
{
  "seasonNumber": 1,
  "episode": {
    "episodeNumber": 1,
    "title": "Episode 1",
    "videoUrl": "https://streamtape.com/e/abc1.mp4",
    "thumbnail": "https://thumb.jpg"
  }
}
```

**Response**
```json
{
  "message": "Episodes added",
  "item": {
    "id": "69f327a3a5c0e4d9ecb3caab",
    "seasons": [
      {
        "seasonNumber": 1,
        "episodes": [
          {
            "episodeNumber": 1,
            "title": "Episode 1",
            "videoUrl": "https://streamtape.com/e/abc1.mp4",
            "thumbnail": "https://thumb.jpg"
          }
        ]
      }
    ]
  }
}
```

---

## 1️⃣1️⃣ ADD MULTIPLE EPISODES (BULK)

**Endpoint**
```
PATCH /api/content/:id/episodes
PATCH /api/content/69f327a3a5c0e4d9ecb3caab/episodes
```

**Description**: Add multiple episodes to a season at once

**Request Body**
```json
{
  "seasonNumber": 1,
  "episodes": [
    {
      "episodeNumber": 2,
      "title": "Episode 2",
      "videoUrl": "https://streamtape.com/e/abc2.mp4",
      "thumbnail": "https://thumb2.jpg"
    },
    {
      "episodeNumber": 3,
      "title": "Episode 3",
      "videoUrl": "https://streamtape.com/e/abc3.mp4",
      "thumbnail": "https://thumb3.jpg"
    }
  ]
}
```

**Response**
```json
{
  "message": "Episodes added",
  "item": {
    "id": "69f327a3a5c0e4d9ecb3caab",
    "seasons": [
      {
        "seasonNumber": 1,
        "episodes": [
          {
            "episodeNumber": 2,
            "title": "Episode 2",
            "videoUrl": "https://streamtape.com/e/abc2.mp4"
          },
          {
            "episodeNumber": 3,
            "title": "Episode 3",
            "videoUrl": "https://streamtape.com/e/abc3.mp4"
          }
        ]
      }
    ]
  }
}
```

---

## 1️⃣2️⃣ ADD NEW SEASON (WITH EPISODES)

**Endpoint**
```
PATCH /api/content/:id/episodes
PATCH /api/content/69f327a3a5c0e4d9ecb3caab/episodes
```

**Description**: Create a new season and add episodes to it

**Request Body**
```json
{
  "seasonNumber": 2,
  "episodes": [
    {
      "episodeNumber": 1,
      "title": "Season 2 Episode 1",
      "videoUrl": "https://streamtape.com/e/s2e1.mp4",
      "thumbnail": "https://s2thumb1.jpg"
    },
    {
      "episodeNumber": 2,
      "title": "Season 2 Episode 2",
      "videoUrl": "https://streamtape.com/e/s2e2.mp4",
      "thumbnail": "https://s2thumb2.jpg"
    }
  ]
}
```

**Response**
```json
{
  "message": "Episodes added",
  "item": {
    "id": "69f327a3a5c0e4d9ecb3caab",
    "seasons": [
      {
        "seasonNumber": 1,
        "episodes": []
      },
      {
        "seasonNumber": 2,
        "episodes": [
          {
            "episodeNumber": 1,
            "title": "Season 2 Episode 1",
            "videoUrl": "https://streamtape.com/e/s2e1.mp4"
          },
          {
            "episodeNumber": 2,
            "title": "Season 2 Episode 2",
            "videoUrl": "https://streamtape.com/e/s2e2.mp4"
          }
        ]
      }
    ]
  }
}
```

---

## 1️⃣3️⃣ UPDATE EPISODE DETAILS

**Endpoint**
```
PATCH /api/content/:id/episodes
PATCH /api/content/69f327a3a5c0e4d9ecb3caab/episodes
```

**Description**: Update episode title, video URL, or thumbnail

**Request Body**
```json
{
  "seasonNumber": 1,
  "episodeNumber": 1,
  "update": {
    "title": "Updated Episode 1 Title",
    "videoUrl": "https://streamtape.com/e/newVideo.mp4",
    "thumbnail": "https://newThumb.jpg"
  }
}
```

**Response**
```json
{
  "message": "Episode updated",
  "item": {
    "id": "69f327a3a5c0e4d9ecb3caab",
    "seasons": [
      {
        "seasonNumber": 1,
        "episodes": [
          {
            "episodeNumber": 1,
            "title": "Updated Episode 1 Title",
            "videoUrl": "https://streamtape.com/e/newVideo.mp4",
            "thumbnail": "https://newThumb.jpg"
          }
        ]
      }
    ]
  }
}
```

---

## 1️⃣4️⃣ DELETE EPISODE FROM SEASON

**Endpoint**
```
DELETE /api/content/:id/seasons/:seasonNumber/episodes/:episodeNumber
DELETE /api/content/69f327a3a5c0e4d9ecb3caab/seasons/1/episodes/1
```

**Description**: Delete a specific episode from a specific season

**Response**
```json
{
  "message": "Episode deleted",
  "item": {
    "id": "69f327a3a5c0e4d9ecb3caab",
    "seasons": [
      {
        "seasonNumber": 1,
        "episodes": []
      }
    ]
  }
}
```

---

## 1️⃣5️⃣ DELETE ENTIRE SHOW

**Endpoint**
```
DELETE /api/content/:id
DELETE /api/content/69f327a3a5c0e4d9ecb3caab
```

**Description**: Delete entire show with all seasons and episodes

**Response**
```json
{
  "message": "Deleted"
}
```

---

## 1️⃣6️⃣ MIGRATE OLD DATA (ADMIN)

**Endpoint**
```
POST /api/content/migrate-all
```

**Description**: Migrate flat episodes to multi-season structure (one-time operation)

**Request Body**
```json
{}
```

**Response**
```json
{
  "message": "Migration done safely",
  "updated": 15
}
```

**What it does:**
- Moves all existing flat `episodes` into `seasons[0].episodes`
- Prevents duplicate migration
- Clears old `episodes` array after migration
- Updates 15 shows in this example

---

## ⚠️ IMPORTANT RULES

✅ **DO USE:**

```json
{ "seasonNumber": 1, "episode": { "episodeNumber": 1, "title": "Ep 1", "videoUrl": "..." } }
```

✅ **OR:**

```json
{ "seasonNumber": 1, "episodes": [ { "episodeNumber": 1, ... }, { "episodeNumber": 2, ... } ] }
```

✅ **OR (for update):**

```json
{ "seasonNumber": 1, "episodeNumber": 1, "update": { "title": "New Title" } }
```

❌ **DO NOT USE:**

```json
{ "seasons": [] }
```

---

## 📊 DATA STRUCTURE

```json
{
  "_id": "ObjectId",
  "title": "String",
  "type": "movie|series|anime",
  "description": "String",
  "thumbnail": "URL",
  "trailerUrl": "URL",
  "genre": ["String"],
  "releaseYear": "Number",
  "rating": "Number",
  "source": "String",
  "seasons": [
    {
      "seasonNumber": "Number",
      "episodes": [
        {
          "episodeNumber": "Number",
          "title": "String",
          "videoUrl": "URL",
          "thumbnail": "URL"
        }
      ]
    }
  ],
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

---

## 🧠 WORKFLOW

1. Create show using endpoint 1️⃣
2. Add episodes using endpoint 1️⃣0️⃣ (single) or 1️⃣1️⃣ (bulk)
3. Create new seasons using endpoint 1️⃣2️⃣
4. Fetch data using endpoint 7️⃣
5. Update show/episodes using endpoints 8️⃣, 9️⃣, or 1️⃣3️⃣
6. Delete episodes or shows using endpoints 1️⃣4️⃣ or 1️⃣5️⃣

---

## 🎯 STATUS

✅ Multi-season supported  
✅ Bulk upload ready  
✅ Episode update capability  
✅ Safe delete operations  
✅ Migration support  
✅ Production-ready structure
