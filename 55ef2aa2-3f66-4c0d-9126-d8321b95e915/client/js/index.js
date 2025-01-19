import { BASE_MOVIE_URL } from "./URL.js";

const token = localStorage.getItem("token");
const starTotal = 5;
let numTimes;

window.addEventListener("DOMContentLoaded", () => {  createCodeBlockTopThreeMovies();

  document
    .getElementById("searchForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const searchValue = document.getElementById("searchTerm").value;
      if (searchValue) {
        window.location.href = `../client/search.html?search=${searchValue}`;
      }
    });
});

const createCodeBlockTopThreeMovies = async () => {
  try {
    const response = await fetch(`${BASE_MOVIE_URL}/top-three`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();

    let movies = data.data;
    let rating;

    // Get the container element where we'll append the code blocks
    const container = document.getElementById("carouselInner");

    // Use a loop to generate the code block multiple times
    movies.forEach((movie, i = 0) => {
      // Create a new div element
      const newDiv = document.createElement("div");

      if (i === 0) {
        newDiv.className = "carousel-item active";
      } else {
        newDiv.className = "carousel-item";
      }

      const codeBlock = `
    <img src="${movie.bannerUrl}" class="d-block w-100" alt="...">
    <div class="carousel-caption d-block">
        <h1> ${movie.title}</h1>
        <h6 class="mt-3">
            <span>${movie.imdbRating} (Imdb) Year :${movie.year}</span><span id="${movie.id}TopStars"></span><br>
        </h6>
        <p class="mt-3" style="width:800px">${movie.plot}</p>
        <p class="mb-2"><span class="col_red me-1 fw-bold">Starring:</span> <span>${movie.starring}</span></p>
        <p class="mb-2 d-flex"><span class="col_red me-1 fw-bold">Genres: </span> <span class="d-flex" id="${movie.id}Genres"></span></p>
        <p><span class="col_red me-1 fw-bold">Runtime:</span><span>${movie.runtime}</span></p>
        <p><span class="col_red me-1 fw-bold">Directed By:</span><span>${movie.directedBy}</span></p>
    </div>
                               
    `;

      // Set the innerHTML of the new div with the code block
      newDiv.innerHTML = codeBlock;

      // Append the new div to the container
      container.appendChild(newDiv);

      rating = movie.userRating;
      //createStars(rating, movie.id + "TopStars");

      const genreContainer = document.getElementById(`${movie.id}Genres`);

      const genres = movie.genres;

      genres.forEach((genre) => {
        const genreElement = document.createElement("div");
        genreElement.textContent = genre;
        genreElement.classList.add("genre-tags");
        genreContainer.appendChild(genreElement);
      });
      i++;
    });
  } catch (error) {
    console.error(error);

    // Get the container element where we'll append the code blocks
    const container = document.getElementById("carouselInner");
    const newDiv = document.createElement("div");

    newDiv.className = "carousel-item active";

    // Set the innerHTML of the new div with the code block
    newDiv.innerHTML = dummyBlock;

    // Append the new div to the container
    container.appendChild(newDiv);
  }
};
