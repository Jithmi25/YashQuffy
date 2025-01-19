import knex_db from "../../db/db-config.js";
import User from "../models/user.js";
import error from "../middleware/error.js";

const createUser = async (user) => {
  const { id, firstName, lastName, email, password } = user;
  try {
    const result = await knex_db.raw(
      "INSERT INTO user (id, first_name, last_name, email, password) VALUES (?,?,?,?,?) RETURNING id",
      [id, firstName, lastName, email, password]
    );

    return result[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserByEmail = async (email) => {
  try {
    const result = await knex_db.raw("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    if (result.length > 0) {
      return new User(
        result[0].id,

        result[0].email,

        result[0].first_name,

        result[0].last_name,

        result[0].password,

        result[0].balance,

        result[0].is_admin
      );
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getUserById = async (id) => {
  try {
    const response = await knex_db.raw(
      `
        SELECT * FROM user WHERE id = ?
        `,
      [id]
    );

    if (response.length === 0) return null;

    return new User(
      response[0].id,
      response[0].email,
      response[0].first_name,
      response[0].last_name,
      "",
      response[0].balance,
      response[0].is_admin
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getAllUsers = async () => {
  let data;
  try {
    await knex_db
      .raw(
        `
      SELECT * FROM user
      `
      )
      .then((result) => {
        data = result.map((user) => {
          return new User(
            user.id,
            user.email,
            user.first_name,
            user.last_name,
            "",
            user.balance,
            user.is_admin
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

const updateUser = async (user) => {
  let data;
  await knex_db
    .raw(
      `
        UPDATE user 
        SET first_name = ?, last_name = ?, email = ?, balance = ?, is_admin = ? 
        WHERE id = ? RETURNING *
        `,
      [
        user.firstName,
        user.lastName,
        user.email,
        user.balance,
        user.isAdmin,
        user.id,
      ]
    )
    .then((result) => {
      data = result.map((user) => {
        return new User(
          user.id,
          user.email,
          user.first_name,
          user.last_name,
          "",
          user.balance,
          user.is_admin
        );
      });
    })
    .catch((err) => {
      console.log(err);
      error(err);
    });
  return data;
};

const updateUserBalance = async (userId, amount) => {
  try {
    const response = await knex_db.raw(
      `UPDATE user SET balance = ? WHERE id = ? RETURNING *`,
      [amount, userId]
    );
    if (response.length === 0) return null;
    return new User(
      response[0].id,
      response[0].email,
      response[0].first_name,
      response[0].last_name,
      "",
      response[0].balance,
      response[0].is_admin
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteUser = async (id) => {
  let data;
  await knex_db
    .raw(
      `
        DELETE FROM user WHERE id = ? RETURNING *
        `,
      [id]
    )
    .then((result) => {
      data = new User(
        result[0].id,
        result[0].email,
        result[0].first_name,
        result[0].last_name,
        "",
        result[0].balance,
        result[0].is_admin
      );
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
};


export default {
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUser,
  updateUserBalance,
  deleteUser,
};
