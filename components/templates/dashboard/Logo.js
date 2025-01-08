import Image from "next/image"

function Logo() {
    return (
        <Image
            width={130}
            height={130}
            src="/logo.svg"
            alt="Logo"
            className="w-auto h-auto"
        />
    )
}

export default Logo