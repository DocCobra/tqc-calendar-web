function parseDate(dateString) {
  let isoDate = new Date();
  
  const datePieces = dateString.split(' '); 

  const h = datePieces[1].substr(0, 1) === 'A' ? datePieces[0].substr(0, 2) : datePieces[0].substr(0, 2) + 12; 
  const m = datePieces[0].substr(3, 2); 
  
  const MM = +datePieces[3].substr(0, 2) - 1; 
  const DD = datePieces[3].substr(3, 2); 
  
  isoDate.setHours(h); 
  isoDate.setMinutes(m); 
  isoDate.setSeconds(0); 
  isoDate.setMonth(MM, DD); 

  return isoDate.toISOString(); 
}

const platformInfo = [
  { 
    'platform': 'psn', 
    'color': '#1A50B0'
  },
  { 
    'platform': 'steam', 
    'color': '#7B7D8C'
  },
  { 
    'platform': 'xbox', 
    'color': '#28A827'
  },
  { 
    'platform': 'stadia', 
    'color': '#FF8B4D'
  }
]; 

document.addEventListener('DOMContentLoaded', () => {
  let node = document.getElementById('calendar');
  let calendar = new FullCalendar.Calendar(node, {
    initialView: 'timeGridWeek', 
    nowIndicator: true, 
    
    eventSources: [{
      url: 'https://tqc-calendar-proxy-db.doccobra.repl.co',
      failure: fail => {
      }
    }],
    eventSourceSuccess: json => {
      return Object.entries(json).map(e => e[1]); 
    },
    eventDataTransform: eventData => {
      const platformIndex = platformInfo.map(p => 
        p.platform === eventData.platform
      ).indexOf(true); 
      const color = platformInfo[platformIndex].color; 

      return {
        'id': eventData.messageSnowflake, 
        'title': eventData.activity, 
        'start': parseDate(eventData.startTime), 
        'color': color, 
        'extraParams': {
          'description': eventData.description + " - Joined: " + eventData.joined.current + "/" + eventData.joined.max, 
          'platform': eventData.platform 
        }
      } 
    }, 
    eventDidMount: info => {
      const fcEventMain = info.el.querySelector('.fc-event-main'); 
      const platformDiv = document.createElement('div'); 

      platformDiv.classList.add('platform-' + info.event.extendedProps.extraParams.platform); 
      fcEventMain.appendChild(platformDiv); 

      const tooltip = new Tooltip(info.el, {
        title: info.event.extendedProps.extraParams.description,
        placement: 'top',
        trigger: 'hover',
        container: 'body'
      });
    }
  });
  calendar.render();
});