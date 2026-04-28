import Content from "../models/Content.js";
import {
    fetchTrailerUrl,
    fetchPopularSeries
} from "../services/tmdbService.js";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TRAILER_CONCURRENCY = 2;

const mapWithConcurrency = async (items, limit, mapper) => {
    const results = new Array(items.length);
    let index = 0;

    const worker = async () => {
        while (index < items.length) {
            const current = index;
            index += 1;
            results[current] = await mapper(items[current], current);
        }
    };

    const workers = Array.from(
        { length: Math.min(limit, items.length) },
        worker
    );

    await Promise.all(workers);
    return results;
};

export const importSeries = async (req, res) => {
    try {
        const series = await fetchPopularSeries();

        const formatted = await mapWithConcurrency(
            series,
            TRAILER_CONCURRENCY,
            async (s) => {
                let trailerUrl = "";

                try {
                    // 🔥 ALWAYS FETCH TRAILER
                    trailerUrl = await fetchTrailerUrl("series", s.id);
                } catch {
                    trailerUrl = "";
                }

                return {
                    tmdbId: s.id,
                    title: s.name,
                    type: "series",

                    thumbnail: s.poster_path
                        ? `${IMAGE_BASE}${s.poster_path}`
                        : "",

                    rating: s.vote_average,

                    releaseYear:
                        Number.parseInt(
                            s.first_air_date?.split("-")[0],
                            10
                        ) || undefined,

                    description: s.overview,

                    // ✅ Trailer saved
                    trailerUrl,

                    source: "tmdb"
                };
            }
        );

        for (const item of formatted) {
            await Content.updateOne(
                { tmdbId: item.tmdbId },
                { $set: item },
                { upsert: true }
            );
        }

        res.json({
            message: "Series imported successfully",
            imported: formatted.length
        });

    } catch (error) {
        const message =
            error?.response?.data?.status_message ||
            error?.message ||
            "Failed to import series from TMDB";

        res.status(500).json({ error: message });
    }
};