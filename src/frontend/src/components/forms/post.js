import React, { useContext, useEffect, useState } from "react";
import { Typography, TextField, Modal, Button, FormLabel, IconButton, Icon } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";
import PostListContext from "../post-list/context/post-list-context";
import CategoryListContext from "../post-list/context/category-list-context";

const PostModal = (props) => {
  const [pubDate, setPubDate] = useState();
  const [categoryArray, setCategoryArray] = useState([]);
  const [categoryErrorMessage, setCategoryErrorMessage] = useState("");

  useEffect(() => {
    if (props.post) {
      setPubDate(dayjs(new Date(props.post?.pubDate)));
      setCategoryArray(props.post.categories.map((category, index) => {
        return {
          id: index,
          name: category.categoryName
        }
      }));
    } else {
      setCategoryArray([{ id: 0 }]);
    }
  }, []);

  const postList = useContext(PostListContext);
  const categoryList = useContext(CategoryListContext);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleAdd = () => {
    setCategoryArray([...categoryArray, {
      id: categoryArray.at(-1).id + 1
    }]);
  }

  const handleDelete = (id) => {
    setCategoryArray(categoryArray.filter(category => category.id !== id));
  }

  const handleCategoryChange = (event, id) => {
    setCategoryArray(categoryArray.map(category => category.id === id ? { id: category.id, name: event.target.value } : category ));
  }

  const handlePubDateChange = (date) => {
    setPubDate(date);
  }

  const validationSchema = Yup.object().shape({
    description: Yup.string().required(),
    dcCreator: Yup.string().required(),
    guid: Yup.string().required(),
    link: Yup.string().required(),
    title: Yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    if (categoryArray.length === 1 && !categoryArray[0].name) {
      setCategoryErrorMessage("Category is required.");
      return;
    } else if (categoryErrorMessage) {
      setCategoryErrorMessage("");
    }
    const postData = {
      pubDate: dayjs(pubDate).format("YYYY-MM-DDTHH:mm"),
      description: data.description,
      dcCreator: data.dcCreator,
      guid: data.guid,
      link: data.link,
      title: data.title,
      categories: categoryArray.map(category => {
        return {
          categoryName: category.name
        }
      })
    };
    if (props.isUpdated) {
      postList?.updatePost(props.post.id, postData, props.params, handleClose);
    } else {
      postList?.createPost(postData, props.params, handleClose);
    }
    categoryList.listCategories();
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="modal">
          <IconButton onClick={handleClose} className="close-icon">
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" className="title">{props.isUpdated ? "Update" : "Create"} post</Typography>
          {props.task && <Typography variant="h5" className="title">{`№ ${props.post.id}`}</Typography>}
          <div className="form-data">
          <div key="title">
              <TextField
                id="title"
                label="title"
                type="text"
                size="small"
                variant="standard"
                defaultValue={props?.post?.title}
                required
                className="text-field"
                {...register("title")}
                error={errors.title ? true : false}
              />
              <Typography variant="body2" color="error" fontSize={12}>
                {errors.title?.message?.toString()}
              </Typography>
            </div>
            <div key="pubDate">
              <DateTimePicker
                label="pubDate"
                slotProps={{ textField: {
                  size: "small",
                  variant: "standard",
                  id: "pubDate",
                  required: true
                }} }
                onChange={handlePubDateChange}
                value={pubDate}
                className="text-field"
              />
              <Typography variant="body2" color="error" fontSize={12}>
                {errors.pubDate?.message?.toString()}
              </Typography>
            </div>
            <div key="dcCreator">
              <TextField
                id="dcCreator"
                label="dcCreator"
                type="text"
                size="small"
                variant="standard"
                defaultValue={props?.post?.dcCreator}
                required
                className="text-field"
                {...register("dcCreator")}
                error={errors.dcCreator ? true : false}
              />
              <Typography variant="body2" color="error" fontSize={12}>
                {errors.dcCreator?.message?.toString()}
              </Typography>
            </div>
            <div key="guid">
              <TextField
                id="guid"
                label="guid"
                type="text"
                size="small"
                variant="standard"
                defaultValue={props?.post?.guid}
                required
                className="text-field"
                {...register("guid")}
                error={errors.guid ? true : false}
              />
              <Typography variant="body2" color="error" fontSize={12}>
                {errors.guid?.message?.toString()}
              </Typography>
            </div>
            <div key="link">
              <TextField
                id="link"
                label="link"
                type="text"
                size="small"
                variant="standard"
                defaultValue={props?.post?.link}
                required
                className="text-field"
                {...register("link")}
                error={errors.link ? true : false}
              />
              <Typography variant="body2" color="error" fontSize={12}>
                {errors.link?.message?.toString()}
              </Typography>
            </div>
            <div key="description">
              <TextField
                id="description"
                label="description"
                type="text"
                size="small"
                variant="outlined"
                defaultValue={props.post?.description}
                multiline
                minRows={3}
                maxRows={10}
                required
                {...register("description")}
                error={errors.description ? true : false}
                className="multiline-text-field"
              />
              <Typography variant="body2" color="error" fontSize={12}>
                {errors.lastName?.message?.toString()}
              </Typography>
            </div>
            <div key="categories">
              <FormLabel>Categories</FormLabel>
              {categoryArray.map(category => (
                <div className="category" key={category.id}>
                  <TextField
                    hiddenLabel
                    name={`category-${category.id}`}
                    variant="standard"
                    size="small"
                    className="text-field"
                    defaultValue={category.name}
                    onChange={(event) => handleCategoryChange(event, category.id)}
                    required
                  />
                  <IconButton color="primary" disabled={categoryArray.length === 1} onClick={() => handleDelete(category.id)}>
                    <Icon size="large">
                      <DeleteIcon />
                    </Icon>
                  </IconButton>
                </div>
              ))}
              <div>
                <Typography variant="body2" color="error" fontSize={12}>
                  {categoryErrorMessage}
                </Typography>
              </div>
              <IconButton color="primary" onClick={handleAdd}>
                <Icon size="large">
                  <AddIcon />
                </Icon>
              </IconButton>
            </div>
          </div>
          <div className="modal-buttons">
            <Button id="create" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Save</Button>
          </div>
        </div>
      </LocalizationProvider>
    </Modal>
  );
};

export default PostModal;