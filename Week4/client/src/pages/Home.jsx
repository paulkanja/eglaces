import { useParams, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useSearchParams, Link } from "react-router"

import Logo from "../components/Logo.jsx"
import cartIcon from "../assets/shopping_cart.svg"
import accountIcon from "../assets/account_circle.svg"

export default function HomePage({ server }) {
    const [pageQuery] = useSearchParams()
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetchUser()
    }, [])

    async function fetchUser() {
        const key = pageQuery.get('s')
        setUser(key ? "KNOWN" : "GUEST")
    }

    return (
        <>
            <Toaster />
            <div className="
                flex flex-col
                w-full
                h-full
            ">
                <header className="
                    flex flex-row
                    flex-shrink-0
                    justify-between
                    w-full
                    py-[20px]
                    px-[50px]
                    shadow-md
                ">
                    <Logo size="3em"/>
                    <div className="
                        flex
                        items-center
                    ">
                        {
                            user == "KNOWN" ?
                                <img src={cartIcon} alt="Cart"
                                    className="
                                        w-[2em]
                                        fill-base-content
                                        aspect-square
                                    "
                                /> :
                            user == "GUEST" ?
                                <Link to="/login">
                                    <img src={accountIcon} alt="Login"
                                        className="
                                            w-[2em]
                                            fill-base-content
                                            aspect-square
                                        "
                                    />
                                </Link> :
                            // default
                                <div className="
                                    skeleton
                                    w-[2em]
                                    aspect-square
                                "/>
                        }
                    </div>
                </header>
                <div className="
                    flex-1
                    py-[30px]
                    overflow-y-auto
                    scroll-auto
                    bg-neutral
                "></div>
            </div>
        </>
    )
}
