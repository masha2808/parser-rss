import React, { useState, useEffect, useContext } from "react";
import PostListContext from "./post-list-context";
import AlertContext from "../../alert/context/alert-context";
import { listPosts, deletePost, createPost, updatePost } from "../../../services/post-service";

const PostListLoader = (props) => {
  const [ data, setData ] = useState(null);

  const alert = useContext(AlertContext);

  const postList = {
    data,
    listPosts: (params) => {
      listPosts(localStorage.getItem("jwtToken"), params)
        .then(response => {
          setData(response.data);
        });
    },
    deletePost: (id, params) => {
      deletePost(localStorage.getItem("jwtToken"), id)
        .then(() => {
          alert?.showAlertMessage("Deleted successfully", true);
          listPosts(localStorage.getItem("jwtToken"), params)
          .then(response => {
            setData(response.data);
          });
        })
        .catch((e) => {
          alert?.showAlertMessage(e.response.data.message, false);
        });
    },
    createPost: (data, params, handleClose) => {
      createPost(localStorage.getItem("jwtToken"), data)
        .then(() => {
          alert?.showAlertMessage("Created successfully", true);
          handleClose();
          listPosts(localStorage.getItem("jwtToken"), params)
          .then(response => {
            setData(response.data);
          });
        })
        .catch((e) => {
          alert?.showAlertMessage(e.response.data.message, false);
        });
    },
    updatePost: (id, data, params, handleClose) => {
      updatePost(localStorage.getItem("jwtToken"), id, data)
        .then(() => {
          alert?.showAlertMessage("Updated successfully", true);
          handleClose();
          listPosts(localStorage.getItem("jwtToken"), params)
          .then(response => {
            setData(response.data);
          });
        })
        .catch((e) => {
          alert?.showAlertMessage(e.response.data.message, false);
        });
    }
  };

  async function setInitialValue() {
    await postList.listPosts();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <PostListContext.Provider value={postList}>
      { props.children }
    </PostListContext.Provider>
  );
};

export default PostListLoader;
