import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostListData from "./post-list-data";
import PostListLoader from "./context/post-list-loader";
import CategoryListLoader from "./context/category-list-loader";

const PostList = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.isUserAuthorized) {
      navigate("/login");
    }
  }, []);

  return (
    <>
    { props.isUserAuthorized &&
    <PostListLoader>
      <CategoryListLoader>
        <PostListData />
      </CategoryListLoader>
    </PostListLoader> }
    </>
  ); 
};

export default PostList;