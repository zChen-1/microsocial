const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require('http-status-codes');

// library of user services intended for use within other services
// as an alternative to direct fetches

const {uri,fetch} = require("./common");

// returns (err,user)
async function fetch_user(id) {
  const obj_uri = uri(`/user/${id}`, "Users");
  apiresult = await fetch(obj_uri, { method: "GET" });
  if (apiresult.status != StatusCodes.OK) {
    return (apiresult.statusText, null);
  };

  fetched_user = await apiresult.json();

  return (null, fetched_user);
}

async function fetch_users() {
  const obj_uri = uri(`/users`, "Users");
  apiresult = await fetch(obj_uri, { method: "GET" });
  if (apiresult.status != StatusCodes.OK) {
    return (apiresult.statusText, null);
  };

  fetched_users = await apiresult.json();

  return (null, fetched_users);
}


module.exports.fetch_user = fetch_user;
module.exports.fetch_users = fetch_users;
