import { Fragment } from "react"
import Head from "next/head"
import { getServerSideProps } from "../_app"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect} from "react"
import { useRouter } from "next/router"

function SignUp(martID) {
    const router = useRouter()
    const id = martID.shopID._id
    const localStorageKey = `mart_${martID.shopID._id}`;
    const defaultColor = martID.shopID.shopData.shopDesigns.defaultMode

    const [parsedData, setParsedData] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

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
      }, [localStorageKey]);


    const favicon = martID.shopID.shopData.shopDetails.imageData.icons.icon
    const [currentStep, setCurrentStep] = useState(1);

        const accounts = martID.shopID.shopData.shopAccounts

        let emailList = []

    emailList = accounts.map(item => item.email.toUpperCase().trim());
    
    const shopName = martID.shopID.name
    const navlogo = martID.shopID.shopData.shopDetails.imageData.icons.logo

    const [total, setTotal] = useState(0)
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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const appear = {
        hidden: {
            transform: "scale(0)",
            opacity: 0,
        },
        visible: {
            transform: " scale(1)",
            opacity: 1,
            transition: {
                duration: 0.2,
            },
        },
        exit: {
            transform: "scale(0)",
            opacity: 0,
            transition: {
                duration: 0.2,
            },
        },
    };

    const [email, setEmail] = useState("");
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const [password, setPassword] = useState("");
    const handlePassChange = (event) => {
        setPassword(event.target.value);
    };

    const [signValidity, setSignValidity] = useState({
        email: true,
        existing: true,
        pass: true,
        correct: true
    });

    const accountValidate = async (event) => {

        let emailValid = true
        let passValid = true
        let emailExist = false

        emailValid = email.trim() !== ""
        passValid = password.trim() !== ""
        emailExist = emailList.includes(email.toUpperCase());

        if (!emailExist) {
            emailValid = false
        }

        setSignValidity({
            email: emailValid,
            pass: passValid,
            existing: emailExist,
            correct: true
        })

        const submissionValid = emailValid && passValid && emailExist

        if (submissionValid) {
            signIn()
        }

    };

      async function passcheck(pass) {
    if ( typeof window !== 'undefined'){
    const response = await fetch(
      `../../../api/read-cart?martid=${router.query.shopid}&email=${email}&password=${pass}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    return data.shopAccount
    }
  }

    async function signIn(){
        const hashedPassword = await hashString(password);
        let result = await passcheck(hashedPassword)

        if (result){
            const authKey = `auth_${martID.shopID._id}`;
            const authData = {email: email, password: hashedPassword}
            localStorage.setItem(authKey, JSON.stringify(authData));
            localStorage.setItem(localStorageKey, JSON.stringify(result.currentCart));
            setLoading(true)
            await waitSeconds();
            setLoading(false)
            setCompletion(true)
            router.push(`/${id}`).then(() => window.location.reload())
        } else {
            setSignValidity({
                email: true,
                pass: false,
                existing: true,
                correct: false
            })
        }
    }

    const emailClasses = `${signValidity.email ? "text-small input-number" : "invalid-form-2 z"}`;
    const passClasses = `${signValidity.pass ? "text-small input-number" : "invalid-form-2 z"}`;

    return (
        <>
            <Head>
                <title>Sign-Up</title>
                <link rel="icon" type="image/jpeg" href={favicon} />
            </Head>
            <div className="sign-up-container" style={{ transform: "translateY(-10%)" }}>

                        {currentStep === 1 && <AnimatePresence> <motion.div
                        key={currentStep}
                        className="sign-up-box round-borderer round-borderer-extra"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                            hidden: { scale: 0 },
                            visible: { scale: 1 },
                            exit: { scale: 0 },
                        }}
                        transition={{ duration: 0.2 }}
                    ><div className="sign-step">
                            <img className="company-logo-med" src={navlogo} style={{ margin: "0", marginBottom: "1rem", display: "inline" }}></img>
                            <h2 className="heading-secondary">Log-in {shopName}</h2>

                            <div className="form-group" style={{ marginTop: "1rem" }}>
                                <input
                                    type="text"
                                    className={emailClasses}
                                    placeholder="Email"
                                    autoComplete="off"
                                    style={{ width: "100%" }}
                                    value={email}
                                    onChange={handleEmailChange}
                                ></input>
                                {signValidity.email && signValidity.existing ? <h3 className="form-label">Email</h3> : !signValidity.existing ? <h3 className="form-label inv z">Email does not exist</h3> : <h3 className="form-label inv z">Input a valid email</h3>}

                            </div>
                            <div className="form-group" style={{ marginTop: "0.5rem" }}>
                                <input
                                    type="password"
                                    className={passClasses}
                                    placeholder="Password"
                                    autoComplete="off"
                                    style={{ margin: "0", width: "100%" }}
                                    value={password}
                                    onChange={handlePassChange}
                                ></input>
                                {signValidity.pass && signValidity.correct ? <h3 className="form-label">Password</h3> : !signValidity.correct ? <h3 className="form-label inv z">Wrong password</h3> : <h3 className="form-label inv z">Input a valid password</h3>}

                            </div>

                            <div className="form-group" style={{ marginTop: "0.5rem" }}>
                                      <button className="product-action-2 flex-row-align sign-page-button" onClick={accountValidate} disabled={loading}>{loading ? <div className="spinner"></div> : (completion ? <div style={{transform:"translateY(20%)"}}>{checkmark}</div> : <h2 className="heading-secondary button-solid-text">Log-in</h2>)}</button>

                            </div>
                            <a className="heading-tertiary" style={{ margin: "1rem auto" }} href={`/${id}/signup`}>Sign-up?</a>

                        </div>
                        </motion.div> </AnimatePresence>}

            



                
            </div>

        </>
    );
}

export default SignUp

export { getServerSideProps }