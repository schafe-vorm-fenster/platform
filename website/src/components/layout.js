import React from 'react'
import { Helmet } from 'react-helmet'
import Footer from './footer'

const Layout = ({ children }) => (
    <>
      <Helmet defer={false} defaultTitle='Schafe vorm Fenster'>
        <link rel="canonical" href='/' />
      </Helmet>
      {children}
      <Footer />
    </>
)

export default Layout