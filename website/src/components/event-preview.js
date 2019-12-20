// import { Link } from 'gatsby'
import React from 'react'
// import { getEventUrl } from '../lib/helpers'
import Moment from 'react-moment'
import 'moment/locale/de';
import 'moment-timezone'

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
    <article id={props.id} className={"event " + eventType + " mb-5 p-3 flex"} >

      <div class="calendersheet shadow-sm day-today day-4 w-1/6">
        <span class="weekday"><Moment format="dddd" tz="Europe/Berlin" locale="de">{props.start}</Moment></span>
        <span class="day"><Moment format="D" tz="Europe/Berlin">{props.start}</Moment></span>
        <span class="month"><Moment format="MMM." tz="Europe/Berlin" locale="de">{props.start}</Moment></span>
      </div>

      <div className="w-5/6 pl-5">
        { timeString != null && <p className="time">{timeString}</p> }
        <h3 className="title">{props.name}</h3>
        { props.place != null && <p className="location">{props.place.name}</p> }
        { props.description != null && <p className="description">{props.description}</p> }
      </div>
    </article>
  )
}

export default EventPreview



/**
        // <Link to={getEventUrl(props.name, props.start)}>
        // </Link>
*/