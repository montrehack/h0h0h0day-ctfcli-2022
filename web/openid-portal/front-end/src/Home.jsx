import React from 'react';
import { NavLink } from 'react-router-dom';
import img from './Christmas_Tree_and_Presents.jpg';

export function Home(props) {

    return (
        <>
            <p>Welcome to the North Pole website.</p>
            <p>If you are a guest, enjoy the Christmas picture below.</p>
            <p>If you are Santa, you can view <NavLink to="/List">the list</NavLink> of gifts to deliver people.</p>
            <img alt="Beautiful christmas pic" src={img} />
            {/* Hint: A public client with id "santa" is registed in the oidc server. Use the PKCE flow to get yourself a token. */}
            {/* Valid redirect uris for this client are the same as the "guest" client, and http://localhost:44030/local/callback */}
            <p>Note: This site uses openid connect and json web tokens to identify you. If your token's client_id is not santa, then do not even try to view the list.</p>
        </>
    )
}