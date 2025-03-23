import logo from '../assets/default-monochrome.svg';

export default function Logo() {
    return (
        <img
            src={logo}
            alt="logo"
            style={{
                width: "25rem",
                height: "25rem",
                objectFit: "contain",
                marginTop: "-14rem", 
            }}
        />
    );
}
