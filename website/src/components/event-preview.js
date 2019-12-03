import { Link } from 'gatsby'
import React from 'react'
import { getEventUrl } from '../lib/helpers'
import Moment from 'react-moment'
import 'moment-timezone'

function EventPreview (props) {
  var dateString
  if(props.allday){
    dateString = <Moment format="DD.MM.YYYY" tz="Europe/Berlin">{props.start}</Moment>
  }else {
    dateString = <Moment format="DD.MM.YYYY HH:mm" tz="Europe/Berlin">{props.start}</Moment>
  }
  return (
    <article id={props.id} className="mb-5 p-3 shadow">
      <p>{dateString}</p>
      <Link to={getEventUrl(props.name, props.start)}>
        <h3 className="text-xl font-medium">{props.name}</h3>
      </Link>
      { props.place != null && <p>{props.place.name}</p> }
    </article>
  )
}

export default EventPreview

//       <div><pre>{JSON.stringify(props, null, 2) }</pre></div>
