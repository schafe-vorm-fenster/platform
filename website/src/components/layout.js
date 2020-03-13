import React from 'react'
import { Helmet } from 'react-helmet'
import Footer from './footer'

const Layout = ({ children }) => (
    <>
      <Helmet defer={false} defaultTitle='Schafe vorm Fenster'>
        <link rel="canonical" href='/' />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      {children}
      <Footer />
    </>
)

export default Layout