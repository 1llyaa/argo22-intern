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
				<button id="reset-button" onclick="resetPage()">Reset</button>

				
					<div class="introduction" id="introduction">
					    <h2>Welcome to Argo - Movie Search!</h2>
					        <p>
					            This is a movie search website. Simply enter the title of the movie you're looking for in the search bar above.
					        </p>
					        <p>
					            Click on the movie posters to view more details about each movie.
					        </p>
					</div>

			</div>
			<div class="list" id="movies"></div>
		</div>
		<div class="box hidden" id="page-details"></div>
	</div>
`;

// let searchForm = document.getElementById("search");
let searchTextElement = document.getElementById("search-text") as HTMLInputElement;

let movieList = document.getElementById("movies");
// let modalList = document.getElementById("modals");

let searchPage = document.getElementById("page-search");
let detailsPage = document.getElementById("page-details");

let timer = 0;

const introductionSection = document.getElementById("introduction");

if (introductionSection) {
	introductionSection.classList.remove("hidden");
}




// Source: https://bobbyhadz.com/blog/detect-when-user-stops-typing-in-javascript
searchTextElement?.addEventListener('keyup', () => {
	clearTimeout(timer);

	if (introductionSection) {
		introductionSection.classList.add("hidden");
		}

	timer = setTimeout(async () => {
		await searchMovies(searchTextElement.value);
	}, 100);
	if (introductionSection && searchTextElement.value === "") {
		introductionSection.classList.remove("hidden");
	}
});

searchTextElement?.addEventListener('input', async () => {
	clearTimeout(timer);

	if (introductionSection) {
		introductionSection.classList.add("hidden");
	}

	const searchText = searchTextElement.value.trim(); // Trim whitespaces

	if (searchText === "") {
		// If the search bar is empty, show the introduction section
		introductionSection?.classList.remove("hidden");
		return;
	}

	timer = setTimeout(async () => {
		await searchMovies(searchText);
	}, 100);
});


const apiKey = "d4972240";
const placeholderImageURL = '/images/placeholder.png';

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

	const posterURL = movie['Poster'] === 'N/A' ? placeholderImageURL : movie['Poster'];

	detailsPage.innerHTML = `
		<button onclick="window.showSearch()">Go back</button>
		<img class="details-poster" src="${posterURL}" alt="${movie["Title"]}"/>
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

	// Clear the movie list content if the search bar is not empty
	if (searchText !== "") {
		movieList.textContent = "Loading...";
	}

	let apiResponse = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchText}&type=movie`);

	let jsonList = await apiResponse.json();
	movies = jsonList["Search"];

	// Check if the search bar is empty, if so, show the introduction section
	if (searchText === "") {
		introductionSection?.classList.remove("hidden");
		return;
	}

	// Clear the movie list content if there are no movies
	if (!movies) {
		movieList.textContent = "";
		return;
	}


	movieList.textContent = "";

	for (let i = 0; i < movies.length; i++) {
		let movie = movies[i];
		console.log(movie);

		const posterURL = movie['Poster'] === 'N/A' ? placeholderImageURL : movie['Poster'];

		movieList.innerHTML += `
      <a class="movie" onclick="window.movieDetails('${movie['imdbID']}')">
        <img class="movie-poster" src="${posterURL}" alt="${movie['Title']}"/>
        <div class="movie-details">
          <p class="movie-title">${movie['Title']} (${movie['Year']})</p>
        </div>
      </a>
    `;
	}

	function resetPage() {
		// Clear the search bar
		searchTextElement.value = '';

		// Show the introduction section
		if (introductionSection) {
			introductionSection.classList.remove("hidden");
		}

		// Clear the movie list content
		if (movieList) {
			movieList.textContent = '';
		}

		// Hide the details page
		if (detailsPage) {
			detailsPage.classList.add("hidden");
		}

		// Reset the current movie
		currentMovie = null;


		searchMovies('');
	}


	document.getElementById("reset-button")?.addEventListener('click', resetPage);
};

/* document.addEventListener('readystatechange', async () => {
	await searchMovies("Iron");
	// await showMovieModal(movies[0]["imdbID"]);
}); */
