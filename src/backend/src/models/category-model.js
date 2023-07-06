const { DataTypes } = require("sequelize");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const Category = sequelize.define("category", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  categoryName: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  }
},
{
  tableName: 'categories',
});

(async () => {
  await sequelize.sync();
})();

module.exports = Category;