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
//  POST route to save a new user; expects object with parameters: name, password, <teamname>
//
//  /api/nflteams
//  GET route to retrieve all teams in the database
//
//  /api/nflplayers
//  GET route for returning all nflplayers
//
//  /api/teamroster/:team
//  GET route for returning all nflplayers by team
//
/////////////////////////////////////////////////////////////////

module.exports = function(app) {

    // define routes needed

    // INDEX ROUTE
    app.get("/", (req, res) => {
        res.render("index", {
            title: "Roster it up : home",
            layout: "landing"
        });
    });

    // LOGIN ROUTE
    app.get("/login", (req, res) => {
        res.render("login", {title: "Roster it up : login"});
    });

    // SIGN UP ROUTES 
    app.get("/signup", (req, res) => {
        res.render("signup", {title: "Roster it up : sign up"});
    });
    
    app.post("/signup", (req, res) => {

        // see if this user already exists
        db.user.findOne({where: {user_name: req.body.name}})
                .then( function(result) {

                    // if user doesn't already exist, add it to the db
                    if ( !result ) {
                        db.user.create( {   user_name: req.body.name,
                                            user_pwd: req.body.password,
                                            userteam_name: req.body.teamname} )
                                .then( function(result) {
                                    res.json(result);
                            });
                    } else {
                        // if user does exist ... send back error
                        res.json({error: "User already exists."});
                    }
                });
    });

    // TEAM ROUTE
    app.get("/team", (req, res) => {
        res.render("team", {title: "Roster it up : create team"});
    });
    // POST TEAM ROUTE

    // ROSTER ROUTES
    app.get("/:id/roster", (req, res) => {
        res.render("roster", {title: "Roster it up : roster"})
    });
    app.post("/:id/roster/:roster", (req, res) => {
        // save roster data if roster is persistent
    });


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