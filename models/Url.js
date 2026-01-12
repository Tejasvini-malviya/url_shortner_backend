const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Url = sequelize.define("Url", {
	originalUrl: {
		// Use TEXT so very long URLs (like Google search links) are stored without errors
		type: DataTypes.TEXT,
		allowNull: false,
	},
	shortCode: {
		type: DataTypes.TEXT,
		allowNull: false,
		unique: true,
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: true, // Allow null for existing records

	},
});

module.exports = Url;
