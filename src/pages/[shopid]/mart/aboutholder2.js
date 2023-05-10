import { Fragment, useState, useEffect } from "react";
import { getServerSideProps } from "../categories";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";

function About(shopID) {
  const slide = {
    hidden: {
      x: "-10rem",
      opacity: 0,
    },
    visible: {
      x: "0px",
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.3,
        bounce: 0.2,
      },
    },
    exit: {
      x: "-10rem",
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

  const [device, setDevice] = useState("desktop")

  const desktopTextInitial = [{ type: "heading-primary", row1: "1", row2: "2", col1: "1", col2: "10", align: "center", zInd: "1", content: "Desktop", scale: "1" }]
  const tabletTextInitial = [{ type: "heading-primary", row1: "1", row2: "2", col1: "1", col2: "10", align: "center", zInd: "1", content: "Tablet", scale: "1" }]
  const phoneTextInitial = [{ type: "heading-primary", row1: "1", row2: "2", col1: "1", col2: "10", align: "center", zInd: "1", content: "Phone", scale: "1" }]

  const [desktopHolder, setDesktopHolder] = useState({ text: desktopTextInitial })
  const [tabletHolder, setTabletHolder] = useState({ text: tabletTextInitial })
  const [phoneHolder, setPhoneHolder] = useState({ text: phoneTextInitial })

  const [AllTexts, setAllTexts] = useState({
    desktop: desktopHolder.text,
    tablet: tabletHolder.text,
    phone: phoneHolder.text
  })

  const [rowCount, setRowCount] = useState(10)

  const [colLimit, setColLimit] = useState(12)

  const [grid, setGrid] = useState(true)
  function handleGrid() { setGrid(!grid) }

  const [TextArray, setTextArray] = useState(AllTexts[device]);

  function handleAddTextArray(link, type) {
    const newTextArray = [...TextArray, { type: "heading-primary", row1: "1", row2: "2", col1: "1", col2: "2", align: "center", zInd: "1", content: "", scale: "1" }];
    setTextArray(newTextArray);
  }

  function handleTextArrayTypeChange(index) {
    const newTextArray = [...TextArray];
    newTextArray[index].type = event.target.value;
    setTextArray(newTextArray)
  }

  function handleTextArrayR1Change(index) {
    const newTextArray = [...TextArray];
    newTextArray[index].row1 = event.target.value;
    setTextArray(newTextArray)
  }

  function handleTextArrayR2Change(index) {
    const newTextArray = [...TextArray];
    newTextArray[index].row2 = event.target.value;
    setTextArray(newTextArray)
  }

  function handleTextArrayC1Change(index) {
    const newTextArray = [...TextArray];
    newTextArray[index].col1 = event.target.value;
    setTextArray(newTextArray)
  }

  function handleTextArrayC2Change(index) {
    const newTextArray = [...TextArray];
    newTextArray[index].col2 = event.target.value;
    setTextArray(newTextArray)
  }

  function handleTextArrayAlignChange(index) {
    const newTextArray = [...TextArray];
    newTextArray[index].align = event.target.value;
    setTextArray(newTextArray)
  }

  function handleTextArrayZChange(index) {
    const newTextArray = [...TextArray];
    newTextArray[index].zInd = event.target.value;
    setTextArray(newTextArray)
  }

  function handleTextArrayContentChange(event, index) {
    const newTextArray = [...TextArray];
    newTextArray[index].content = event.target.value
      .replace(/ /g, "\u00A0")
      .replace(/\n/g, "<br>");
    setTextArray(newTextArray);
  }

  function handleTextArrayScaleChange(event, index) {
    const newTextArray = [...TextArray];
    newTextArray[index].scale = event.target.value
    setTextArray(newTextArray);
  }

  const [confirmDelete1, setConfirmDelete1] = useState(null);

  function handleDeleteText(index) {
    if (confirmDelete1 === index) {
      let newTextArray = TextArray.filter((item, i) => i !== index);
      setTextArray(newTextArray);
      setConfirmDelete1(null);
    } else {
      setConfirmDelete1(index);
      setTimeout(() => {
        setConfirmDelete1(null);
      }, 2000);
    }
  }

  function printall(){
    console.log(TextArray)
  }

  const [screenScale, setScreenScale] = useState(1)

  const textElements = TextArray.map((item, index) => (
    <h3
      key={index}
      className={item.type}
      style={{
        gridRow: `${item.row1}/${item.row2}`,
        gridColumn: `${item.col1}/${item.col2}`,
        textAlign: item.align,
        zIndex: item.zInd,
        margin: "0",
        alignSelf: "center",
        transform: `scale(${item.scale * screenScale})`
      }}
      dangerouslySetInnerHTML={{ __html: item.content }}
    >
    </h3>
  ));

  const prevClasses = `${grid ? "div-preview grided" : "div-preview"}`;

  const prevDivs = Array.from({ length: (rowCount * colLimit) }, (_, index) => (
    <div key={index}
      className={prevClasses}
      style={{
        gridColumn: `${index % colLimit + 1}/${index % colLimit + 2}`,
        gridRow: `${Math.floor(index / colLimit) + 1}/${Math.floor(index / colLimit) + 2}`
      }}></div>
  ));

  const [MinimizedText, setMinimizedText] = useState([]);

  const toggleTextMin = (index) => {
    if (MinimizedText.includes(index)) {
      setMinimizedText(MinimizedText.filter((minIndex) => minIndex !== index));
    } else {
      setMinimizedText([...MinimizedText, index]);
    }
  };

  useEffect(() => {

    // const [AllTexts, setAllTexts] = useState({
    //     desktop: desktopHolder.text,
    //     tablet: tabletHolder.text,
    //     phone: phoneHolder.text
    //   })

    if (device === "desktop"){
        setAllTexts({
            desktop: TextArray[device],
            tablet: tabletHolder.text,
            phone: phoneHolder.text
          })
    }
    if (device === "tablet"){
        setAllTexts({
            desktop: desktopHolder.text,
            tablet: TextArray[device],
            phone: phoneHolder.text
          })
    }
    if (device === "phone"){
        setAllTexts({
            desktop: desktopHolder.text,
            tablet: tabletHolder.text,
            phone: TextArray[device],
          })
    }

    // setTextArray(AllTexts[device]);
  }, [device]);

  return <Fragment>
    <Head>
      <title>Create About Page</title>
      <style>
        {`
        `}
      </style>
    </Head>
    <span className="page-heading">
      <div className="heading-icon-dropshadow">
        <div className="heading-icon-flag svg-color">&nbsp;</div>
      </div>
      <h1 className="heading-primary no-margin">Create About Page&nbsp;</h1>
    </span>


    <div className="flex-row" style={{ padding: "1rem" }}>
      <div className="flex-col">
        <div className="detail-slot-about">
          <span className="page-heading" style={{ marginBottom: "1rem" }}>

            <div className="heading-icon-settings svg-color">&nbsp;</div>
            <h1 className="heading-secondary no-margin">&nbsp;Settings &nbsp;</h1>
          </span>

          <div className="flex-row-align">
            <label className="heading-tertiary">Row count</label>
            <input value={rowCount} onChange={event => { setRowCount(event.target.value) }} type="number" className="text-small input-number" style={{ width: "15rem" }}></input>

            <div className="flex-row-align">
              <h3 className="heading-tertiary">Show Grid</h3>
              <input checked={grid} onChange={handleGrid} type="checkbox" id="switch" className="toggle-switch" /><label htmlFor="switch" className="toggle-label">Toggle</label>
            </div>

            <button className="product-action-2 heading-secondary" style={{ width: "15rem", margin: "0" }} onClick={printall}>Submit</button>
            <button className="product-action-3 white heading-secondary" style={{ width: "15rem", margin: "0", zIndex: "99" }}>Reset</button>

          </div>

          <div className="flex-row" style={{ marginTop: "1rem", width: "100%", justifyContent: "space-around" }}>
            <button className="product-action-2 heading-secondary" style={{ width: "15rem" }} onClick={() => {setDevice("desktop")}}>Desktop</button>
            <button className="product-action-2 heading-secondary" style={{ width: "15rem" }} onClick={() => {setDevice("tablet")}}>Tablet</button>
            <button className="product-action-2 heading-secondary" style={{ width: "15rem" }} onClick={() => {setDevice("phone")}}>Phone</button>
          </div>

        </div>
        <span className="page-heading" style={{ margin: "1rem" }}>
          <div className="heading-icon-typography svg-color">&nbsp;</div>
          <h1 className="heading-secondary no-margin" title="Fees that customers will pay if they choose for their items to be delivered.">&nbsp;Text Items &nbsp;</h1>
          <button className="add-img" type="button" onClick={handleAddTextArray} ><div className="heading-icon-plus-marginless svg-color">&nbsp;</div></button>
        </span>
        <div>
          <div className="detail-inputs">

            <AnimatePresence>
              {TextArray.map((item, index) => (
                <div className="detail-row-about" key={index}>
                  {!MinimizedText.includes(index) && (
                    <motion.div className="detail-row-about" key={index} variants={slide} initial="hidden" animate="visible" exit="exit">

                      <div className="flex-col set-container" style={{ gap: "1rem" }}>
                        <button className="min-button rotater" onClick={() => toggleTextMin(index)}>
                          {MinimizedText.includes(index) ? <div className="heading-icon-chevron svg-color">&nbsp;</div> : <div className="heading-icon-chevron svg-color">&nbsp;</div>}
                        </button>
                        <div className="flex-row" >
                          <div className="flex-col">
                            <label className="heading-tertiary">Heading Type: &nbsp;</label>
                            <select value={item.name} onChange={(event) => handleTextArrayTypeChange(index, event.target.value)} className="text-options text-span" style={{ width: "100%", marginTop: "1rem" }}>
                              <option value="heading-primary">Primary Heading</option>
                              <option value="heading-secondary">Secondary Heading</option>
                              <option value="heading-tertiary">Tertiary heading</option>
                            </select>
                          </div>

                          <div className="flex-col">
                            <label className="heading-tertiary">Text Align: &nbsp;</label>
                            <select value={item.align} onChange={(event) => handleTextArrayAlignChange(index, event.target.value)} className="text-options text-span" style={{ width: "100%", marginTop: "1rem" }}>
                              <option value="center">Center</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                            </select>
                          </div>

                          <div className="flex-col">
                            <label className="heading-tertiary">Z-Index: &nbsp;</label>
                            <select
                              value={item.zInd}
                              onChange={(event) => handleTextArrayZChange(index, event.target.value)}
                              className="text-options text-span"
                              style={{ width: "100%", marginTop: "1rem" }}
                            >

                              {Array.from({ length: 10 }, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                  {index + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-col">
                            <label className="heading-tertiary" style={{ marginBottom: "1rem" }} title="Increase or decrease an element's size. 1 for 100%, 1.2 for 120%, etc. Blank results will be turned to 1 upon submission.">Scale: &nbsp;</label>
                            <div className="flex-row-align">
                              <input
                                type="number"
                                placeholder="Scale"
                                className="text-small input-number"
                                autoComplete="off"
                                style={{ width: "100%", margin: "0" }}
                                value={item.scale}
                                onChange={(event) => handleTextArrayScaleChange(event, index)}
                              ></input>
                            </div>
                          </div>
                        </div>


                        <div className="flex-row" style={{ marginBottom: "1rem" }}>

                          <div className="flex-col">
                            <label className="heading-tertiary">Grid Column: &nbsp;</label>
                            <div className="flex-row-align">
                              <select
                                value={item.col1}
                                onChange={(event) => handleTextArrayC1Change(index, event.target.value)}
                                className="text-options text-span"
                                style={{ width: "100%", marginTop: "1rem" }}
                              >

                                {Array.from({ length: 13 }, (_, index) => (
                                  <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                  </option>
                                ))}
                              </select>
                              <h2 className="heading-secondary">/</h2>
                              <select
                                value={item.col2}
                                onChange={(event) => handleTextArrayC2Change(index, event.target.value)}
                                className="text-options text-span"
                                style={{ width: "100%", marginTop: "1rem" }}
                              >

                                {Array.from({ length: 13 }, (_, index) => (
                                  <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex-col">
                            <label className="heading-tertiary">Grid Row: &nbsp;</label>
                            <div className="flex-row-align">
                              <select
                                value={item.row1}
                                onChange={(event) => handleTextArrayR1Change(index, event.target.value)}
                                className="text-options text-span"
                                style={{ width: "100%", marginTop: "1rem" }}
                              >

                                {Array.from({ length: rowCount + 1 }, (_, index) => (
                                  <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                  </option>
                                ))}
                              </select>
                              <h2 className="heading-secondary">/</h2>
                              <select
                                value={item.row2}
                                onChange={(event) => handleTextArrayR2Change(index, event.target.value)}
                                className="text-options text-span"
                                style={{ width: "100%", marginTop: "1rem" }}
                              >

                                {Array.from({ length: rowCount + 1 }, (_, index) => (
                                  <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="flex-col">
                          <label className="heading-tertiary" style={{ marginBottom: "1rem" }}>Text Content: &nbsp;</label>
                          <div className="flex-row-align">
                            <input
                              type="text"
                              placeholder="Content"
                              className="text-small input-number"
                              autoComplete="off"
                              style={{ width: "100%", margin: "0" }}
                              value={item.content}
                              onChange={(event) => handleTextArrayContentChange(event, index)}
                            ></input>
                          </div>
                        </div>
                      </div>
                      <button className="add-img" type="button" onClick={() => handleDeleteText(index)}>
                        {confirmDelete1 === index ? <div className="heading-icon-check-marginless svg-color">&nbsp;</div> : <div className="heading-icon-minus-marginless svg-color">&nbsp;</div>}
                      </button>
                    </motion.div>)}
                  {MinimizedText.includes(index) && (
                    <motion.div className="detail-row-about" key={index} variants={slide} initial="hidden" animate="visible" exit="exit">

                      <div className="flex-col set-container" style={{ gap: "1rem" }}>
                        <button className="min-button" onClick={() => toggleTextMin(index)}>
                          {MinimizedText.includes(index) ? <div className="heading-icon-chevron svg-color">&nbsp;</div> : <div className="heading-icon-chevron svg-color">&nbsp;</div>}
                        </button>

                        <div className="flex-row" style={{ marginBottom: "1rem" }}>
                          <div className="flex-col">
                            <label className="heading-tertiary" style={{ marginBottom: "1rem" }}>Text Content: &nbsp;</label>
                            <div className="flex-row-align">
                              <input
                                type="text"
                                placeholder="Content"
                                className="text-small input-number"
                                autoComplete="off"
                                style={{ width: "100%", margin: "0" }}
                                value={item.content}
                                onChange={(event) => handleTextArrayContentChange(event, index)}
                              ></input>
                            </div>
                          </div>

                          <div className="flex-col">
                            <label className="heading-tertiary">Grid Column: &nbsp;</label>
                            <div className="flex-row-align">
                              <select
                                value={item.col1}
                                onChange={(event) => handleTextArrayC1Change(index, event.target.value)}
                                className="text-options text-span"
                                style={{ width: "100%", marginTop: "1rem" }}
                              >

                                {Array.from({ length: 13 }, (_, index) => (
                                  <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                  </option>
                                ))}
                              </select>
                              <h2 className="heading-secondary">/</h2>
                              <select
                                value={item.col2}
                                onChange={(event) => handleTextArrayC2Change(index, event.target.value)}
                                className="text-options text-span"
                                style={{ width: "100%", marginTop: "1rem" }}
                              >

                                {Array.from({ length: 13 }, (_, index) => (
                                  <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex-col">
                            <label className="heading-tertiary">Grid Row: &nbsp;</label>
                            <div className="flex-row-align">
                              <select
                                value={item.row1}
                                onChange={(event) => handleTextArrayR1Change(index, event.target.value)}
                                className="text-options text-span"
                                style={{ width: "100%", marginTop: "1rem" }}
                              >

                                {Array.from({ length: rowCount + 1 }, (_, index) => (
                                  <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                  </option>
                                ))}
                              </select>
                              <h2 className="heading-secondary">/</h2>
                              <select
                                value={item.row2}
                                onChange={(event) => handleTextArrayR2Change(index, event.target.value)}
                                className="text-options text-span"
                                style={{ width: "100%", marginTop: "1rem" }}
                              >

                                {Array.from({ length: rowCount + 1 + 1 }, (_, index) => (
                                  <option key={index + 1} value={index + 1}>
                                    {index + 1}
                                  </option>
                                ))}
                              </select>

                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="add-img" type="button" onClick={() => handleDeleteText(index)}>
                        {confirmDelete1 === index ? <div className="heading-icon-check-marginless svg-color">&nbsp;</div> : <div className="heading-icon-minus-marginless svg-color">&nbsp;</div>}
                      </button>
                    </motion.div>)}
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex-col">
      </div>
    </div>

    <section className="about-grid-1">

      <>{prevDivs}</>

      {textElements}


    </section>
  </Fragment>
}

export default About
export { getServerSideProps }