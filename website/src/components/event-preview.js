// import { Link } from 'gatsby'
import React from 'react'
// import { getEventUrl } from '../lib/helpers'
import Moment from 'react-moment'
import 'moment/locale/de';
import 'moment-timezone'
import {MdRecordVoiceOver, MdLocationOn} from 'react-icons/md'
import FilePreview from './file-preview'

function EventPreview (props) {
  var timeString


  var eventType = 'default'
  if(props.allday){
    eventType = 'allday'
  }else {
    if(props.end) {
      timeString = (
          <>
            <Moment format="HH:mm" tz="Europe/Berlin">{props.start}</Moment> bis <Moment format="HH:mm" tz="Europe/Berlin">{props.end}</Moment>
          </> 
        )
    }else{
      timeString = <Moment format="HH:mm" tz="Europe/Berlin">{props.start}</Moment>
    }
  }
  return (
    <article id={props.id} className={"event " + eventType + " mb-4 p-3 flex"} >

      <div className="w-1/6">
        <div className="calendersheet shadow-sm day-today day-4">
          <span className="weekday"><Moment format="dddd" tz="Europe/Berlin" locale="de">{props.start}</Moment></span>
          <span className="day"><Moment format="D" tz="Europe/Berlin">{props.start}</Moment></span>
          <span className="month"><Moment format="MMM." tz="Europe/Berlin" locale="de">{props.start}</Moment></span>
        </div>
      </div>

      <div className="w-5/6 pl-5">
        { props.calendar != null && parseInt(props.calendar.display_mode) > 0 && timeString != null && <p className="time">{timeString}</p> }
        <h3 className="title">{props.name}</h3>
        { props.calendar != null && parseInt(props.calendar.display_mode) > 0 && props.place != null && props.place.community != null && <p className="location"><i className="icon"><MdLocationOn /></i>{props.place.localname} in {props.place.community.name}</p> }
        { props.calendar != null && parseInt(props.calendar.display_mode) > 0 && props.place === null && props.community != null && <p className="location"><i className="icon"><MdLocationOn /></i>in {props.community.name}</p> }
        { props.calendar != null && props.calendar.organizer != null && <p className="organizer" title={props.calendar.organizer.longname}><i className="icon"><MdRecordVoiceOver /></i>{props.calendar.organizer.name}</p> }
        {props.googleeventattachment.map((attachment) => (
          <FilePreview file={attachment} type="image" />
        ))}
        { props.calendar != null && parseInt(props.calendar.display_mode) >= 2 && props.description != null && <div className="description" dangerouslySetInnerHTML={{__html: props.description}} /> }
        {props.googleeventattachment.map((attachment) => (
          <FilePreview file={attachment} type="download" />
        ))}

      </div>
    </article>
  )
}

export default EventPreview



/**
        // <Link to={getEventUrl(props.name, props.start)}>
        // </Link>

        { props.calendar != null && props.calendar.organizer != null && <p className="organizer">Kalender: {props.calendar.name}<br/>Anbieter: {props.calendar.organizer.name}</p> }

*/