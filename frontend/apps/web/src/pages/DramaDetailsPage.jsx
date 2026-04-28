import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Star, Calendar, Globe, Layers } from 'lucide-react';
import { toast } from 'sonner';
import DramaCard from '@/components/DramaCard.jsx';
import HorizontalScroll from '@/components/HorizontalScroll.jsx';

const getYouTubeEmbedUrl = (url) => {
	if (!url) return "";

	try {
		const parsed = new URL(url);

		if (parsed.hostname.includes("youtube.com")) {
			const id = parsed.searchParams.get("v");
			return id ? `https://www.youtube.com/embed/${id}` : "";
		}

		if (parsed.hostname.includes("youtu.be")) {
			const id = parsed.pathname.replace("/", "");
			return id ? `https://www.youtube.com/embed/${id}` : "";
		}

		return "";
	} catch {
		return "";
	}
};
const DramaDetailsPage = () => {
	const { id } = useParams();

	const [drama, setDrama] = useState(null);
	const [relatedDramas, setRelatedDramas] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// 🔥 FETCH SINGLE DRAMA
				const res = await apiClient.request(`/content/${id}`);
				const item = res.item;

				const mappedDrama = {
					id: item.id,
					title: item.title,
					posterUrl: item.thumbnail,
					genres: item.genre?.length ? item.genre : ["Drama"],
					rating: item.rating,
					description: item.description,
					year: item.releaseYear,
					country: item.language || "Unknown",
					numberOfSeasons: 1,
					trailerUrl: item.trailerUrl || "",

					isTrending: true,
					isPopular: true
				};

				setDrama(mappedDrama);

				// 🔥 RELATED
				const all = await apiClient.request(`/content?type=series`);

				const related = (all.items || [])
					.map(i => ({
						id: i.id,
						title: i.title,
						posterUrl: i.thumbnail,
						genres: i.genre || [],
						rating: i.rating
					}))
					.filter(i => i.id !== id)
					.slice(0, 10);

				setRelatedDramas(related);

			} catch (err) {
				console.error(err);
				toast.error("Failed to load drama");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id]);

	// 🔥 LOADING
	if (loading) {
		return (
			<div className="container mx-auto px-4 py-12">
				<Skeleton className="w-full h-[70vh]" />
			</div>
		);
	}

	if (!drama) {
		return (
			<div className="text-center py-20">
				<h2 className="text-2xl">Drama not found</h2>
			</div>
		);
	}
	const youtubeEmbedUrl = getYouTubeEmbedUrl(drama?.trailerUrl);
	return (
		<div className="min-h-screen pb-20 bg-background text-white">

			{/* BACKDROP */}
			<div className="absolute top-0 left-0 w-full h-[70vh] opacity-10">
				<img
					src={drama.posterUrl}
					className="w-full h-full object-cover blur-3xl scale-110"
				/>
			</div>

			<div className="container mx-auto px-4 pt-20 relative z-10">
				<div className="flex flex-col md:flex-row gap-10">

					{/* POSTER */}
					<img
						src={drama.posterUrl || "https://via.placeholder.com/300x450"}
						className="w-60 rounded-xl shadow-xl"
					/>

					{/* DETAILS */}
					<div className="space-y-6">

						{/* BADGES */}
						<div className="flex gap-2">
							{drama.isTrending && <span className="bg-red-500 px-2 py-1 text-xs rounded">TRENDING</span>}
							{drama.isPopular && <span className="bg-blue-500 px-2 py-1 text-xs rounded">POPULAR</span>}
						</div>

						<h1 className="text-5xl font-bold">{drama.title}</h1>

						{/* INFO */}
						<div className="flex gap-4 text-gray-300 items-center">
							<span className="flex items-center gap-1">
								<Star size={16} /> {drama.rating}
							</span>
							<span className="flex items-center gap-1">
								<Calendar size={16} /> {drama.year}
							</span>
							<span className="flex items-center gap-1">
								<Globe size={16} /> {drama.country}
							</span>
							<span className="flex items-center gap-1">
								<Layers size={16} /> {drama.numberOfSeasons} Season
							</span>
						</div>

						{/* GENRES */}
						<div className="flex gap-2 flex-wrap">
							{drama.genres.map(g => (
								<span key={g} className="bg-gray-700 px-3 py-1 rounded text-sm">
									{g}
								</span>
							))}
						</div>

						{/* BUTTONS */}
						<div className="flex gap-4">
							<Button className="bg-red-500 hover:bg-red-600">
								<Play className="mr-2" /> Watch Now
							</Button>
							<Button variant="outline">
								+ Add to Watchlist
							</Button>
						</div>

						{/* DESCRIPTION */}
						<div>
							<p className="text-foreground/80 text-lg leading-relaxed">
								{drama.description}
							</p>
						</div>

					</div>
				</div>

				{/* 🔥 TRAILER (NO BUTTON, DIRECT VIDEO) */}
				{drama.trailerUrl ? (
					<div className="mt-6 w-[600px] max-w-full aspect-video mx-auto rounded-xl overflow-hidden bg-muted border border-white/10 shadow-2xl">
						{youtubeEmbedUrl ? (
							<iframe
								src={youtubeEmbedUrl}
								title={`${drama.title} trailer`}
								className="w-full h-full"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						) : (
							<video
								src={drama.trailerUrl}
								controls
								className="w-full h-full"
							/>
						)}
					</div>
				) : (
					<div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-muted/40 border border-white/10 px-3 py-1.5 text-sm text-gray-400">
						<Play className="w-4 h-4" />
						Trailer not available
					</div>
				)}

				{/* EPISODES */}
				<div className="mt-16">
					<h2 className="text-2xl mb-4">Episodes</h2>
					<div className="p-6 border border-dashed text-center text-gray-400 rounded-xl">
						Episodes coming soon...
					</div>
				</div>

				{/* RELATED */}
				{relatedDramas.length > 0 && (
					<div className="mt-16">
						<HorizontalScroll title="More Like This">
							{relatedDramas.map(d => (
								<DramaCard key={d.id} drama={d} />
							))}
						</HorizontalScroll>
					</div>
				)}

			</div>
		</div>
	);
};

export default DramaDetailsPage;