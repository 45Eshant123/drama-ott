import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Plus, Check, Star, Calendar, Globe, Layers } from 'lucide-react';
import { toast } from 'sonner';
import DramaCard from '@/components/DramaCard.jsx';
import HorizontalScroll from '@/components/HorizontalScroll.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

const getYouTubeEmbedUrl = (url) => {
	if (!url) return '';

	try {
		const parsed = new URL(url);

		if (parsed.hostname.includes('youtube.com')) {
			const videoId = parsed.searchParams.get('v');
			return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
		}

		if (parsed.hostname.includes('youtu.be')) {
			const videoId = parsed.pathname.replace('/', '');
			return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
		}

		return '';
	} catch {
		return '';
	}
};

const DramaDetailsPage = () => {
	const { id } = useParams();
	const { isAuthenticated, currentUser } = useAuth() || {};

	const [drama, setDrama] = useState(null);
	const [relatedDramas, setRelatedDramas] = useState([]);
	const [episodes, setEpisodes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [watchlistRecord, setWatchlistRecord] = useState(null);
	const [watchlistLoading, setWatchlistLoading] = useState(false);

	const firstEpisodeNumber = episodes.length > 0 ? Number(episodes[0]?.episodeNumber) || 1 : 1;
	const watchNowHref = `/watch/${id}?ep=${firstEpisodeNumber}`;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await apiClient.request(`/content/${id}`);
				const item = res.item;

				const mappedDrama = {
					id: item.id,
					title: item.title,
					posterUrl: item.thumbnail,
					genres: item.genre?.length ? item.genre : ['Drama'],
					rating: item.rating,
					description: item.description,
					year: item.releaseYear,
					country: item.language || 'Unknown',
					numberOfSeasons: 1,
					trailerUrl: item.trailerUrl || '',
					isTrending: true,
					isPopular: true,
				};

				setEpisodes(item.episodes || []);
				setDrama(mappedDrama);

				if (isAuthenticated && currentUser) {
					try {
						const watchlistRes = await apiClient.getWatchlistItem(id);
						setWatchlistRecord(watchlistRes.item);
					} catch (watchlistError) {
						if (watchlistError?.message !== 'Watchlist item not found') {
							console.error(watchlistError);
						}
					}
				}

				const all = await apiClient.request('/content?type=series');
				const related = (all.items || [])
					.map((entry) => ({
						id: entry.id,
						title: entry.title,
						posterUrl: entry.thumbnail,
						genres: entry.genre || [],
						rating: entry.rating,
					}))
					.filter((entry) => entry.id !== id)
					.slice(0, 10);

				setRelatedDramas(related);
			} catch (err) {
				console.error(err);
				toast.error('Failed to load drama');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [id, isAuthenticated, currentUser]);

	const toggleWatchlist = async () => {
		if (!isAuthenticated) {
			toast.error('Please login to add to watchlist');
			return;
		}

		setWatchlistLoading(true);
		try {
			if (watchlistRecord) {
				await apiClient.removeWatchlistItem(id);
				setWatchlistRecord(null);
				toast.success('Removed from watchlist');
			} else {
				const response = await apiClient.addWatchlistItem(id);
				setWatchlistRecord(response.item);
				toast.success('Added to watchlist');
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to update watchlist');
		} finally {
			setWatchlistLoading(false);
		}
	};

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
			<div className="absolute top-0 left-0 w-full h-[70vh] opacity-10">
				<img
					src={drama.posterUrl}
					alt=""
					className="w-full h-full object-cover blur-3xl scale-110"
				/>
			</div>

			<div className="container mx-auto px-4 pt-20 relative z-10">
				<div className="flex flex-col md:flex-row gap-10">
					<img
						src={drama.posterUrl || 'https://via.placeholder.com/300x450'}
						alt={drama.title}
						className="w-60 rounded-xl shadow-xl"
					/>

					<div className="space-y-6">
						<div className="flex gap-2">
							{drama.isTrending && <span className="bg-red-500 px-2 py-1 text-xs rounded">TRENDING</span>}
							{drama.isPopular && <span className="bg-blue-500 px-2 py-1 text-xs rounded">POPULAR</span>}
						</div>

						<h1 className="text-5xl font-bold">{drama.title}</h1>

						<div className="flex gap-4 text-gray-300 items-center flex-wrap">
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

						<div className="flex gap-2 flex-wrap">
							{drama.genres.map((genre) => (
								<span key={genre} className="bg-gray-700 px-3 py-1 rounded text-sm">
									{genre}
								</span>
							))}
						</div>

						<div className="flex gap-4 flex-wrap">
							<Button asChild className="bg-red-500 hover:bg-red-600">
								<Link to={watchNowHref}>
									<Play className="mr-2" /> Watch Now
								</Link>
							</Button>
							<Button
								variant={watchlistRecord ? 'secondary' : 'outline'}
								className={watchlistRecord ? 'bg-white/10 hover:bg-white/20 border-transparent' : 'hover:bg-white/5'}
								onClick={toggleWatchlist}
								disabled={watchlistLoading}
							>
								{watchlistRecord ? (
									<><Check className="mr-2" /> In Watchlist</>
								) : (
									<><Plus className="mr-2" /> Add to Watchlist</>
								)}
							</Button>
						</div>

						<div>
							<p className="text-foreground/80 text-lg leading-relaxed">
								{drama.description}
							</p>
						</div>
					</div>
				</div>

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
							<video src={drama.trailerUrl} controls className="w-full h-full" />
						)}
					</div>
				) : (
					<div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-muted/40 border border-white/10 px-3 py-1.5 text-sm text-gray-400">
						<Play className="w-4 h-4" />
						Trailer not available
					</div>
				)}

				<div className="mt-16">
					<h2 className="text-2xl mb-4">Episodes</h2>
					{episodes.length === 0 ? (
						<div className="p-6 border border-dashed text-center text-gray-400 rounded-xl">
							No episodes available
						</div>
					) : (
						<ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{episodes.map((ep, idx) => (
								<li key={ep.id || ep.url || idx} className="flex gap-4 items-center p-4 bg-muted/30 rounded">
									<img src={ep.thumbnail || drama.posterUrl} alt="" className="w-28 h-16 object-cover rounded" />
									<div className="flex-1">
										<div className="font-semibold">Episode {ep.episodeNumber || idx + 1}{ep.title ? ` - ${ep.title}` : ''}</div>
										<div className="text-sm text-gray-300">{ep.duration || ''}</div>
									</div>
									<Link to={`/watch/${id}?ep=${ep.episodeNumber || idx + 1}`} className="text-sm bg-red-500 px-3 py-1 rounded">Watch</Link>
								</li>
							))}
						</ul>
					)}
				</div>

				{relatedDramas.length > 0 && (
					<div className="mt-16">
						<HorizontalScroll title="More Like This">
							{relatedDramas.map((related) => (
								<DramaCard key={related.id} drama={related} />
							))}
						</HorizontalScroll>
					</div>
				)}
			</div>
		</div>
	);
};

export default DramaDetailsPage;
