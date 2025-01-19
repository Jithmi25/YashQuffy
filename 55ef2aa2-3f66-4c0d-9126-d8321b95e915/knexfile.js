import path from "path";
let __dirname = "";

var config = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./main.sqlite3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "./db/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "./db/seeds"),
    },
  },

  test: {
    client: "sqlite3",
    connection: ":memory:",
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, "./db/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "./tests/seeds"),
    },
  },
};

export default config;
