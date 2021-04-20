document.addEventListener('DOMContentLoaded', () => {
  let node = document.getElementById('calendar');
  let calendar = new FullCalendar.Calendar(node, {
    initialView: 'timeGridWeek', 
    nowIndicator: true, 
    
    eventSources: [{
      url: 'https://tqc-calendar-proxy-db.doccobra.repl.co',
      // method: 'POST',
      // extraParams: {
      //   key: "c",
      //   value: "3"
      // }, 
      failure: fail => {
      },
    }], 
    eventDidMount: info => {
      var tooltip = new Tooltip(info.el, {
        title: info.event.extendedProps.description,
        placement: 'top',
        trigger: 'hover',
        container: 'body'
      });
    }
  });
  calendar.render();
});