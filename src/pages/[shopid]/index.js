import { Fragment, useState, useEffect } from "react"
import HomepageButton from "../../components/homepage/Homepage-Button"
import HomepageButtonBlank from "@/components/homepage/Homepage-Button-Blank"
import Link from "next/link"
import { useRouter } from "next/router"
import Head from "next/head"
import { getServerSideProps } from "@/utilities/serversideProps"
// import { css } from "styled-jsx/css";


function HomePage({ shopID }){
    const router = useRouter();
    const { shopid } = router.query;
    const shopData = shopID.shopData;
    // console.log("shopData", shopData)

    let mode = ""
    if (shopData.shopDesigns.defaultMode){mode = "/light"} else {
        mode = "/dark"
    }

    const colorState = shopData.shopDesigns.defaultMode

    let defaultColors = {}

    if (colorState){
        defaultColors = shopData.shopDesigns.lightDesign
    } else {defaultColors = shopData.shopDesigns.darkDesign}

    // console.log(defaultColors)    

    return <Fragment>
<Head>
  <title>Dashboard</title>
</Head>
        <h1 className="heading-primary">Dashboard</h1>
        <main className="maincontainer">
            <HomepageButton color={defaultColors} title={"Add and edit categories, products, and variations"} item="home-category" label="Categories & Products" direction="categories"></HomepageButton>
            <HomepageButton color={defaultColors} item="home-ongoing" label="Ongoing Sales" direction="ongoing"></HomepageButton>
            <HomepageButton color={defaultColors} title={"Set about page, descriptions, footers, and details of your mart"} item="home-manage" label="My Mart" direction="mart"></HomepageButton>
            <HomepageButton color={defaultColors} item="home-insights" label="Mart Analytics" direction="analytics"></HomepageButton>
            <HomepageButton color={defaultColors} item="home-receipt" label="Customer Records" direction="records"></HomepageButton>
            <HomepageButton color={defaultColors} title={"Edit mart's colors and fonts"} item="home-brush" label="Mart Design" direction="design" extra={mode}></HomepageButton>
            <HomepageButtonBlank color={defaultColors} item="home-policy" label="Terms & Policies" direction="policies"></HomepageButtonBlank>
            <HomepageButtonBlank color={defaultColors} item="home-support" label="Customer Service" direction="customer-service"></HomepageButtonBlank>
            <HomepageButtonBlank color={defaultColors} item="home-quiz" label="Frequently Asked Questions" direction="faq"></HomepageButtonBlank>
            <HomepageButtonBlank color={defaultColors} item="home-power" label="Close or Open Mart" direction="toggle"></HomepageButtonBlank>
        </main>
    </Fragment>
}

export default HomePage

export {getServerSideProps}
