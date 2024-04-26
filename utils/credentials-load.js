const { google } = require("googleapis");

//load credentials some how...
let creds = null;
try {
  creds = require("../credentials.json");
} catch (err) {
  throw `Failed to load credentials.json: ${err}`;
}
if (creds.web.refresh_token === "...") {
  throw `Please run 'node credentials-fill.js'`;
}

//prepare oauth2 client
const auth = new google.auth.OAuth2(
  creds.web.client_id,
  creds.web.client_secret,
  creds.web.redirect_uris[0]
);
auth.setCredentials({
  access_token: "DUMMY",
  expiry_date: 1,
  refresh_token: creds.web.refresh_token,
  token_type: "Bearer"
});

module.exports = auth;
