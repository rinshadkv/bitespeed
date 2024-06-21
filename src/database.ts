import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); 

const sequelize = new Sequelize("postgres://default:wd0Y6PBrxnHL@ep-old-morning-a13zws21.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require"!,{
  dialect: "postgres",
  dialectModule: require('pg'),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
