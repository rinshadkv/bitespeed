"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('bitespeed', 'yourusername', 'yourpassword', {
    host: 'localhost',
    dialect: 'postgres'
});
class Contact extends sequelize_1.Model {
}
Contact.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    linkedId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'contacts',
            key: 'id'
        }
    },
    linkPrecedence: {
        type: sequelize_1.DataTypes.ENUM('primary', 'secondary'),
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'contacts',
    timestamps: true, // Enable automatic management of createdAt and updatedAt fields
    paranoid: true // Enable soft deletes (deletedAt field)
});
sequelize.sync();
exports.default = Contact;
