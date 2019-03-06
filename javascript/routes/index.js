var express = require('express');
var fetch = require('node-fetch');
var us_states = require('../us_state.js');

var router = express.Router();

function apiUrl(state, place) {
  return `https://api.turbovote.org/elections/upcoming?district-divisions=ocd-division/country:us/state:${state},ocd-division/country:us/state:${state}/place:${place}`;
}

function getElectionInfo(state, place) {
  return fetch(apiUrl(state, place), {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
    .then(res => res.json())
    .then(electionInfo => electionInfo[0])
    .catch(err => console.log(err));
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Find My Election', states: us_states });
});

module.exports = router;
