const { DataTypes } = require("sequelize");
const Category = require('./category-model');
const DbHelper = require('../helpers/db-helper');

const sequelize = DbHelper.getSequalize();

const Post = sequelize.define("post", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  link: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pubDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dcCreator: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  guid: {
    type: DataTypes.TEXT,
    allowNull: false
  },
},
{
  tableName: 'posts',
});

Post.belongsToMany(Category, { through: 'postCategories' });
Category.belongsToMany(Post, { through: 'postCategories' });

(async () => {
  await sequelize.sync();
})();

module.exports = Post;