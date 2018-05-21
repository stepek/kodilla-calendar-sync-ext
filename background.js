chrome.webNavigation.onCompleted.addListener(function() {
  chrome.tabs.executeScript(null, {
    file: 'syncMeeting.js'
  }, function() {
    if (chrome.runtime.lastError) {
      alert(chrome.runtime.lastError.message);
    }
  });

}, {url: [{urlMatches : 'https://kodilla/*'}]});

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (sender.url.indexOf('kodilla') === -1) {
    return;
  }

  if (request.action === 'syncCall') {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      const startAt = moment(request.source.time);
      const endAt = startAt.clone().add(45, 'minutes');
      const init = {
        'method' : 'POST',
        'async'  : true,
        'headers': {
          'Authorization' : 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        'contentType': 'json',
        body: JSON.stringify({
          summary: `Rozmowa - ${request.source.name}`,
          attendees: [
            {
              displayName: request.source.name,
              email: request.source.email
            }
          ],
          start: {
            dateTime: startAt.format()
          },
          end: {
            dateTime: endAt.format()
          },
          conferenceData: {
            createRequest: {
              type: 'eventHangout',
              requestId: '7qxalsvy0e'
            }
          }

        })
      };

      fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?sendNotifications=true&conferenceDataVersion=1', init)
        .then(function (data) {
          alert(`New event added to the google calendar at ${request.source.time} with ${request.source.name}`);
        });
    });
  }
});
