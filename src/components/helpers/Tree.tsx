"use client"

import React, { useState, useEffect } from "react";

const Tree = () => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const ToggleTree = () => {
            if ( window.scrollY > 384 ) {
                setShow(false);
            } else {
                setShow(true);
            }
        };

        window.addEventListener('load', ToggleTree);
        window.addEventListener('scroll', ToggleTree);
    }, []);

    return (
        <div id="tree" className={`${show ? '' : 'max-xl:opacity-0 '}transition-opacity duration-1000`}></div>
    );
}

export default Tree;
