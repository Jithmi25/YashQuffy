import knex_db from "../../db/db-config.js";
import Rental from "../models/rental.js";

import Movie from "../models/movie.js";
import movieRepository from "./movieRepository.js";

//challenge 5.a
const addRental = async (rental) => {
  const { id, userId, movieId, rentalFee, daysRented, rentedAt } = rental;
  let trx;
  try {
    trx = await knex_db.transaction();
    await trx.raw("PRAGMA foreign_keys = ON");

    const result = await trx.raw(
      "INSERT INTO rental (id, user_id, movie_id, rental_fee, days_rented, rented_at) VALUES (?,?,?,?,?,?) RETURNING id, movie_id, user_id, rental_fee, days_rented, rented_at",
      [id, userId, movieId, rentalFee, daysRented, rentedAt]
    );

    if (result.length === 0) {
      throw new Error("Error adding rental");
    }

    const updatedUser = await trx.raw(
      `UPDATE user SET balance = balance - ? WHERE id = ? RETURNING *`,
      [rentalFee, userId]
    );

    if (updatedUser.length === 0) {
      throw new Error("Error updating user balance");
    }

    await trx.commit();
    return new Rental(
      result[0].id,
      result[0].user_id,
      result[0].movie_id,
      result[0].rental_fee,
      result[0].days_rented,
      result[0].rented_at
    );
  } catch (error) {
    await trx.rollback();
    console.log(error);
    return null;
  }
};

const getRentalByMovieId = async (movieId) => {
  try {
    const result = await knex_db.raw(
      "SELECT * FROM rental WHERE movie_id = ?",
      [movieId]
    );
    if (result.length === 0) {
      return null;
    }
    return result.map((rental) => {
      return new Rental(
        rental.id,
        rental.user_id,
        rental.movie_id,
        rental.rental_fee,
        rental.days_rented,
        rental.rented_at
      );
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getRentalByUserId = async (userId) => {
  const rentals = [];
  try {
    const result = await knex_db.raw(
      `SELECT * FROM rental 
      WHERE user_id = ?`,
      [userId]
    );

    if (result.length === 0) {
      return null;
    }

    return result.map((rental) => {
      return new Rental(
        rental.id,
        rental.user_id,
        rental.movie_id,
        rental.rental_fee,
        rental.days_rented,
        rental.rented_at
      );
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteRental = async (id) => {
  let data;
  await knex_db
    .raw(
      `
        DELETE FROM rental WHERE id = ? RETURNING *
        `,
      [id]
    )
    .then((result) => {
      data = new Rental(
        result[0].id,
        result[0].movie_id,
        result[0].user_id,
        result[0].rental_fee,
        result[0].days_rented,
        result[0].rented_at
      );
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
};

const getAllRentals = async () => {
  // console.log("getAllRentals");
  let data;
  try {
    await knex_db
      .raw(
        `
      SELECT * FROM rental
      `
      )
      .then((result) => {
        data = result.map((rental) => {
          return new Rental(
            rental.id,
            rental.user_id,
            rental.movie_id,
            rental.rental_fee,
            rental.days_rented,
            rental.rented_at
          );
        });
      })
      .catch((error) => {
        console.log(error);
      });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateRental = async (rental) => {
  try {
    const result = await knex_db.raw(
      `UPDATE rental 
      SET user_id = ?, movie_id = ?, rental_fee = ?, days_rented = ?, rented_at = ?
      WHERE id = ? RETURNING *`,
      [
        rental.userId,
        rental.movieId,
        rental.rentalFee,
        rental.daysRented,
        rental.rentedAt,
        rental.id,
      ]
    );

    if (result.length === 0) {
      return null;
    }

    return new Rental(
      result[0].id,
      result[0].user_id,
      result[0].movie_id,
      result[0].rental_fee,
      result[0].days_rented,
      result[0].rented_at
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

//challenge 5.a
const getRentalByUserIdAndMovieId = async (userId, movieId) => {
  try {
    const result = await knex_db.raw(
      "SELECT * FROM rental WHERE user_id = ? AND movie_id = ?",
      [userId, movieId]
    );

    if (result.length === 0) {
      return null;
    }
    return result.map((rental) => {
      return new Rental(
        rental.id,
        rental.user_id,
        rental.movie_id,
        rental.rental_fee,
        rental.days_rented,
        rental.rented_at
      );
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const giftRental = async (
  senderId,
  rental,
  newRentalFee,
  isLastRentalActive
) => {
  const { id, userId, movieId, rentalFee, daysRented, rentedAt } = rental;
  let trx;
  try {
    trx = await knex_db.transaction();
    await trx.raw("PRAGMA foreign_keys = ON");

    if (isLastRentalActive) {
      const result = await trx.raw(
        `UPDATE rental 
        SET user_id = ?, movie_id = ?, rental_fee = ?, days_rented = ?, rented_at = ?
        WHERE id = ? RETURNING *`,
        [userId, movieId, rentalFee, daysRented, rentedAt, id]
      );
      const updatedUser = await trx.raw(
        `UPDATE user SET balance = balance - ? WHERE id = ? RETURNING *`,
        [newRentalFee, senderId]
      );
      await trx.commit();
      return new Rental(
        result[0].id,
        result[0].user_id,
        result[0].movie_id,
        result[0].rental_fee,
        result[0].days_rented,
        result[0].rented_at
      );
    } else {
      const result = await trx.raw(
        "INSERT INTO rental (id, user_id, movie_id, rental_fee, days_rented, rented_at) VALUES (?,?,?,?,?,?) RETURNING id, movie_id, user_id, rental_fee, days_rented, rented_at",
        [id, userId, movieId, rentalFee, daysRented, rentedAt]
      );
      const updatedUser = await trx.raw(
        `UPDATE user SET balance = balance - ? WHERE id = ? RETURNING *`,
        [rentalFee, senderId]
      );
      await trx.commit();
      return new Rental(
        result[0].id,
        result[0].user_id,
        result[0].movie_id,
        result[0].rental_fee,
        result[0].days_rented,
        result[0].rented_at
      );
    }
  } catch (error) {
    await trx.rollback();
    console.log(error);
    return null;
  }
};

export default {
  addRental,
  getRentalByMovieId,
  getRentalByUserId,
  getAllRentals,
  deleteRental,
  updateRental,
  getRentalByUserIdAndMovieId,
  giftRental,
};
