import React from "react";
import Img from "gatsby-image";
import Logo from "../../assets/schafe-vorm-fenster_logo.inline.svg";
import BetaBadge from "../../assets/beta-badge.inline.svg";
import Placeholder from "../../assets/community-hero-placeholder.inline.svg";

function Community(props) {
  const {
    _id,
    name,
    municipality,
    image,
    wikimedia_commons_imagelinks,
    publication_status,
  } = props;
  var heroImg;
  if (wikimedia_commons_imagelinks && wikimedia_commons_imagelinks[0]) {
    heroImg = (
      <img
        id="community-image"
        src={wikimedia_commons_imagelinks[0]}
        className="object-cover h-hero"
      />
    );
  } else if (image && image.asset && image.asset.fluid) {
    heroImg = (
      <Img
        id="community-image"
        fluid={image.asset.fluid}
        className="object-cover h-hero"
      />
    );
  } else {
    heroImg = <Placeholder className="object-fill w-full h-hero" />;
  }
  return (
    <header id={_id} className="w-full mb-5 font-sans">
      <div id="community-hero" className="w-full h-hero bg-gray-500 mb-5">
        {heroImg}
        <a href="/" title="zu weiteren Dörfern">
          <Logo
            id="svf-logo"
            className="absolute top-0 left-0 m-3 w-1/6 max-w-20"
          />
        </a>
        {publication_status === "1" && (
          <div
            id="publication-status"
            className="publication-status publication-status-beta"
          >
            <BetaBadge
              id="beta"
              className="absolute w-16 h-16 -mt-12 right-0 mx-3"
            />
          </div>
        )}
      </div>
      {publication_status === "1" && (
        <p
          id="community-publication-status"
          className="community-publication-status text-center"
        >
          Diese Webseite ist eine Vorschau und kann durchaus noch falsche Daten
          enthalten.
        </p>
      )}
      <h1 className="text-5xl leading-tight text-center mt-0 pt-0">{name}</h1>
      {municipality.name != null && (
        <p id="community-municipality" className="text-center">
          Gemeinde {municipality.name}
        </p>
      )}
    </header>
  );
}

export default Community;
