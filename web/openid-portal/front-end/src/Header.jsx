import { NavLink } from "react-router-dom";

export function Header(props) {

    return (
        <>
            <NavLink to="/" className={isActive => "nav-link" + (!isActive ? " unselected" : "")}>Home</NavLink>
            <NavLink to="/List" className={isActive => "nav-link" + (!isActive ? " unselected" : "")}>List</NavLink>
        </>
    )
}