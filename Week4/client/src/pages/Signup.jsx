import { Link } from "react-router"
import toast, { Toaster } from "react-hot-toast"

import Logo from "../components/Logo.jsx"
import * as users from "../middleware/users.js"
import * as sessions from "../middleware/sessions.js"

const validateConfirmation = e => {
    const form = document.forms["signupForm"]
    const passwordInput = form.passwordInput
    const confirmPassword = form.confirmPassword
    confirmPassword.setCustomValidity("")
    if (confirmPassword.value != passwordInput.value) {
        confirmPassword.setCustomValidity(
            "Confirmation password must equal password"
        )
        return false
    }
    return true
}

const validatePassword = e => {
    const res = validateConfirmation()
    const form = document.forms["signupForm"]
    const passwordInput = form.passwordInput
    passwordInput.setCustomValidity("")
    if (!passwordInput.checkValidity()) {
        return false
    }
    const password = passwordInput.value
    if (password.length < 8) {
        passwordInput.setCustomValidity(
            "Password must be at least 8 characters long"
        )
        return false
    }
    const uppercase = /[A-Z]/.test(password)
    const lowercase = /[a-z]/.test(password)
    const digit     = /[0-9]/.test(password)
    const symbol    = /[~`!@#\$%\^&\*\-_\+=:;'\",\.\/\?\\]/.test(password)
    if (!uppercase || !lowercase || !digit || !symbol) {
        passwordInput.setCustomValidity(
            "Password must include at least\n" +
            (uppercase ? "" : " • 1 uppercase alphabetic character (A-Z)\n") +
            (lowercase ? "" : " • 1 lowercase alphabetic character (a-z)\n") +
            (digit     ? "" : " • 1 digit (0-9)\n"                         ) +
            (symbol    ? "" : " • 1 symbol"                                )
        )
        return false
    }
    return res
}

export default function SignupPage({ server }) {
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
                        name="signupForm"
                        onSubmit={e => {
                            e.preventDefault()
                            if (!validatePassword()) {
                                const form = document.forms["signupForm"]
                                form.confirmPassword.reportValidity()
                                form.passwordInput.reportValidity()
                                return
                            }
                            const submitButton = document.getElementById(
                                "submit-button"
                            )
                            submitButton.disabled = true
                            document.body.style.cursor = "wait"
                            const form = document.forms["signupForm"]
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
                                users.register(
                                    server,
                                    email,
                                    password
                                ).then(uid => {
                                    sessions.fetch(
                                        uid,
                                        password
                                    ).then(key => {
                                        window.location.href = `/?s=${key}`
                                    })
                                    .catch(error => {
                                        perror(error.response.data)
                                    })
                                }).catch(error => {
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
                                <input
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
                                <input
                                    type="password" name="passwordInput"
                                    className="
                                        input validator
                                        w-full
                                    "
                                    required
                                    onInput={validatePassword}
                                />
                            </fieldset>
                            <fieldset>
                                <legend>
                                    Confirm Password
                                </legend>
                                <input
                                    type="password" name="confirmPassword"
                                    className="
                                        input validator
                                        w-full
                                    "
                                    required
                                    onInput={validateConfirmation}
                                />
                            </fieldset>
                            <button id="submit-button" type="submit"
                                className="
                                    btn btn-primary
                                    w-full
                                "
                            >
                                Sign Up
                            </button>
                            <span className="text-center">
                                Already have an account?
                                {" "}
                                <Link to="/login" className="
                                    link-hover
                                    text-primary
                                    font-bold
                                ">Log in</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
} 
