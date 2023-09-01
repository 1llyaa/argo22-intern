import './style.css';
import 'modern-normalize/modern-normalize.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
	<!-- <div id="modals"></div> -->
	<div class="wrapper">
		<div class="box" id="page-search">
			<div class="header">
				<h1 class="web-title">Argo - Movie Search</h1>
				<form class="search" id="search">
					<input type="text" name="search" placeholder="Title" id="search-text">
					<!-- <input type="submit" value="Search"> -->
				</form>
			</div>
			<div class="list" id="movies"></div>
		</div>
		<div class="box hidden" id="page-details"></div>
	</div>
`;

let searchForm = document.getElementById("search");
let searchTextElement = document.getElementById("search-text") as HTMLInputElement;

let movieList = document.getElementById("movies");
// let modalList = document.getElementById("modals");

let searchPage = document.getElementById("page-search");
let detailsPage = document.getElementById("page-details");

let timer = 0;



// Source: https://bobbyhadz.com/blog/detect-when-user-stops-typing-in-javascript
searchTextElement?.addEventListener('keyup', () => {
	clearTimeout(timer);

	timer = setTimeout(async () => {
		await searchMovies(searchTextElement.value);
	}, 100);
});

searchForm?.addEventListener('submit', async (event) => {
	event.preventDefault();

	// let searchText = (document.querySelector("input[name=\"search\"]") as HTMLInputElement).value;

	// await searchMovies(searchTextElement.value);
});

const apiKey = "d4972240";
let movies = [];
let currentMovie: null | string = null;

window.showSearch = () => {
	if (!detailsPage) {
		return;
	}

	if (currentMovie == null) {
		return;
	}

	currentMovie = null;

	detailsPage.innerHTML = "";

	detailsPage.classList.add("hidden");
	searchPage?.classList.remove("hidden");
}

window.movieDetails = async (id: string) => {
	// await showMovieModal(id);

	if (!detailsPage) {
		return;
	}

	if (currentMovie == null) {
		searchPage?.classList.add("hidden");
		detailsPage.classList.remove("hidden");
	}

	currentMovie = id;

	detailsPage.innerHTML = "Loading...";

	let apiResponse = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`);
	let movie = await apiResponse.json();

	console.log(movie);

	let movieRatings = movie["Ratings"];
	let ratingsElement = "";

	for (let i = 0; i < movieRatings.length; i++) {
		let movieRating = movieRatings[i];

		ratingsElement += `
			${movieRating["Source"]}: ${movieRating["Value"]}
			<br />
		`;
	}

	detailsPage.innerHTML = `
		<button onclick="window.showSearch()">Go back</button>
		<img class="details-poster" src="${movie['Poster']}" alt="${movie["Title"]}"/>
		${movie["Title"]} (${movie["Year"]})
		<br />
		${movie["Plot"]}
		<br />
		${movie["Director"]}
		<br />
		${ratingsElement}
	`;
}

/* const showMovieModal = async (id: string) => {
	let apiResponse = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`);

	modalList.innerHTML = `
		<div class="box">
			${id}
		</div>
	`;
} */

let searchMovies = async (searchText: string) => {
	if (movieList == null) {
		console.error("Movie list element not found!");

		return;
	}

	movieList.textContent = "Loading...";

	let apiResponse = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchText}&type=movie`);

	let jsonList = await apiResponse.json();
	movies = jsonList["Search"];

	if (!movies) {
		return;
	}

	movieList.textContent = "";

	for (let i= 0; i < movies.length; i++) {
		let movie = movies[i];
		// console.log(movie);

		movieList.innerHTML += `
			<a class="movie" onclick="window.movieDetails('${movie['imdbID']}')">
				<img class="movie-poster" src="${movie['Poster']}" alt="${movie["Title"]}"/>
				<div class="movie-details">
					<p class="movie-title">${movie["Title"]} (${movie["Year"]})</p>
				</div>
			</a>
		`;
	}
}

/* document.addEventListener('readystatechange', async () => {
	await searchMovies("Iron");
	// await showMovieModal(movies[0]["imdbID"]);
}); */
