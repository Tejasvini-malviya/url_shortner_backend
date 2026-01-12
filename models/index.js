const sequelize = require("../database");
const User = require("./users");
const Url = require("./Url");

// Define Associations
User.hasMany(Url, { foreignKey: "userId" });
Url.belongsTo(User, { foreignKey: "userId" });

module.exports = {
    sequelize,
    User,
    Url,
};
