const { google, GoogleApis } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  "client id",
  "client secret",
  "http://localhost:3000/oauth2callback"
);

const scopes = [
  "https://www.googleapis.com/auth/calendar",
];


const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: "offline",

  // If you only need one scope, you can pass it as a string
  scope: scopes,
});

class Controller {
  static async google(req, res) {
    console.log("HALO");
    res.redirect(url)
  }

  static async getToken(req, res) {
    const {code} = req.query
    console.log(code);

    const {tokens} = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({version: 'v3', auth: oauth2Client});
    
    const event = {
      summary: "FuceFox Conference 2024",
      location: "800 Howard St., San Francisco, CA 94103",
      description: "A chance to hear more about Google's developer products.",
      start: {
        dateTime: "2024-08-28T09:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: "2024-08-28T17:00:00-07:00",
        timeZone: "America/Los_Angeles",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
      attendees: [{ email: "lpage@example.com" }, { email: "sbrin@example.com" }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };
    let eventUrl = ""
    calendar.events.insert(
      {
        auth: oauth2Client,
        calendarId: "primary",
        resource: event,
      },
      function (err, event) {
        if (err) {
          console.log(
            "There was an error contacting the Calendar service: " + err
          );
          return;
        }
        eventUrl = event.data.htmlLink;
        res.status(200).json({
          message: "Code taken",
          url: eventUrl,
        });
        console.log(event.data.htmlLink);
      }
    );
    

    
    
  }
}

module.exports = Controller;
