const PostCategories = require('../models/post-categories-model');
const Post = require('../models/post-model');
const Category = require('../models/category-model');
const DbHelper = require('../helpers/db-helper');
const { Op } = require('sequelize');

const createPostList = async (data) => {
  await DbHelper.createConnection();
 
  let categoryList;
  try {
    categoryList = await Category.findAll();
    const categoryNameList = categoryList.map(category => category.categoryName);
    const newCategoryNameSet = new Set(data.map(post => post.categories)
      .reduce((categories, currentCategory) => categories.concat(currentCategory))
      .map(category => category.categoryName)
      .filter(category => !categoryNameList.includes(category)));
    const newCategoryList = Array.from(newCategoryNameSet).map(item => {
      return {
        categoryName: item
      }
    });
    categoryList = await Category.bulkCreate(newCategoryList);
  } catch (error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while creating categories in database. ${error}`);
  }

  let postList;
  let newPostList;
  try {
    postList = await Post.findAll();
    const postLinkList = postList.map(post => post.link);
    const newPostLinkSet = new Set(data.map(post => post.link).filter(link => !postLinkList.includes(link)));
    newPostList = Array.from(newPostLinkSet)
      .filter(link => data.find(post => post.link === link))
      .map(link => data.find(post => post.link === link));
    postList = await Post.bulkCreate(newPostList);
  } catch (error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while creating posts in database. ${error.message}`);
  }

  if (newPostList.length > 0) {
    try {
      categoryList = await Category.findAll();
      const postCategories = [];
      newPostList.forEach(post => {
        postCategories.push(...post.categories.map(postCategory => {
          return {
            postId: postList.find(createdPost => post.link === createdPost.link).id,
            categoryId: categoryList.find(category => category.categoryName === postCategory.categoryName)?.id
          }
        }))
      });
      await PostCategories.bulkCreate(postCategories);
    } catch(error) {
      await DbHelper.closeConnection();
      throw new Error(`Error while creating post categories in database. ${error.message}`);
    }
  }

  await DbHelper.closeConnection();
}

const createPost = async (data) => {
  await DbHelper.createConnection();

  let post = await Post.findOne({ where: { link: data.link }});
  if (post) {
    await DbHelper.closeConnection();
    throw new Error('Post with such link has already existed.')
  }
 
  let categoryList;
  try {
    categoryList = await Category.findAll();
    const categoryNameList = categoryList.map(category => category.categoryName);
    const newCategoryNameSet = new Set(data.categories.map(category => category.categoryName).filter(category => !categoryNameList.includes(category)));
    const newCategoryList = Array.from(newCategoryNameSet).map(item => {
      return {
        categoryName: item
      }
    });
    categoryList = await Category.bulkCreate(newCategoryList);
  } catch (error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while creating categories in database. ${error}`);
  }

  try {
    post = await Post.create({
      title: data.title,
      link: data.link,
      description: data.description,
      pubDate: new Date(data.pubDate).toISOString(),
      dcCreator: data.dcCreator,
      guid: data.guid,
    });
  } catch (error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while creating posts in database. ${error.message}`);
  }

  try {
    categoryList = await Category.findAll();
    const postCategories = data.categories.map(postCategory => {
      return {
        postId: post.id,
        categoryId: categoryList.find(category => category.categoryName === postCategory.categoryName)?.id
      }
    });
    await PostCategories.bulkCreate(postCategories);
  } catch(error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while creating post categories in database. ${error.message}`);
  }

  post = await Post.findOne({
    where: { id: post.id },
    include: Category
  });

  await DbHelper.closeConnection();

  return post;
}

const updatePost = async (id, data) => {
  await DbHelper.createConnection();

  let post = await Post.findByPk(id);
  if (!post) {
    await DbHelper.closeConnection();
    throw new Error('Post does not exist.')
  }

  post = await Post.findOne({ 
    where: { link: data.link },
    include: Category
  });

  if (post && post.id != id) {
    await DbHelper.closeConnection();
    throw new Error('Post with such link has already existed.')
  }
 
  let categoryList;
  try {
    categoryList = await Category.findAll();
    const categoryNameList = categoryList.map(category => category.categoryName);
    const newCategoryNameSet = new Set(data.categories.map(category => category.categoryName).filter(category => !categoryNameList.includes(category)));
    const newCategoryList = Array.from(newCategoryNameSet).map(item => {
      return {
        categoryName: item
      }
    });
    categoryList = await Category.bulkCreate(newCategoryList);
  } catch (error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while creating categories in database. ${error}`);
  }

  let updatedPost;
  try {
    updatedPost = await Post.update({
      title: data.title,
      link: data.link,
      description: data.description,
      pubDate: new Date(data.pubDate).toISOString(),
      dcCreator: data.dcCreator,
      guid: data.guid,
    }, { where: { id }});
  } catch (error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while creating posts in database. ${error.message}`);
  }

  try {
    await PostCategories.destroy({ where: { postId: id } });
    categoryList = await Category.findAll();
    const postCategoriesList = await PostCategories.findAll();
    const postCategories = data.categories.map(postCategory => {
      return {
        postId: post.id,
        categoryId: categoryList.find(category => category.categoryName === postCategory.categoryName)?.id
      }
    });
    await PostCategories.bulkCreate(postCategories);
    const categoryIdList = [];
    post.categories.forEach(category => {
      if (!postCategoriesList.find(postCategory => postCategory.categoryId === category.id)) {
        categoryIdList.push(category.id);
      }
    });
    await Category.destroy({ where: { id: categoryIdList }});
  } catch(error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while creating post categories in database. ${error.message}`);
  }

  updatedPost = await Post.findOne({
    where: { id },
    include: Category
  });

  await DbHelper.closeConnection();

  return updatedPost;
}

const deletePost = async (id) => {
  await DbHelper.createConnection();

  const post = await Post.findByPk(id, { include: Category });

  if (!post) {
    await DbHelper.closeConnection();
    throw new Error('Post does not exist.');
  }

  try {
    await PostCategories.destroy({ where: { postId: id } });
  } catch (error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while deleting post categories in database. ${error.message}`);
  }

  try {
    await Post.destroy({ where: { id } });
  } catch (error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while deleting post in database. ${error.message}`);
  }

  try {
    const postCategoriesList = await PostCategories.findAll();
    const categoryIdList = [];
    post.categories.forEach(category => {
      if (!postCategoriesList.find(postCategory => postCategory.categoryId === category.id)) {
        categoryIdList.push(category.id);
      }
    });
    await Category.destroy({ where: { id: categoryIdList } });
  } catch (error) {
    await DbHelper.closeConnection();
    throw new Error(`Error while deleting categories in database. ${error.message}`);
  }

  await DbHelper.closeConnection();
}

const listPosts = async (params) => {
  postList = await Post.findAll({
    where: {
      title: {
        [Op.iLike]: `%${ params?.title || '' }%`
      }
    },
    order: [[ params?.sortingField || 'title', params?.sortingAsc === 'false' ? 'DESC' : 'ASC' ]],
    offset: (params?.page - 1) * 10 || 0,
    limit: 10,
    include: {
      model: Category,
      where: params?.categoryIdArray && {
        id: params.categoryIdArray
      },
    },
  });

  const allPostsCount = (await Post.findAll({
    where: {
      title: {
        [Op.iLike]: `%${ params?.title || '' }%`
      }
    },
    include: {
      model: Category,
      where: params?.categoryIdArray && {
        id: params.categoryIdArray
      },
    },
  })).length;

  return {
    postList,
    allPostsCount
  };
}

module.exports = {
  createPostList,
  createPost,
  updatePost,
  deletePost,
  listPosts,
};