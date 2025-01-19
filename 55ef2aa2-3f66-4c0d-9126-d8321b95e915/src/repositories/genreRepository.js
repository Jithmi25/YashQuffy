import knex_db from "../../db/db-config.js";
import Genre from "../models/genre.js";

const addGenre = async (genre) => {
  const { id, name } = genre;
  try {
    const result = await knex_db.raw(
      "INSERT INTO genre (id,name) VALUES (?,?) RETURNING *",
      [id, name]
    );
    return new Genre(result[0].id, result[0].name);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getAllGenres = async () => {
  try {
    const result = await knex_db.raw("SELECT * FROM genre");
    return result.map((genre) => {
      return new Genre(genre.id, genre.name);
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getGenreById = async (id) => {
  try {
    const result = await knex_db.raw("SELECT * FROM genre WHERE id = ?", [id]);
    return new Genre(result[0].id, result[0].name);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getGenreByName = async (name) => {
  try {
    const result = await knex_db.raw("SELECT * FROM genre WHERE name=?", [
      name,
    ]);
    if (result.length > 0) {
      return new Genre(result[0].id, result[0].name);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateGenre = async (genre) => {
  const { id, name } = genre;
  try {
    const result = await knex_db.raw(
      "UPDATE genre SET name = ? WHERE id = ? RETURNING *",
      [name, id]
    );
    return new Genre(result[0].id, result[0].name);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteGenre = async (id) => {
  try {
    console.log("from delete genre");
    
    // Execute the delete query and get the result
    const result = await knex_db.raw(
      "DELETE FROM genre WHERE id = ? RETURNING id",
      [id]
    );

    // Check if any row was deleted
    if (result[0].length === 0) {
      return 0; // No rows affected
    }
    
    return result[0][0].id; // Return the deleted genre ID
  } catch (error) {
    console.error("Error deleting genre:", error);
    return null; // Return null on error
  }
};




export default {
  addGenre,
  getAllGenres,
  getGenreById,
  getGenreByName,
  updateGenre,
  deleteGenre,
};
