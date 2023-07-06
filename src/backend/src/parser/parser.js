const { parentPort } = require('worker_threads');
const postService = require('../services/post-service');

const Parser = require('rss-parser');
const parser = new Parser();

const parseRss = () => {
  parser.parseURL('https://lifehacker.com/rss').then(feed => {
    const postList = feed.items.map(item => {
      return {
        title: item.title,
        link: item.link,
        description: item.content,
        pubDate: item.isoDate,
        dcCreator: item.creator,
        guid: item.guid,
        categories: item.categories.map(category => {
          return {
            categoryName: category
          };
        })
      }
    });
    postService.createPostList(postList);
  })
  .catch(error => {
    console.log(error.message);
  });
};

parentPort.on('message', () => {
  parseRss();
}); 