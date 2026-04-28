import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';

const DramaCard = ({ drama }) => {
    if (!drama) return null;

    return (
        <Link
            to={`/drama/${drama.id}`}
            className="group relative flex-none w-[160px] sm:w-[200px] md:w-[240px] snap-start"
        >
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-card shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-primary/10">
                {drama.posterUrl ? (
                    <img
                        src={drama.posterUrl}
                        alt={drama.title}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground text-sm">No Image</span>
                    </div>
                )}

                {/* Top Badges */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                    {drama.country && (
                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                            {drama.country}
                        </span>
                    )}
                    {drama.rating && (
                        <div className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            {drama.rating}
                        </div>
                    )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground mb-3 shadow-lg shadow-primary/30">
                            <Play className="w-5 h-5 ml-1" />
                        </div>
                        {drama.description && (
                            <p className="text-xs text-gray-300 line-clamp-3 mb-2 leading-relaxed">
                                {drama.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Below Card */}
            <div className="mt-3 space-y-1.5">
                <h3 className="font-semibold text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {drama.title}
                </h3>

                {/* Genre Tags */}
                {drama.genres && drama.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {drama.genres.slice(0, 3).map(genre => (
                            <span
                                key={genre}
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm text-white/90"
                                style={{ backgroundColor: `hsl(var(--genre-${genre.toLowerCase()}) / 0.3)` }}
                            >
                                {genre}
                            </span>
                        ))}
                        {drama.genres.length > 3 && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground">
                                +{drama.genres.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default DramaCard;