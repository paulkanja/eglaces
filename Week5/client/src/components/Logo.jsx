import LogoImage from "../assets/logo.svg"

export default function Logo({ size }) {
    return (
        <img
            src={LogoImage}
            alt="Eglacés"
            className={`
                inline-block
                w-auto
                aspect-auto
            `}
            style={{height: size}}
        />
    )
}
