import '@/styles/globals.css';
import { AppProps } from 'next/app';
import React from 'react';

const App = ({ Component, pageProps, headData }: AppProps & { headData: string }) => {
    return (
        <>
            <Component {...pageProps} />
        </>
    );
};

export default App;