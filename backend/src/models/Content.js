import mongoose from "mongoose";

const seasonSchema = new mongoose.Schema({
    seasonNumber: Number,
    episodes: [
        {
            episodeNumber: Number,
            title: String,
            videoUrl: String,
            thumbnail: String
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
                thumbnail: String
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


export default mongoose.model("Content", contentSchema);