import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema({
    seasonNumber: Number,
    episodes: [
        {
            episodeNumber: Number,
            title: String,
            videoUrl: String,
            thumbnail: String,
            servers: [
                {
                    name: String,
                    url: String
                }
            ]
        }
    ]
});

const contentSchema = new mongoose.Schema(
    {
        tmdbId: {
            type: Number,
            unique: true,
            sparse: true
        },

        title: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["movie", "series", "anime"],
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        thumbnail: String,
        trailerUrl: String,

        genre: {
            type: [String],
            default: []
        },

        episodes: [
            {
                episodeNumber: Number,
                title: String,
                videoUrl: String,
                thumbnail: String,
                servers: [
                    {
                        name: String,
                        url: String
                    }
                ]
            }
        ],

        seasons: [seasonSchema],

        releaseYear: Number,

        rating: {
            type: Number,
            default: 0
        },

        source: {
            type: String,
            default: "tmdb"
        }
    },
    { timestamps: true }
);

contentSchema.index({
    "seasons.seasonNumber": 1,
    "seasons.episodes.episodeNumber": 1
});


export default mongoose.model("Content", contentSchema);