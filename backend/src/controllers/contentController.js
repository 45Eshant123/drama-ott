import Content from "../models/Content.js";

const VALID_TYPES = ["movie", "series", "anime"];

const normalizeContent = (doc) => {
    if (!doc) return null;
    const item = typeof doc.toObject === "function" ? doc.toObject() : doc;
    return {
        ...item,
        id: String(item._id || item.id)
    };
};

const parsePositiveInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeGenre = (genre) => {
    if (Array.isArray(genre)) return genre.map((g) => String(g).trim()).filter(Boolean);
    if (typeof genre === "string" && genre.trim()) return genre.split(",").map((g) => g.trim()).filter(Boolean);
    return [];
};

const buildContentPayload = (body = {}) => {
    const src = (body && body.item) ? body.item : body;
    const has = (prop) => Object.prototype.hasOwnProperty.call(src || {}, prop);

    const payload = {};
    if (has('title')) payload.title = String(src.title || "").trim();
    if (has('type')) payload.type = String(src.type || "").trim().toLowerCase();
    if (has('description')) payload.description = String(src.description || "").trim();
    if (has('thumbnail') || has('posterUrl')) payload.thumbnail = String(src.thumbnail || src.posterUrl || "").trim();
    if (has('trailerUrl')) payload.trailerUrl = String(src.trailerUrl || "").trim();
    if (has('genre')) payload.genre = normalizeGenre(src.genre);
    if (has('releaseYear')) {
        const y = Number.parseInt(src.releaseYear, 10);
        if (Number.isFinite(y)) payload.releaseYear = y;
    }
    if (has('rating')) {
        const r = Number.parseFloat(src.rating);
        if (Number.isFinite(r)) payload.rating = r;
    }
    if (has('source')) payload.source = String(src.source || "manual").trim();
    if (has('episodes')) payload.episodes = Array.isArray(src.episodes) ? src.episodes : [];
    if (has('tmdbId')) payload.tmdbId = src.tmdbId !== undefined && src.tmdbId !== null && src.tmdbId !== "" ? Number(src.tmdbId) : undefined;

    return payload;
};

export const getFeaturedContent = async (req, res) => {
    try {
        const limit = parsePositiveInt(req.query.limit, 5);
        const records = await Content.find({}).sort({ rating: -1, views: -1, createdAt: -1 }).limit(limit);
        return res.json({ items: records.map(normalizeContent) });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch featured content' });
    }
};

export const getTrendingContent = async (req, res) => {
    try {
        const limit = parsePositiveInt(req.query.limit, 12);
        const records = await Content.find({}).sort({ views: -1, viewsLast24h: -1, rating: -1 }).limit(limit);
        return res.json({ items: records.map(normalizeContent) });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch trending content' });
    }
};

export const getTop10ByType = async (req, res) => {
    try {
        const type = String(req.query.type || "").toLowerCase();
        if (!VALID_TYPES.includes(type)) return res.status(400).json({ message: 'Invalid type' });
        const records = await Content.find({ type }).sort({ rating: -1, views: -1, createdAt: -1 }).limit(10);
        return res.json({ items: records.map(normalizeContent) });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch top10' });
    }
};

export const getContentList = async (req, res) => {
    try {
        const { type, genre, language, year, rating, page = '1', limit = '50' } = req.query;
        const filter = {};
        if (type && VALID_TYPES.includes(String(type).toLowerCase())) filter.type = String(type).toLowerCase();
        if (genre) filter.genre = { $in: [String(genre)] };
        if (language) filter.language = String(language);
        if (year) {
            const y = Number.parseInt(year, 10);
            if (Number.isFinite(y)) filter.releaseYear = y;
        }
        if (rating) {
            const r = Number.parseFloat(rating);
            if (Number.isFinite(r)) filter.rating = { $gte: r };
        }

        const p = parsePositiveInt(page, 1);
        const l = parsePositiveInt(limit, 50);
        const skip = (p - 1) * l;

        const [records, total] = await Promise.all([
            Content.find(filter).sort({ createdAt: -1 }).skip(skip).limit(l),
            Content.countDocuments(filter)
        ]);

        return res.json({ items: records.map(normalizeContent), pagination: { page: p, limit: l, total, totalPages: Math.ceil(total / l) || 1 } });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch list' });
    }
};

export const searchContent = async (req, res) => {
    try {
        const q = String(req.query.q || '').trim();
        if (!q) return res.json({ items: [] });
        const regex = new RegExp(q, 'i');
        const filter = { $or: [{ title: regex }, { description: regex }, { genre: regex }] };
        if (req.query.genre) filter.genre = { $in: [String(req.query.genre)] };
        if (req.query.language) filter.language = String(req.query.language);
        if (req.query.year) {
            const y = Number.parseInt(req.query.year, 10);
            if (Number.isFinite(y)) filter.releaseYear = y;
        }
        if (req.query.rating) {
            const r = Number.parseFloat(req.query.rating);
            if (Number.isFinite(r)) filter.rating = { $gte: r };
        }

        const records = await Content.find(filter).sort({ views: -1, rating: -1 }).limit(50);
        return res.json({ items: records.map(normalizeContent) });
    } catch (err) {
        return res.status(500).json({ message: 'Search failed' });
    }
};

export const getContentById = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Content.findById(id);
        if (!record) return res.status(404).json({ message: 'Content not found' });
        return res.json({ item: normalizeContent(record) });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to fetch content' });
    }
};

export const updateContentTrailer = async (req, res) => {
    try {
        const { id } = req.params;
        const trailerUrl = String(req.body?.trailerUrl || '').trim();
        if (trailerUrl) {
            try { const p = new URL(trailerUrl); if (!['http:', 'https:'].includes(p.protocol)) return res.status(400).json({ message: 'Invalid protocol' }); } catch { return res.status(400).json({ message: 'Invalid URL' }); }
        }
        const record = await Content.findByIdAndUpdate(id, { $set: { trailerUrl } }, { new: true });
        if (!record) return res.status(404).json({ message: 'Content not found' });
        return res.json({ message: 'Trailer updated', item: normalizeContent(record) });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to update trailer' });
    }
};

export const addEpisode = async (req, res) => {
    try {
        const { id } = req.params;
        const episode = req.body.episode;

        const record = await Content.findByIdAndUpdate(
            id,
            { $push: { episodes: episode } },
            { new: true }
        );

        res.json({ message: "Episode added", item: record });
    } catch (err) {
        res.status(500).json({ message: "Failed" });
    }
};

export const deleteEpisode = async (req, res) => {
    try {
        const { id, episodeNumber } = req.params;

        const record = await Content.findByIdAndUpdate(
            id,
            {
                $pull: {
                    episodes: { episodeNumber: Number(episodeNumber) }
                }
            },
            { new: true }
        );

        res.json({ message: "Episode deleted", item: record });
    } catch (err) {
        res.status(500).json({ message: "Failed" });
    }
};

export const deleteContent = async (req, res) => {
    try {
        await Content.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed" });
    }
};

export const createContent = async (req, res) => {
    try {
        const payload = buildContentPayload(req.body);
        if (!payload.title) return res.status(400).json({ message: 'Title is required' });
        if (!VALID_TYPES.includes(payload.type)) return res.status(400).json({ message: 'Invalid type' });
        const record = await Content.create(payload);
        return res.status(201).json({ message: 'Created', item: normalizeContent(record) });
    } catch (err) {
        if (err?.code === 11000) return res.status(409).json({ message: 'Already exists' });
        return res.status(500).json({ message: 'Failed to create' });
    }
};

export const updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = buildContentPayload(req.body);
        if (payload.type && !VALID_TYPES.includes(payload.type)) return res.status(400).json({ message: 'Invalid type' });
        const clean = {};
        Object.keys(payload || {}).forEach(k => { const v = payload[k]; if (v !== undefined) clean[k] = v; });
        if (Object.keys(clean).length === 0) return res.status(400).json({ message: 'No fields' });
        const record = await Content.findByIdAndUpdate(id, { $set: clean }, { new: true, runValidators: true });
        if (!record) return res.status(404).json({ message: 'Not found' });
        return res.json({ message: 'Updated', item: normalizeContent(record) });
    } catch (err) {
        console.error('updateContent error', err);
        if (err?.code === 11000) return res.status(409).json({ message: 'Already exists' });
        return res.status(500).json({ message: 'Failed to update', error: String(err.message || err) });
    }
};

export default null;
