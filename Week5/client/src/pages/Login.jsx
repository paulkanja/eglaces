import { Link } from "react-router"
import toast, { Toaster } from "react-hot-toast"

import Logo from "../components/Logo.jsx"
import * as sessions from "../middleware/sessions.js"

export default function LoginPage({ server }) {
    return (
        <>
            <Toaster />
            <div className="
                w-full h-full
                flex items-center justify-center
                bg-base-200
            ">
                <div className="
                    card
                    flex flex-col gap-[50px]
                    bg-base-100
                    p-[50px]
                ">
                    <Logo size="4em"/>
                    <form
                        name="loginForm"
                        onSubmit={e => {
                            e.preventDefault()
                            const submitButton = document.getElementById(
                                "submit-button"
                            )
                            submitButton.disabled = true
                            document.body.style.cursor = "wait"
                            const form = document.forms["loginForm"]
                            const email = encodeURIComponent(
                                form.emailInput.value
                            )
                            const password = encodeURIComponent(
                                form.passwordInput.value
                            )
                            function perror(error) {
                                toast.error(error)
                                document.body.style.cursor = "auto"
                                submitButton.disabled = false
                            }
                            try {
                                sessions.login(
                                    server,
                                    email,
                                    password
                                ).then(key => {
                                    window.location.href = `/?s=${key}`
                                })
                                .catch(error => {
                                    perror(error.response.data)
                                })
                            } catch (error) {
                                perror(error.message)
                            }
                        }}
                        className="
                            w-[402px]
                        "
                    >
                        <div className="
                            flex flex-col gap-[20px]
                        ">
                            <fieldset>
                                <legend>
                                    Email Address
                                </legend>
                                <input id="email-input"
                                    type="email" name="emailInput"
                                    className="
                                        input validator
                                        w-full
                                    "
                                    required
                                />
                            </fieldset>
                            <fieldset>
                                <legend>
                                    Password
                                </legend>
                                <input id="password-input"
                                    type="password" name="passwordInput"
                                    className="
                                        input validator
                                        w-full
                                    "
                                    required
                                />
                            </fieldset>
                            <button id="submit-button" type="submit"
                                className="
                                    btn btn-primary
                                    w-full
                                "
                            >
                                Sign In
                            </button>
                            <span className="text-center">
                                Don't have an account?
                                {" "}
                                <Link to="/signup" className="
                                    link-hover
                                    text-primary
                                    font-bold
                                ">Sign up</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
} 
