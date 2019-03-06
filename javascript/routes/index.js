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
  res.render('index', {
    title: 'Find My Election',
    states: us_states
  });
});

// FORM SUBMISSION
router.post('/search', function(req, res) {
  // get items from our form that we need for our api call
  // state and city need to be lowercase and have all spaces as underscores
  const state = req.body.state.toLowerCase();
  const place = req.body.city.toLowerCase().replace(/ /g, '_');

  Promise.all([getElectionInfo(state, place)]).then(electionInfo => {
    // Render our results page with data
    res.render('search', {
      title: 'Your Election Info',
      electionInfo: electionInfo[0]
    });
  });
});

module.exports = router;
