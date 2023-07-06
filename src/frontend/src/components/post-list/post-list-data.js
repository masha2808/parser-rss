import React, { useContext, useEffect, useState } from "react";
import Parser from "html-react-parser";
import { Grid, TextField, Button, CircularProgress, Checkbox, FormLabel, Typography, IconButton, Select, MenuItem, Pagination } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import dayjs from "dayjs";
import PostListContext from "./context/post-list-context";
import CategoryListContext from "./context/category-list-context";
import PostModal from "../forms/post";

const PostListData = () => {
  const [openedPostModal, setOpenedPostModal] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [post, setPost] = useState();
  const [categoryIdArray, setCategoryIdArray] = useState([]);
  const [filterStyle, setFilterStyle] = useState({});
  const [sortingField, setSortingField] = useState("title");
  const [sortingAsc, setSortingAsc] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState();

  const postList = useContext(PostListContext);
  const categoryList = useContext(CategoryListContext);

  useEffect(() => {
    const count = Math.ceil(postList?.data?.allPostsCount / 10);
    if (count !== pageCount) {
      setPageCount(count);
    }
    if (count < page && count > 0) {
      setPage(count); 
      const params = {
        page: count,
        title,
        sortingField,
        sortingAsc,
        categoryIdArray
      };
      postList.listPosts(params);
      window.scrollTo(0, 0);     
    } else if (count === 0) {
      setPage(1);
      window.scrollTo(0, 0);
    }
  }, [postList?.data?.postList]);

  const handleCategoryChange = (event) => {
    let idArray = [];
    if (categoryIdArray.includes(Number(event.target.value))) {
      idArray = categoryIdArray.filter(item => item !== Number(event.target.value));
    } else {
      idArray = [...categoryIdArray, Number(event.target.value)]
    }
    setCategoryIdArray(idArray);
    const params = {
      page: 1,
      title: searchValue,
      sortingField,
      sortingAsc,
      categoryIdArray: idArray
    };
    postList.listPosts(params);
  };

  const handleFilterClick = () => {
    setFilterStyle({ display: "block" });
  };

  const handleCloseClick = () => {
    setFilterStyle({});
  };

  const handleSortingChange = (event) => {
    setSortingField(event.target.value);
    const params = {
      page: 1,
      title,
      sortingField: event.target.value,
      sortingAsc,
      categoryIdArray
    };
    postList.listPosts(params);
  };

  const handleSortingAsc = () => {
    setSortingAsc(!sortingAsc);
    const params = {
      page: 1,
      title,
      sortingField,
      sortingAsc: !sortingAsc,
      categoryIdArray
    };
    postList.listPosts(params);
  };

  const handleCreate = () => {
    setIsUpdated(false);
    setOpenedPostModal(true);
  };

  const handleUpdate = (post) => {
    setIsUpdated(true);
    setOpenedPostModal(true);
    setPost(post);
  };

  const handleSearch = () => {
    setTitle(searchValue);
    setPage(1);
    const params = {
      page: 1,
      title: searchValue,
      sortingField,
      sortingAsc,
      categoryIdArray
    };
    postList.listPosts(params);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = (id) => {
    const params = {
      page,
      title,
      sortingField,
      sortingAsc,
      categoryIdArray
    };
    postList.deletePost(id, params);
    categoryList.listCategories();
  }

  const handlePageChange = (event, value) => {
    setPage(value);
    const params = {
      page: value,
      title,
      sortingField,
      sortingAsc,
      categoryIdArray
    };
    postList.listPosts(params);
    window.scrollTo(0, 0);
  };

  return (
    <div className="post-data">
      <div className="post-filters" style={filterStyle}>
        <Button variant="contained" className="filter-button" onClick={handleCloseClick}>Close</Button>
        {categoryList?.data?.cityList && <Typography variant="h5" fontWeight="bold">Categories</Typography>}
        {categoryList?.data?.categoryList?.map((category) =>
          <div key={category.id}>
            <Checkbox id={`category${category.id}`} value={category.id} checked={categoryIdArray.includes(category.id)} onChange={handleCategoryChange} className="category-checkbox" />
            <FormLabel>{category.categoryName}</FormLabel>
          </div>
        )}
      </div>
      {postList?.data?.postList ?
        <div className="post-list">
          <div className="action-bar">
            <TextField
              id="title"
              placeholder="Enter title"
              type="text"
              variant="standard"
              className="search-field"
              onChange={handleSearchChange}
            />
            <Button id="save" variant="contained" onClick={handleSearch} className="button">Search</Button>
          </div>
          <Button id="save" variant="outlined" onClick={handleCreate} className="create-button">Create post</Button>
          <Button variant="contained" className="filter-button" onClick={handleFilterClick}>Filters</Button>
          <div className="sorting">
            <FormLabel htmlFor="sorting">Sort by</FormLabel>
            <Select
              id="sorting"
              label="Сортування"
              variant="standard"
              value={sortingField}
              defaultValue={"title"}
              onChange={handleSortingChange}
            >
              <MenuItem value={"title"}>
                Title
              </MenuItem>
              <MenuItem value={"pubDate"}>
                pubDate
              </MenuItem>
            </Select>
            <IconButton onClick={handleSortingAsc}>
              {sortingAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            </IconButton>
          </div>
          <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, md: 8 }}>
            {postList.data.postList.length > 0 ? postList.data.postList.map((post) => (
              <Grid item xs={4} md={4} className="post-grid" key={post.id}>
                <div className="post">
                  <Typography variant="h6" fontWeight="bold">{post.title}</Typography>
                  <Typography variant="body1"><b>description:</b></Typography>
                  <div>{Parser(post.description)}</div>
                  <Typography variant="body1"><b>pubDate:</b> {dayjs(post.pubDate).format("DD.MM.YYYY HH:mm:ss")}</Typography>
                  <Typography variant="body1"><b>dcCreator:</b> {post.dcCreator}</Typography>
                  <Typography variant="body1"><b>guid:</b> {post.guid}</Typography>
                  <Typography variant="body1"><b>link:</b> <a href={post.link}>{post.link}</a>/</Typography>
                  <Typography variant="body1"><b>categories:</b> {post.categories.map(category => category.categoryName).join(", ")}</Typography>
                  <div className="post-list-buttons">
                    <Button variant="contained" className="post-list-button" onClick={() => handleUpdate(post)}>Update</Button>
                    <Button variant="outlined" className="post-list-button" onClick={() => handleDelete(post.id)}>Delete</Button>
                  </div>
                </div>
              </Grid>
            )) : 
            <Typography variant="h6">Posts not found</Typography> }
          </Grid>
          { (page && pageCount && pageCount > 0 && postList.data.postList.length > 0) && <div className="pagination">
            <Pagination page={page} count={pageCount} color="primary" onChange={handlePageChange} />
          </div> }
          { openedPostModal && <PostModal isUpdated={isUpdated} isOpened={openedPostModal} setIsOpened={setOpenedPostModal} post={post} /> }
        </div> :
        <div className="progress">
          <CircularProgress />
        </div>}
    </div>
  );
};

export default PostListData;
