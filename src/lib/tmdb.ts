type TvResults = {
	backdrop_path: string;
	poster_path: string;
	id: number;
};

export const findByIdImdb = async (
	id: string,
	tmdbApiKey: string,
	language: "fr" | "en" = "fr",
) => {
	const url = `https://api.themoviedb.org/3/find/${id}?external_source=imdb_id&language=${language}`;

	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${tmdbApiKey}`,
		},
	};

	const response = await fetch(url, options);
	return response.json() as Promise<{ tv_results: TvResults[] }>;
};
