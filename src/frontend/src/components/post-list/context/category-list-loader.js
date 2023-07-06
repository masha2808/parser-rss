import React, { useState, useEffect } from "react";
import CategoryListContext from "./category-list-context";
import { listCategories } from "../../../services/category-service";

const CategoryListLoader = (props) => {
  const [ data, setData ] = useState(null);

  const categoryList = {
    data,
    listCategories: () => {
      listCategories(localStorage.getItem("jwtToken"))
        .then(response => {
          setData(response.data);
        });
    }
  };

  async function setInitialValue() {
    await categoryList.listCategories();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <CategoryListContext.Provider value={categoryList}>
      { props.children }
    </CategoryListContext.Provider>
  );
};

export default CategoryListLoader;
