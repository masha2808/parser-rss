const postService = require('../services/post-service');
const { postSchema } = require('../schemas/post-schema');

const createPost = async (req, res) => {
  try {
    const data = req.body;
    await postSchema.validateAsync(data);
    const post = await postService.createPost(data);
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
}

const updatePost = async (req, res) => {
  try {
    const data = req.body;
    await postSchema.validateAsync(data);
    const post = await postService.updatePost(req.params.id, data);
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
}

const deletePost = async (req, res) => {
  try {
    await postService.deletePost(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
}

const listPosts = async (req, res) => {
  try {
    const postList = await postService.listPosts(req.query);
    res.status(200).send(postList);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  listPosts
}