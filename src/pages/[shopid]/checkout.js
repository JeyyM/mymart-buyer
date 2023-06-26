import { Fragment, useEffect, useContext } from "react"
import Head from "next/head"
import { useState } from "react"
import { useRouter } from "next/router"
import { getServerSideProps } from "../_app"

import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Marker } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';

import FinishCheckout from "@/components/cart/FinishCheckout"

import { MyContext } from "@/components/store/MyProvider"
import { Link } from "@mui/material"

const libraries = ['places'];

export default function Checkout({ shopID, user }) {
    const footerItems = shopID.shopData.shopDetails.footerData
    const favicon = shopID.shopData.shopDetails.imageData.icons.icon
    const { handleIncrement, state } = useContext(MyContext);
    
    const shopName = shopID.name

    const shopCategories = shopID.shopData.shopCategories

    function findItem(category, varName) {
        let chosenCateg = shopCategories.find((categ) => categ.categoryName === category)

        if (chosenCateg) {
            let chosenVariation = chosenCateg.categoryProducts.flatMap((prod) => prod.variations).find((variation) => variation.productName === varName);
            if (chosenVariation) {
                return chosenVariation
            } else {
                return 
            }
        } else {
            return
        }
    }

    const router = useRouter()
    const localStorageKey = `mart_${router.query.shopid}`;

    const paymentDetails = shopID.shopData.shopDetails.paymentData

    const cardData = paymentDetails.cardInfo
    const checkoutData = paymentDetails.checkoutInfo

    const currency = paymentDetails.checkoutInfo.currency
    const fees = paymentDetails.Adds
    const takebacks = paymentDetails.Takebacks

    let userCard = {}
    let userLocation = ""
    let userCoords = {}

    if (user !== undefined) {
        userCard = user.card
        userLocation = user.location
        userCoords = user.locationCoords
    }

    const slide = {
        hidden: {
            x: "-10rem",
            opacity: 0,
        },
        visible: (index) => ({
            x: "0px",
            opacity: 1,
            transition: {
                type: "spring",
                duration: 0.3,
                bounce: 0.2,
                delay: index * 0.2,
            },
        }),
        exit: {
            x: "-10rem",
            opacity: 0,
            transition: {
                duration: 0.1,
            },
        },
    };

    const imageInfo = shopID.shopData.shopDetails.imageData

    const id = shopID._id;

    const [formInputValidity, setFormInputValidity] = useState({
        cvv: true,
        cvvEmpty: false
    });

    const [cardName, setCardName] = useState(userCard.name);
    const [cardNumber, setCardNumber] = useState(userCard.number);
    const [expiryMonth, setExpiryMonth] = useState(userCard.month);
    const [expiryYear, setExpiryYear] = useState(userCard.year);
    const [cvv, setCvv] = useState();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false)
    const [completion, setCompletion] = useState(false)

    const checkmark = (
        <svg viewBox="0 0 100 100" width="7rem" height="7rem">
          <path id="checkmark" d="M25,50 L40,65 L75,30" stroke="#FFFFFF" strokeWidth="8" fill="none"
            strokeDasharray="200" strokeDashoffset="200">
            <animate attributeName="stroke-dashoffset" from="200" to="0" dur="0.5s" begin="indefinite" />
          </path>
        </svg>
      )

    const [finishModal, setFinishModal] = useState(false)
    const finishModalHandler = () => {
        setFinishModal(!finishModal)
    }

    const [Mode, setMode] = useState("delivery")
    const modeButton = "product-action-1 heading-secondary"
    const modeButtonActive = "product-action-2 heading-secondary"

    const [parsedData, setParsedData] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    const mapContainerStyle = { width: '50rem', height: '30rem', margin: "0 auto" };

    const [center, setCenter] = useState(null);
    const [locationName, setLocationName] = useState(userLocation);
    const [autocomplete, setAutocomplete] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GMAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        if (window.google && window.google.maps && center) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: center }, (results, status) => {
                if (status === 'OK') {
                    setLocationName(results[0].formatted_address);
                } else {
                    console.log('Geocoder failed due to: ' + status);
                }
            });
        }
    }, [center]);

    function currentLoc() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCenter({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.log(error);
                }
            );
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }

    function resetLoc() {
        setCenter(userCoords)
    }

    useEffect(() => { setCenter(userCoords) }, [])

    useEffect(() => {
        const updateParsedData = () => {
            const storedCartItems =
                typeof window !== "undefined"
                    ? localStorage.getItem(localStorageKey)
                    : null;
            const parsedData = storedCartItems ? JSON.parse(storedCartItems) : [];

            setParsedData(parsedData);
        };

        const handleStorageChange = (event) => {
            if (event.key === localStorageKey) {
                updateParsedData();
            }
        };

        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        };

        handleVisibilityChange();

        updateParsedData();

        window.addEventListener("storage", handleStorageChange);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [localStorageKey, state.count]);

    const handleMapClick = (event) => {
        const newCenter = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setCenter(newCenter);

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: newCenter }, (results, status) => {
            if (status === 'OK') {
                setLocationName(results[0].formatted_address);
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    };

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    const onLoad = (autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry !== undefined) {
                setCenter({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                });
                setLocationName(place.formatted_address);
            } else {
                console.log('Geocode was not successful for the following reason: ', status);
            }
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    const nameClasses = "text-small input-number"
    const cardClasses = "text-small input-number"
    const monthClasses = "text-small input-number"
    const yearClasses = "text-small input-number"
    const cvvClasses = `${formInputValidity.cvv ? "text-small input-number white-input" : "invalid-form-2 white-input"}`;
    const descClasses = "desc-text-area"

    async function updateData() {
        if (typeof window !== 'undefined') {
            let storedItems = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey) : null;

            const response = await fetch(
                `/api/read-cart?martid=${router.query.shopid}&email=${user.email}&password=${user.password}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(JSON.parse(storedItems))
                }
            );
            const data = await response.json();
        }
    }

    const updateCartItem = (index, amount, select) => {
        const updatedData = [...parsedData];
        const chosenProduct = findItem(select.category, select.name)

        if (amount === 1) {
            if (parseInt(updatedData[index].cartValue) < parseInt(typeof chosenProduct === "object" ? chosenProduct.productStock.stockAmount : 0)) {
                updatedData[index].cartValue = parseInt(updatedData[index].cartValue) + parseInt(amount);
            } else {
                updatedData[index].cartValue = parseInt(typeof chosenProduct === "object" ? chosenProduct.productStock.stockAmount : 0);
            }
        } else if (amount === -1) {
            updatedData[index].cartValue = parseInt(updatedData[index].cartValue) + parseInt(amount);
            if (updatedData[index].cartValue === 0 || updatedData[index].cartValue < 0) {
                updatedData.splice(index, 1);
            }

        }

        localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
        setParsedData(updatedData);
        handleIncrement();

        if (user !== undefined) {
            updateData()
        }
    };

    const updateCartInput = (index, amount, select) => {
        const updatedData = [...parsedData];
        const item = updatedData[index];
        const newCartValue = parseInt(select.cartValue) + parseInt(amount);
        const chosenProduct = findItem(select.category, select.name)

        let stockInput = 0

        if (typeof chosenProduct === "object"){stockInput = chosenProduct.productStock.stockAmount}

        let chosenCartValue = newCartValue <= stockInput ? newCartValue : stockInput;

        if (isNaN(amount)) {
            chosenCartValue = "0";
        }

        item.cartValue = parseInt(chosenCartValue);

        localStorage.setItem(localStorageKey, JSON.stringify(updatedData));
        setParsedData(updatedData);
        handleIncrement()
    };

    const calculateTotal = () => {
        let total = 0;

        parsedData.forEach((item) => {
            const totalCost = item.cartValue * parseFloat(item.price);
            total += totalCost;
        });

        return total;
    };

    const total = calculateTotal();

    const delivTotal = fees.DelFee.reduce((sum, item) => sum + parseInt(item.cost), 0);
    const pickTotal = fees.PickFee.reduce((sum, item) => sum + parseInt(item.cost), 0);

    let feeTotal = Mode === "delivery" ? delivTotal : pickTotal
    const absoluteTotal = total + feeTotal

    function waitSeconds() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    async function hashString(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    async function completeForm(formdata) {
        const response = await fetch(
          `../../../api/set-order?martid=${router.query.shopid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formdata)
          }
        );
        const data = await response.json();
    
      }

    //   let now = new Date()
    //   console.log("date", now)

    //   console.log(takebacks.cancelCount, takebacks.cancelDuration)
    //   console.log(takebacks.refundCount, takebacks.refundDuration)
    console.log("takebcks", takebacks)

    async function finishSubmission() {
        let cvvValid
        const hashedCVV = await hashString(cvv)
        const hashedOriginal = user.card.cvv
        const currentDate = new Date();
        const today = new Date();

        let { cancelCount, cancelDuration } = takebacks; 
        cancelCount = parseInt(cancelCount, 10);

        if (cancelDuration === 'minute') {
            currentDate.setMinutes(currentDate.getMinutes() + cancelCount);
          } else if (cancelDuration === 'hour') {
            currentDate.setHours(currentDate.getHours() + cancelCount);
          } else if (cancelDuration === 'day') {
            currentDate.setDate(currentDate.getDate() + cancelCount);
          } else if (cancelDuration === 'week') {
            currentDate.setDate(currentDate.getDate() + (cancelCount * 7));
          } else if (cancelDuration === 'month') {
            currentDate.setMonth(currentDate.getMonth() + cancelCount);
          } else if (cancelDuration === 'year') {
            currentDate.setFullYear(currentDate.getFullYear() + cancelCount);
          }


        const updatedUser = { ...user, location: locationName, locationCoords: center,  currentCart: [] };

        let chosenFee = Mode === "delivery" ? delivTotal : pickTotal

        if (cvv === undefined || cvv === "") {
            setFormInputValidity({cvv: false, cvvEmpty: true})
            return
        }
        
        if (hashedCVV !== hashedOriginal) {
            setFormInputValidity({cvv: false, cvvEmpty: true})
            return
        }
            
        if (hashedCVV === hashedOriginal && parsedData.length > 0){
            setFormInputValidity({cvv: true, cvvEmpty: false})

            const payload = {
                order: parsedData,
                totals: {order: total, fees: chosenFee},
                currentTime: today,
                message: message,
                ownerMessage: "",
                user: updatedUser,
                status: "ongoing",
                ownerMessage: "",
                mode: Mode,
                allowCancel: takebacks.allowCancel,
                cancelDuration: currentDate,
                allowRefund: takebacks.allowRefunds,
                refundDuration: null,
                cancelFee: takebacks.cancelFee,
                refundFee: takebacks.refundFee,
                expectBy: null
            }
            completeForm(payload)

            setLoading(true)
            await waitSeconds()
            setLoading(false)
            setCompletion(true)
            localStorage.removeItem(localStorageKey);
            handleIncrement()

            finishModalHandler()
            
        }
    }

    function toHome (){
        router.push(`/${router.query.shopid}`)
    }

    return <Fragment>
        <Head>
            <title>Checkout</title>
            <link rel="icon" type="image/jpeg" href={favicon} />
        </Head>

        <FinishCheckout modalStatus={finishModal} disable={toHome} toHome={toHome}name={shopName}></FinishCheckout>

        <span className="page-heading" style={{ marginLeft: "1rem" }}>
            <div className="heading-icon-dropshadow">
                <div className="menu-checkout svg-color">&nbsp;</div>
            </div>
            <h1 className="heading-primary no-margin">
                Checkout&nbsp;
            </h1>
        </span>

        <div className="checkout-container">
            <div className="checkout-column">
                <span className="page-heading flex-row-align" style={{ marginBottom: "1rem" }}>
                    <div className="heading-icon-credit svg-color">&nbsp;</div>
                    <h1 className="heading-secondary no-margin">Credit Card Details</h1>
                </span>

                <div className="form-group">
                    <input
                        type="text"
                        className={`${nameClasses}`}
                        placeholder="Name on Credit card"
                        value={cardName}
                        autoComplete="off"
                    ></input>
                    <label className="form-label">Name on Credit Card </label>
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        className={`${cardClasses}`}
                        placeholder="Credit Card Number"
                        value={cardNumber}
                        autoComplete="off"
                    ></input>
                    <label className="form-label">Credit Card Number </label>
                </div>

                <div className="flex-row-spaceless" style={{ alignItems: "center", gap: "2rem" }}>
                    <label className="heading-secondary product-currency">Expiry Date:</label>
                    <div className="flex-col-none">
                        <input style={{ width: "8rem", margin: "0" }} type="number" className={monthClasses} placeholder="MM" autoComplete="off" value={expiryMonth}></input>
                        <label className="form-label">Month</label>
                    </div>

                    <label className="heading-secondary product-currency">/</label>

                    <div className="flex-col-none">
                        <input style={{ width: "8rem", margin: "0" }} type="number" className={yearClasses} placeholder="YY" autoComplete="off" value={expiryYear}></input>
                        <label className="form-label">Year</label>
                    </div>

                    <label className="heading-secondary product-currency">CVV:</label>

                    <div className="flex-col-none">
                        <input style={{ width: "12rem", margin: "0" }} type="number" className={cvvClasses} placeholder="CVV" autoComplete="off" value={cvv} onChange={(event) => { const newValue = event.target.value; if (newValue.length <= 3) { setCvv(newValue); } }}></input>
                        {formInputValidity.cvv ? <label className="form-label">&nbsp;</label> : <label className="form-label inv" style={{ color: "red" }}>Invalid CVV</label>}
                    </div>
                </div>

                <div className="form-group">
                    <textarea
                        id="description"
                        rows="5"
                        className={descClasses}
                        placeholder="Additional Message (optional)"
                        onChange={(event) => setMessage(event.target.value)}
                        value={message}
                        autoComplete="off"
                    ></textarea>
                    <label className="form-label">Checkout Message (optional)</label>
                </div>

                <span className="page-heading" style={{ width: "100%", marginBottom: "1rem" }}>
                    <div className="heading-icon-pin svg-color">&nbsp;</div>
                    <h1 className="heading-secondary no-margin">&nbsp;Delivery Location Details</h1>
                </span>
                <h2 className="heading-tertiary">{locationName}</h2>

                <div>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={15}
                        // onClick={handleMapClick}
                        onLoad={() => console.log("Map loaded")}
                    >
                        <Marker position={center} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }} />

                        <div style={{ position: 'relative', width: '50%', height: '40px', margin: '0 auto' }}>
                            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                <input type="text" placeholder="Enter a location" style={{ width: '100%', height: '100%', border: "1px solid black", padding: "1rem" }} />
                            </Autocomplete>
                        </div>
                    </GoogleMap>
                </div>
                {/* <div className="flex-row" style={{ marginTop: "1rem", width: "100%", justifyContent: "space-around" }}>
                    <button onClick={currentLoc} className="product-action-2 heading-secondary">Current Location</button>
                    <button onClick={resetLoc} className="product-action-3 heading-secondary white">Reset to Default</button>
                </div> */}
            </div>

            <div className="checkout-column" style={{ padding: "0", gap: "0", position: "relative" }}>

                <span className="page-heading dark-underline">
                    <div className="heading-icon-receipt svg-color" style={{ margin: "1rem" }}>&nbsp;</div>
                    <h1 className="heading-secondary no-margin">Order Details</h1>
                </span>

                {parsedData.map((item, index) => (
                    <div className="checkout-row" key={index}>
                        <div className="add-buttons flex-row-spaceless" style={{ width: "16rem" }}>
                            <button type="button" className="minus-button" onClick={() => updateCartItem(index, -1, item)}><div className="heading-icon-minus-act svg-color">&nbsp;</div></button>
                            <input type="number" className="text-small input-number" placeholder="Amount" style={{ borderRadius: "0", margin: "0", width: "8rem" }} value={item.cartValue} onChange={(e) => updateCartInput(index, parseInt(e.target.value) - item.cartValue, item)}></input>
                            <button type="button" className="add-button svg-color" onClick={() => updateCartItem(index, 1, item)}><div className="heading-icon-plus-act svg-decolor">&nbsp;</div></button>
                        </div>
                        <img className="checkout-img round-borderer" src={item.image}></img>
                        <div className="flex-col-2" style={{ width: "auto" }}>
                            <a href={`/${item.url}`} className="heading-secondary" style={{ whiteSpace: "pre-wrap", display: "inline", textDecoration: "none" }}>{item.name}</a>
                        </div>

                        <div className="cart-pay">
                            <h2 className="heading-tertiary" style={{ marginBottom: "1rem" }}>Price: {currency} {item.price} / {item.unit}</h2>
                            <h2 className="heading-tertiary checkout-total" style={{ fontWeight: "900" }}>Total: {currency} {item.price * item.cartValue}</h2>
                        </div>
                    </div>
                ))}

                <div className="checkout-fees dark-underline">

                    <div className="flex-col-none">

                        <span className="page-heading">
                            <div className="heading-icon-shipping svg-color" style={{ margin: "0" }}>&nbsp;</div>
                            <h1 className="heading-secondary no-margin">&nbsp; Order Mode</h1>
                        </span>
                        <div className="flex-row" style={{ marginTop: "2rem", justifyContent: "space-around" }}>
                            <button className={Mode === "delivery" ? modeButtonActive : modeButton} style={{ height: "5rem", width: "15rem", margin: "0rem" }} onClick={() => { setMode("delivery") }}>Delivery</button>
                            <button className={Mode === "pickup" ? modeButtonActive : modeButton} style={{ height: "5rem", width: "15rem", margin: "0rem" }} onClick={() => { setMode("pickup") }}>Pick-Up</button>
                        </div>
                        <h3 className="heading-tertiary" style={{ marginTop: "1rem" }}>{checkoutData.message}</h3>
                    </div>

                    <div className="cart-pay">
                        {Mode === "delivery" && <>
                        <h2 className="heading-tertiary checkout-total" style={{ fontWeight: "900", margin:"0" }}>Total: {currency} {total}</h2>
                            <h2 className="heading-secondary" style={{ marginBottom: "1rem" }}>Delivery Fees:</h2>
                            {fees.DelFee.length === 0 && <div>
                                <h2 className="heading-tertiary checkout-total">There are no delivery fees</h2>
                            </div>}

                            {fees.DelFee.length > 0 && <>
                                {fees.DelFee.map((fee) => (
                                    <h2 className="heading-tertiary checkout-total" key={fee.name}>{fee.name}: {currency} {fee.cost}</h2>
                                ))}

                                <h2 className="heading-tertiary checkout-total" style={{ fontWeight: "900", marginTop: "1rem" }}>Total: {currency} {delivTotal}</h2>

                            </>}
                        </>
                        }

                        {Mode === "pickup" && <>
                        <h2 className="heading-tertiary checkout-total" style={{ fontWeight: "900", margin:"0" }}>Total: {currency} {total}</h2>
                            <h2 className="heading-secondary" style={{ marginBottom: "1rem" }}>Pick-Up Fees:</h2>
                            {fees.PickFee.length === 0 && <div>
                                <h2 className="heading-tertiary checkout-total">There are no pick-up fees</h2>
                            </div>}

                            {fees.PickFee.length > 0 && <>
                                {fees.PickFee.map((fee) => (
                                    <h2 className="heading-tertiary checkout-total" key={fee.name}>{fee.name}: {currency} {fee.cost}</h2>
                                ))}

                                <h2 className="heading-tertiary checkout-total" style={{ fontWeight: "900", marginTop: "1rem" }}>Total: {currency} {pickTotal}</h2>

                            </>}
                        </>
                        }
                    </div>
                </div>

                <div className="checkout-fees">

                    <div className="flex-col-none">
                        <h2 className="heading-secondary" style={{ marginBottom: "1rem" }}>Total: {currency} {absoluteTotal}</h2>
                        {takebacks.allowRefunds === false ? <div>
                            <h2 className="heading-tertiary" style={{ marginBottom: "1rem" }}>Refunds are not allowed.</h2>
                        </div> : <div>
                            <h2 className="heading-tertiary" style={{ marginBottom: "1rem" }}>Refunds are allowed within {takebacks.refundCount} {takebacks.refundDuration}/s of receiving with a penalty of {takebacks.refundFee}% of the order's total, fees not included.</h2>
                        </div>}

                        {takebacks.allowCancel === false ? <div>
                            <h2 className="heading-tertiary" style={{ marginBottom: "1rem" }}>Cancellations are not allowed.</h2>
                        </div> : <div>
                            <h2 className="heading-tertiary" style={{ marginBottom: "1rem" }}>Cancellations are allowed within {takebacks.cancelCount} {takebacks.cancelDuration}/s of ordering with a penalty of {takebacks.cancelFee}% of the order's total, fees not included. You cannot cancel approved orders.</h2>
                        </div>}

                        <Link href={`/${router.query.shopid}/terms`}><h2 className="heading-tertiary" style={{ fontWeight: "900" }}>By completing this order, I agree with the mart's terms and conditions as well as the privacy policy.</h2></Link>

                        <button className="product-action-2 heading-secondary flex-row-align" type="button" style={{ width: "98%", margin: "1rem", textDecoration: "none" }} onClick={finishSubmission} disabled={loading}>
                        {loading ? <div className="spinner"></div> : (completion ? <div className="margin-side" style={{transform:"translateY(20%)"}}>{checkmark}</div> : <div className="flex-row-align margin-side"><div className="heading-icon-cashregister svg-solid-button">&nbsp;</div><h2 className="heading-secondary solid-button">Finish Order</h2></div>
                        )}
                        </button>
                        {formInputValidity.cvv ? <label className="form-label">&nbsp;</label> : <label className="form-label inv margin-side" style={{ color: "red" }}>Invalid CVV</label>}
                    </div>
                </div>


            </div>

        </div>
    </Fragment>
}

export { getServerSideProps }
