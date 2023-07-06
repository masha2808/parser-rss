const { DataTypes } = require("sequelize");
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const PostCategories = sequelize.define('postCategories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},
{
  tableName: 'postCategories',
});

(async () => {
  await sequelize.sync();
})();


module.exports = PostCategories;
