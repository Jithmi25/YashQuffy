import knex_db from "../../db/db-config.js";
import Movie from "../models/movie.js";
import feedbackRepository from "./feedbackRepository.js";

const addMovie = async (movie) => {
  const {
    id,
    title,
    year,
    dailyRentalRate,
    discountRate,
    genres,
    imdbRating,
    posterUrl,
    bannerUrl,
    plot,
    runtime,
    directedBy,
    starring,
    releaseAt,
  } = movie;
  let trx;
  try {
    trx = await knex_db.transaction();
    await trx.raw("PRAGMA foreign_keys = ON");

    const result = await trx.raw(
      "INSERT INTO movie (id, title, year, daily_rental_rate, discount_rate, imdb_rating, poster_url, banner_url, plot, runtime, directed_by, starring, release_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *",
      [
        id,
        title,
        year,
        dailyRentalRate,
        discountRate,
        imdbRating,
        posterUrl,
        bannerUrl,
        plot,
        runtime,
        directedBy,
        starring,
        releaseAt,
      ]
    );

    for (const genreName of genres) {
      try {
        const genre = await trx.raw("SELECT * FROM genre WHERE name=?", [
          genreName,
        ]);

        await trx.raw(
          "INSERT INTO movie_genre (movie_id, genre_id) VALUES (?, ?)",
          [result[0].id, genre[0].id]
        );
      } catch (error) {
        console.error("Error adding genre");
        throw error;
      }
    }
    await trx.commit();

    return new Movie(
      result[0].id,
      result[0].title,
      result[0].year,
      result[0].daily_rental_rate,
      0,
      genres,
      0,
      result[0].imdb_rating,
      result[0].poster_url,
      result[0].banner_url,
      result[0].plot,
      result[0].runtime,
      result[0].directed_by,
      result[0].starring,
      result[0].release_at
    );
  } catch (error) {
    console.error(error);
    await trx.rollback();
    return null;
  }
};
// //remove this for challenge 3.a
// const getMovieByNameAndYear = async (title, year) => {
// };

const getMovieIdByName = async (title, year) => {
  try {
    const result = await knex_db.raw(
      "SELECT id FROM movie WHERE title=?",
      [title]
    );

    if (result.length === 0) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getMovieById = async (id) => {
  //challenge 4.c starts here
 
  //challenge 4.c ends here
};

const getMovies = async () => {
  // console.log("getMovies");
  let movies = [];
  try {
    const result = await knex_db.raw(
      `SELECT
        m.*,
        (
            SELECT
                group_concat(g.name)
            FROM
                genre g JOIN movie_genre mg ON g.id = mg.genre_id
            WHERE
                mg.movie_id = m.id
        ) AS genres
        FROM movie m;`
    );

    for (const movie of result) {
      //remove the below line for 4.b
      const rating = await feedbackRepository.getAverageUserRatingForMovie(
        movie.id
      );
      //remove discounted daily rental rate calculation for 4.b
      movies.push(
        new Movie(
          movie.id,
          movie.title,
          movie.year,
          movie.daily_rental_rate * (1 - movie.discount_rate),
          movie.discount_rate,
          movie.genres ? movie.genres.split(",") : [],
          rating,
          movie.imdb_rating,
          movie.poster_url,
          movie.banner_url,
          movie.plot,
          movie.runtime,
          movie.directed_by,
          movie.starring,
          movie.release_at,
          movie.is_deleted
        )
      );
    }

    return movies;
  } catch (error) {
    console.log(error);
  }
};

const updateDailyRentalRateMovie = async (movieId, dailyRentalRate) => {
  try {
    const result = await knex_db.raw(
      `UPDATE movie
            SET daily_rental_rate = ?
            WHERE id = ? RETURNING id`,
      [dailyRentalRate, movieId]
    );
    return getMovieById(result[0].id);
  } catch (error) {
    console.log(error);
  }
  return updatedMovie;
};

const deleteMovie = async (id) => {
  let response;
  try {
    const result = await knex_db.raw(
      `
      UPDATE movie SET is_deleted = 1 WHERE id = '${id}';
      `
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};




const getMovieSuggestions = async (userId) => {
  //challenge 6.a starts here

  //challenge 6.a ends here
};

const getTopThreeMovies = async () => {
  let movies = [];
  try {
    const result = await knex_db.raw(
      `SELECT id, (average_rating*2+imdb_rating) AS final_rating 
      FROM(
      SELECT movie.*, AVG(feedback.rating) AS average_rating 
      FROM feedback
      JOIN movie ON movie.id = feedback.movie_id
      GROUP BY movie.id)
      ORDER BY final_rating DESC
      LIMIT 3;`
    );

    for (const item of result) {
      const movie = await getMovieById(item.id);
      movies.push(movie);
    }
    return movies;
  } catch (error) {
    console.error(error);
  }
};

const getMoviesWithPagination = async (pageNumber, numberOfRows) => {
  //challenge 4.c starts here
  
  //challenge 4.c ends here
};

const searchMovies = async (searchTerm, numberOfRows, pageNumber) => {
  let movies = [];
  try {
    const result = await knex_db.raw(
      `SELECT
      m.*,
      (
          SELECT
              group_concat(g.name)
          FROM
              genre g
              JOIN movie_genre mg ON g.id = mg.genre_id
          WHERE
              mg.movie_id = m.id
      ) AS genres
      FROM
      movie m
      WHERE
        m.title LIKE '%${searchTerm}%'
        OR genres LIKE '%${searchTerm}%'
        OR m.directed_by LIKE '%${searchTerm}%'
        OR m.year LIKE '%${searchTerm}%'
        OR m.starring LIKE '%${searchTerm}%'
        LIMIT ${numberOfRows} OFFSET ${(pageNumber - 1) * numberOfRows};`
    );

    for (const movie of result) {
      const rating = await feedbackRepository.getAverageUserRatingForMovie(
        movie.id
      );
      movies.push(
        new Movie(
          movie.id,
          movie.title,
          movie.year,
          movie.daily_rental_rate,
          movie.discount_rate,
          movie.genres ? movie.genres.split(",") : [],
          rating,
          movie.imdb_rating,
          movie.poster_url,
          movie.banner_url,
          movie.plot,
          movie.runtime,
          movie.directed_by,
          movie.starring,
          movie.release_at,
          movie.is_deleted
        )
      );
    }
    return movies;
  } catch (error) {
    console.log(error);
  }
};

const getLeastRentedMovies = async () => {
  let movies = [];
  try {
    const updateDiscount = await knex_db.raw(
      `UPDATE movie
      SET discount_rate = 0
      WHERE release_at < current_timestamp;`
    );

    const result = await knex_db.raw(
      `SELECT m.*
      FROM(
      SELECT count(movie_id) as r_count,*
      FROM rental
      GROUP BY movie_id
      ORDER BY r_count ASC
      LIMIT 4)
      JOIN movie m ON m.id = movie_id
WHERE DATETIME(m.release_at) < DATETIME('NOW','-1 month') AND m.is_deleted = 0;`
    );

    for (const item of result) {
      if (item.discount_rate === 0) {
        await knex_db.raw(
          `UPDATE movie SET discount_rate = 0.15 WHERE id = ?`,
          [item.id]
        );
      }
      movies.push(await getMovieById(item.id));
    }
    return movies;
  } catch (error) {
    console.error(error);
  }
};

export const updateMovie = async (id, updatedMovieData) => {
  let trx;
  try {
    trx = await knex_db.transaction();
    await trx.raw("PRAGMA foreign_keys = ON");

    // Update the movie details
    const result = await trx.raw(
      `UPDATE movie
      SET title = ?, year = ?, daily_rental_rate = ?,  discount_rate = ?, imdb_rating = ?, poster_url = ?, banner_url = ?, plot = ?, runtime = ?, directed_by = ?, starring = ?, release_at = ?
      WHERE id = ?
      RETURNING *`,
      [
        updatedMovieData.title,
        updatedMovieData.year,
        updatedMovieData.dailyRentalRate,
        updatedMovieData.discountRate,
        updatedMovieData.imdbRating,
        updatedMovieData.posterUrl,
        updatedMovieData.bannerUrl,
        updatedMovieData.plot,  
        updatedMovieData.runtime,
        updatedMovieData.directedBy,
        updatedMovieData.starring,
        updatedMovieData.releaseAt,
        id,
      ]
    );

    if (result.length === 0) {
      throw new Error("Movie not found");
    }

    // Additional logic for genres, etc.

    await trx.commit();
    return result[0]; // Return updated movie
  } catch (error) {
    console.error("Error updating movie:", error);
    await trx.rollback();
    return null; // Ensure this is handled properly in your controller
  }
};



export default {
  addMovie,
  // getMovieByNameAndYear,
  getMovieIdByName,
  getMovieById,
  getMovies,
  deleteMovie,
  updateDailyRentalRateMovie,
  getMovieSuggestions,
  getTopThreeMovies,
  getMoviesWithPagination,
  searchMovies,
  getLeastRentedMovies,
  updateMovie,
};
