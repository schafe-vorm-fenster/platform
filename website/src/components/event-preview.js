// import { Link } from 'gatsby'
import React from "react";
// import { getEventUrl } from '../lib/helpers'
import Moment from "react-moment";
import "moment/locale/de";
import "moment-timezone";
import { MdRecordVoiceOver, MdLocationOn } from "react-icons/md";
import FilePreview from "./file-preview";

function EventPreview(props) {
  var timeString;

  if(props.cancelled === true) return <></>
  
  var eventType = "default";
  if (props.allday) {
    eventType = "allday";
  } else {
    if (props.end && parseInt(props.calendar.display_mode) == 4) {
      timeString = (
        <>
          <Moment format="HH:mm" tz="Europe/Berlin">
            {props.start}
          </Moment>
          <span> Uhr</span>
        </>
      );
    } else if (props.end && parseInt(props.calendar.display_mode) >= 2) {
      timeString = (
        <>
          <Moment format="HH:mm" tz="Europe/Berlin">
            {props.start}
          </Moment>
          <span> bis </span>
          <Moment format="HH:mm" tz="Europe/Berlin">
            {props.end}
          </Moment>
          <span> Uhr</span>
        </>
      );
    } else {
      timeString = (
        <>
          <Moment format="HH:mm" tz="Europe/Berlin">
            {props.start}
          </Moment>
          <span> Uhr</span>
        </>
      );
    }
  }
  return (
    <>
      {parseInt(props.calendar.display_mode) === 4 && (
        <article
          id={props.id}
          className={"event " + eventType + " mb-4 p-3 pb-0"}
        >
          <div className="w-full flex">
            <div className="w-1/6 pr-5">
              <span className="shortdate">
                <Moment format="dd. " tz="Europe/Berlin" locale="de">
                  {props.start}
                </Moment>
                <Moment format="D." tz="Europe/Berlin">
                  {props.start}
                </Moment>
                <Moment format="MM." tz="Europe/Berlin" locale="de">
                  {props.start}
                </Moment>
              </span>
            </div>
            <div className="w-5/6">
              <p>
                <span className="time">{timeString}</span>
                <span className="smalltitle">{props.name}</span>
              </p>
            </div>
          </div>
        </article>
      )}
      {parseInt(props.calendar.display_mode) < 4 && (
        <article id={props.id} className={"event " + eventType + " mb-4 p-3"}>
          <div className="w-full flex">
            <div className="w-1/6 pr-5">
              <div className="calendersheet shadow-sm day-today day-4">
                <span className="weekday">
                  <Moment format="dd" tz="Europe/Berlin" locale="de">
                    {props.start}
                  </Moment>
                </span>
                <span className="day">
                  <Moment format="D" tz="Europe/Berlin">
                    {props.start}
                  </Moment>
                </span>
                <span className="month">
                  <Moment format="MMM." tz="Europe/Berlin" locale="de">
                    {props.start}
                  </Moment>
                </span>
              </div>
            </div>
            {parseInt(props.calendar.display_mode) < 4 && (
              <div className="w-5/6">
                {props.calendar != null && timeString != null && (
                  <p>
                    {parseInt(props.calendar.display_mode) > 0 && (
                      <span className="time">{timeString}</span>
                    )}
                    {props.calendar != null &&
                      parseInt(props.calendar.display_mode) <= 1 &&
                      props.place != null &&
                      props.place.community != null && (
                        <span className="location">
                          <i className="icon">
                            <MdLocationOn />
                          </i>
                          {props.place.localname} in{" "}
                          {props.place.community.name}
                        </span>
                      )}
                    {props.calendar != null &&
                      parseInt(props.calendar.display_mode) <= 1 &&
                      props.place === null &&
                      props.community != null && (
                        <span className="location">
                          <i className="icon">
                            <MdLocationOn />
                          </i>
                          in {props.community.name}
                        </span>
                      )}
                  </p>
                )}
                <h3 className="title">{props.name}</h3>
                <p>
                  {props.calendar != null &&
                    parseInt(props.calendar.display_mode) >= 2 &&
                    props.place != null &&
                    props.place.community != null && (
                      <span className="location">
                        <i className="icon">
                          <MdLocationOn />
                        </i>
                        {props.place.localname} in {props.place.community.name}
                      </span>
                    )}
                  {props.calendar != null &&
                    parseInt(props.calendar.display_mode) >= 2 &&
                    props.place === null &&
                    props.community != null && (
                      <span className="location">
                        <i className="icon">
                          <MdLocationOn />
                        </i>
                        in {props.community.name}
                      </span>
                    )}
                  {props.calendar != null &&
                    props.calendar.organizer != null &&
                    parseInt(props.calendar.display_mode) >= 2 && (
                      <span
                        className="organizer"
                        title={props.calendar.organizer.longname}
                      >
                        <i className="icon">
                          <MdRecordVoiceOver />
                        </i>
                        {props.calendar.organizer.name}
                      </span>
                    )}
                </p>
              </div>
            )}
          </div>
          {parseInt(props.calendar.display_mode) < 4 && (
            <div className="w-full">
              {props.googleeventattachment.map((attachment) => (
                <FilePreview file={attachment} type="image" />
              ))}
              {props.calendar != null &&
                parseInt(props.calendar.display_mode) >= 2 &&
                props.description != null && (
                  <div
                    className="description"
                    dangerouslySetInnerHTML={{ __html: props.description }}
                  />
                )}
              {props.googleeventattachment.map((attachment) => (
                <FilePreview file={attachment} type="download" />
              ))}
            </div>
          )}
        </article>
      )}
    </>
  );
}

export default EventPreview;

/**
 // <Link to={getEventUrl(props.name, props.start)}>
 // </Link>

 { props.calendar != null && props.calendar.organizer != null && <p className="organizer">Kalender: {props.calendar.name}<br/>Anbieter: {props.calendar.organizer.name}</p> }

 */
