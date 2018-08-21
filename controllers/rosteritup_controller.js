/////////////////////////////////////////////////////////////////
// Dependencies
/////////////////////////////////////////////////////////////////

var db = require("../models");

/////////////////////////////////////////////////////////////////
// Setup the Express Router and its routes & export it
//
//  /api/users
//  GET route to retrieve all users in the database
//
//  /api/user/:name
//  GET route to retrieve specific user, by user_name
//
//  /api/user
//  POST route to save a new user; expects object with parameters: name, password, _teamname (optional)_
//
//  /api/nflteams
//  GET route to retrieve all teams in the database
//
/////////////////////////////////////////////////////////////////

module.exports = function(app) {

    // define routes needed
    // get users route

    // GET route for returning all users
    app.get("/api/users", function(req, res) {

        // return all rows for the users table

        db.user.findAll({})
                .then( function(result) {
                    res.json(result);
                });
    });

    // GET route for returning a specific user, by name
    app.get("/api/user/:name", function(req, res) {

        // return the 1 row from the users table where user_name matches value passed in

        db.user.findOne({where: {user_name: req.params.name}})
                .then( function(result) {
                    res.json(result);
                });
    });

    // 'POST' route for adding a user
    app.post("/api/user", function(req, res) {

        // add new user defined in request to the users table

        db.user.create( { user_name: req.body.name,
                          user_pwd: req.body.password,
                          userteam_name: req.body.teamname} )
                .then( function(result) {
                    res.json(result);
                });
    });

    // GET route for returning all nflteams
    app.get("/api/nflteams", function(req, res) {

        // return all rows for the nflteams table

        db.nflteam.findAll({})
                .then( function(result) {
                    res.json(result);
                });
    });

   // GET route for returning all nflplayers
   app.get("/api/nflplayers", function(req, res) {

        db.nflplayer.findAll({})
                .then(function(result) {
                    res.json(result);
                });
    });

// GET route for returning all nflplayers by team
app.get("/api/teamroster/:team", function(req, res) {

    db.nflplayer.findAll( { where: {nflteamTeamId: req.params.team} } )
                .then(function(result) {
                    res.json(result);
                });
    });

}