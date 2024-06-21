import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); 

const sequelize = new Sequelize("postgres://rinshad:VQUQcwBeJwSKhvjHfznFMxfXR6OmnLjN@dpg-cpq85c4s1f4s73cgehf0-a/bitespeed_7rs7"!,{
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
