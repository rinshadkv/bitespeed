import { Sequelize } from "sequelize";

const sequelize = new Sequelize("bitespeed", "postgres", "root", {
  host: "localhost",
  dialect: "postgres",
});

export default sequelize;
