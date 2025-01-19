import knex_db from "../../db/db-config.js";
import Feedback from "../models/feedback.js";

const addFeedback = async (feedback) => {
  // const { userId, movieId, rating, comment, createdAt } = feedback;
  // try {
  //   const result = await knex_db.raw(
  //     "INSERT INTO feedback (user_id, movie_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?) RETURNING *",
  //     [userId, movieId, rating, comment, createdAt]
  //   );
  //   if (result.length === 0) {
  //     return null;
  //   }
  //   return new Feedback(
  //     result[0].user_id,
  //     result[0].movie_id,
  //     result[0].rating,
  //     result[0].comment,
  //     result[0].created_at
  //   );
  // } catch (error) {
  //   console.error(error);
  //   return null;
  // }
};

const getSingleFeedback = async (userId, movieId) => {
  //challenge 8.b remove following code

  //until here
  //return null;
};


const getAverageUserRatingForMovie = async (movieId) => {
  //challenge 4.a starts here
  //challenge 4.a ends here
};

const updateFeedback = async (feedback) => {
  const { userId, movieId, rating, comment, createdAt } = feedback;
  try {
    const result = await knex_db.raw(
      "UPDATE feedback SET rating=?, comment=?, created_at=? WHERE user_id=? AND movie_id=? RETURNING *",
      [rating, comment, createdAt, userId, movieId]
    );
    if (result.length === 0) {
      return null;
    }
    return new Feedback(
      result[0].user_id,
      result[0].movie_id,
      result[0].rating,
      result[0].comment,
      result[0].created_at
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getAllFeedbackForMovie = async (movieId) => {
  try {
    const result = await knex_db.raw(
      "SELECT * FROM feedback WHERE movie_id=?",
      [movieId]
    );
    if (result.length === 0) {
      return null;
    }
    return result.map((feedback) => {
      return new Feedback(
        feedback.user_id,
        feedback.movie_id,
        feedback.rating,
        feedback.comment,
        feedback.created_at
      );
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteFeedback = async (movieId, userId) => {
  try {
    console.log("feedback repo movieId============>",movieId,userId);
    await knex_db.raw(
      "DELETE FROM feedback WHERE movie_id=? AND user_id=?",
      [movieId, userId]
      
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}


export default {
  addFeedback,
  getSingleFeedback,
  getAverageUserRatingForMovie,
  updateFeedback,
  getAllFeedbackForMovie,
  deleteFeedback
};
