import React from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS } from './event-utils'
import uniqid from 'uniqid'
import { addEvent, deleteEvent, getEvents } from '../../actions/actions'
import './styles.css'

export default class MainCalender extends React.Component {
  constructor() {
    super();
    this.state = {
      weekendsVisible: true,
      currentEvents: []
    }
  }

  render() {
    const email = localStorage.getItem('googleEmail');
    if(email){
    return (
      <div className='demo-app'>
        {this.renderSidebar()}
        <div className='demo-app-main'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={this.state.weekendsVisible}
            initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            
            eventChange={function(){}}
            eventRemove={function(){}}
            */
            eventAdd={() => {
              const newEvent = JSON.parse(JSON.stringify(this.state.currentEvents[this.state.currentEvents.length - 1]));
              addEvent(email, newEvent.id, newEvent.title, newEvent.start, newEvent.end);
            }}
          />
        </div>
      </div>
    )
  }else{
    window.location.href = "/login";
  }
}

  renderSidebar() {
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <h2 className="h2_calender">Instructions</h2>
          <ul className="ul_calender">
            <li className="li_calender">Select dates and you will be prompted to create a new event</li>
            <li className="li_calender">Drag, drop, and resize events</li>
            <li className="li_calender">Click an event to delete it</li>
          </ul>
        </div>
        <div className='demo-app-sidebar-section'>
          <label>
            <input
              type='checkbox'
              checked={this.state.weekendsVisible}
              onChange={this.handleWeekendsToggle}
            ></input>
            toggle weekends
          </label>
        </div>
        <div className='demo-app-sidebar-section'>
          <h2 className="h2_calender">All Events ({this.state.currentEvents.length})</h2>
          <ul className="ul_calender">
            {this.state.currentEvents.map(renderSidebarEvent)}
          </ul>
        </div>
      </div>
    )
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: uniqid(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  handleEventClick = (clickInfo) => {
    const email = localStorage.getItem('googleEmail');
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      deleteEvent(email, clickInfo.event.id)
      clickInfo.event.remove()
    }
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

}

function renderEventContent(eventInfo) {
  return (
    <>
      <b className="b_cal">{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id} className="li_calender">
      <b className="b_cal">{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}
