import Category from "../../../components/category/Category";
import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import AddCategory from "@/components/Modal/Add-Category";
import Head from "next/head";
import { getServerSideProps } from "..";

function CategoryPage({ shopID }) {
  const router = useRouter();

  const { shopData } = shopID;
  const contents = shopData.shopCategories;

  const result = Object.keys(contents).map((key, index) => {
    return {
      key: key,
      value: contents[key],
    };
  });

  const categNamesList = Object.keys(contents).map(key => (contents[key].categoryName))
  const upperCategNames = categNamesList.map(name => name.toUpperCase());

  const categoryAmount = Object.keys(shopID.shopData.shopCategories).length

  const [addCateg, setAddCateg] = useState(false)
  const [defaultValues, setDefaultValues] = useState(["", "", ""])

  function addCategHandler(event) {
    event.preventDefault()
    event.stopPropagation()
    setAddCateg(!addCateg)
  }

  function editCategHandler(data) {
    setDefaultValues([data[0], data[1], data[2]])
  }

  function defClearer(){
    setDefaultValues(["", "", ""])
  }

  async function completeForm(formdata) {

    const response = await fetch(
      `../../api/new-category?martid=${router.query.shopid}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata)
      }
    );
    const data = await response.json();
  }
  
  async function editForm(formdata, key) {

    const chosenCateg = formdata.categoryName

    const response = await fetch(
      `../../api/new-category?martid=${router.query.shopid}&categoryname=${key}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata)
      }
    );
    const data = await response.json();
  }

  async function deleteForm(key) {

    const response = await fetch(
      `../../api/new-category?martid=${router.query.shopid}&categoryname=${key}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(formdata)
      }
    );
    const data = await response.json();
  }

  if (categoryAmount > 0) {
  return (

    <Fragment>
    <Head>
      <title>Categories</title>
    </Head>
      <AddCategory modalStatus={addCateg} disable={addCategHandler} finish={completeForm} edit={editForm} deletion={deleteForm} total={categoryAmount} defs={defaultValues} clear={defClearer} categIndexes={contents} list={upperCategNames}></AddCategory>
      <span className="page-heading">
        <div className="heading-icon-dropshadow">
          <div className="heading-icon-category svg-color">&nbsp;</div>
        </div>
        <h1 className="heading-primary no-margin">Categories</h1>
        <button onClick={addCategHandler} className="add-categ-init heading-tertiary">
          <div className="heading-icon-plus svg-color">&nbsp;</div>Add Category</button>
      </span>

      <section className="category-container">
        {result.map((categ, index) => {
          return (
            <Category
              items={categ.value}
              id={router.query.shopid}
              key={index}
              state={addCateg}
              length={result.length}
              edit={addCategHandler}
              edit2={editCategHandler}
              categIndex = {index}
            ></Category>
          );
        })}
      </section>

    </Fragment>
  );
      } else {
        return <Fragment>
          <AddCategory modalStatus={addCateg} disable={addCategHandler} finish={completeForm} edit={editForm} deletion={deleteForm} total={categoryAmount} defs={defaultValues} clear={defClearer} categIndexes={contents} list={upperCategNames}></AddCategory>
      <span className="page-heading">
        <div className="heading-icon-dropshadow">
          <div className="heading-icon-category svg-color">&nbsp;</div>
        </div>
        <h1 className="heading-primary no-margin">Categories</h1>
        <button onClick={addCategHandler} className="heading-tertiary add-categ-init">
          <div className="heading-icon-plus svg-color">&nbsp;</div>Add Category</button>
      </span>
        <div className="empty-contents">
        <div className="empty-logo svg-color">&nbsp;</div>
        <h2 className="empty-text">There seems to be no categories yet</h2>
        </div>
        </Fragment>
      }
}

export default CategoryPage;

export {getServerSideProps}