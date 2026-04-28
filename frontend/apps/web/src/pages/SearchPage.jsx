import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '@/lib/apiClient';
import DramaCard from '@/components/DramaCard.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

const COUNTRIES = ['Korea', 'Turkey', 'India', 'Japan'];
const GENRES = [
	'Romance', 'Thriller', 'Emotional', 'Revenge', 'Drama',
	'Comedy', 'Action', 'Mystery', 'Fantasy', 'Suspense', 'Historical'
];

const SearchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialQuery = searchParams.get('q') || '';

	const [query, setQuery] = useState(initialQuery);
	const [selectedCountries, setSelectedCountries] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);

	const [dramas, setDramas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [totalItems, setTotalItems] = useState(0);

	const fetchResults = async () => {
		setLoading(true);
		try {
			let url = `/content?type=series`;

			if (query) url += `&q=${query}`;
			if (selectedCountries.length > 0)
				url += `&language=${selectedCountries[0]}`;
			if (selectedGenres.length > 0)
				url += `&genre=${selectedGenres[0].toLowerCase()}`;

			const res = await apiClient.request(url);

			const items = res.items || [];

			const mapped = items.map(item => ({
				id: item.id,
				title: item.title,
				posterUrl: item.thumbnail,
				genres: item.genre || [],
				rating: item.rating,
				description: item.description
			}));

			setDramas(mapped);
			setTotalItems(res.pagination?.total || mapped.length);

		} catch (error) {
			console.error('Search error:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const delay = setTimeout(() => {
			fetchResults();
			if (query) {
				setSearchParams({ q: query });
			} else {
				setSearchParams({});
			}
		}, 400);

		return () => clearTimeout(delay);
	}, [query, selectedCountries, selectedGenres]);

	const toggleCountry = (country) => {
		setSelectedCountries(prev =>
			prev.includes(country)
				? prev.filter(c => c !== country)
				: [country]
		);
	};

	const toggleGenre = (genre) => {
		setSelectedGenres(prev =>
			prev.includes(genre)
				? prev.filter(g => g !== genre)
				: [genre]
		);
	};

	const clearFilters = () => {
		setSelectedCountries([]);
		setSelectedGenres([]);
		setQuery('');
	};

	const FilterContent = () => (
		<div className="space-y-8">

			{/* COUNTRIES */}
			<div>
				<h3 className="text-sm font-semibold uppercase mb-4">Countries</h3>
				<div className="flex flex-wrap gap-2">
					{COUNTRIES.map(country => (
						<button
							key={country}
							onClick={() => toggleCountry(country)}
							className={`px-3 py-1.5 rounded-full text-sm ${selectedCountries.includes(country)
								? 'bg-primary text-white'
								: 'bg-secondary'
								}`}
						>
							{country}
						</button>
					))}
				</div>
			</div>

			{/* GENRES */}
			<div>
				<h3 className="text-sm font-semibold uppercase mb-4">Genres</h3>
				<div className="flex flex-wrap gap-2">
					{GENRES.map(genre => (
						<button
							key={genre}
							onClick={() => toggleGenre(genre)}
							className={`px-3 py-1.5 rounded-full text-sm ${selectedGenres.includes(genre)
								? 'bg-red-500 text-white'
								: 'bg-secondary'
								}`}
						>
							{genre}
						</button>
					))}
				</div>
			</div>

			{(query || selectedCountries.length || selectedGenres.length) && (
				<Button onClick={clearFilters} className="w-full">
					<X className="mr-2 h-4 w-4" /> Clear Filters
				</Button>
			)}
		</div>
	);

	return (
		<div className="container mx-auto px-4 py-8 min-h-screen">

			<div className="flex flex-col md:flex-row gap-8">

				{/* SIDEBAR */}
				<aside className="hidden md:block w-64 space-y-6">

					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
						<Input
							placeholder="Search dramas..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="pl-9"
						/>
					</div>

					<FilterContent />

				</aside>

				{/* MAIN */}
				<main className="flex-1">

					{/* MOBILE */}
					<div className="md:hidden flex gap-2 mb-6">
						<Input
							placeholder="Search..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>

						<Sheet>
							<SheetTrigger asChild>
								<Button size="icon">
									<SlidersHorizontal />
								</Button>
							</SheetTrigger>

							<SheetContent>
								<SheetHeader>
									<SheetTitle>Filters</SheetTitle>
								</SheetHeader>
								<FilterContent />
							</SheetContent>
						</Sheet>
					</div>

					{/* HEADER */}
					<div className="mb-6 flex justify-between">
						<h1 className="text-2xl font-bold">
							{query ? `Results for "${query}"` : 'Browse Dramas'}
						</h1>
						<span className="text-sm">
							{loading ? 'Searching...' : `${totalItems} found`}
						</span>
					</div>

					{/* RESULTS */}
					{loading ? (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							{[...Array(10)].map((_, i) => (
								<Skeleton key={i} className="aspect-[2/3]" />
							))}
						</div>
					) : dramas.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							{dramas.map(drama => (
								<div key={drama.id} className="p-2 hover:scale-105 transition">
									<DramaCard drama={drama} />
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-20 text-gray-400">
							No dramas found
						</div>
					)}

				</main>
			</div>
		</div>
	);
};

export default SearchPage;