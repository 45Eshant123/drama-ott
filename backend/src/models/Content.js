import mongoose from "mongoose";

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