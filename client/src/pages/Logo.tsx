import logo from '../assets/default.png';

export default function Logo() {
    return (
        <img
            src={logo}
            alt="logo"
            style={{
                width: "25rem",
                height: "25rem",
                objectFit: "contain",
                marginTop: "-4rem", 
            }}
        />
    );
}
