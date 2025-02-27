/////////////////////////////////////////////////////////////////
// Dependencies
/////////////////////////////////////////////////////////////////

var db = require("../models");
const fdClientModule = require('fantasydata-node-client');

///////////////////////////////////////////////////
// Setup Fantasy Data Client
///////////////////////////////////////////////////

const keys = {
    'NFLv3StatsClient': process.env.FANDATA_PRIMARY_KEY,
    'NFLv3ProjectionsClient': process.env.FANDATA_SECONDARY_KEY
};

const FantasyDataClient = new fdClientModule(keys);

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
       
        db.nflteam.findAll({
            attributes: ["team_id"]
        }).then((data) => {
            res.render("team", {
                title: "Roster it up : create team",
                team: data
            });
        })
    });


    // POST USERTEAM ROUTE
    app.post("/userteam", (req, res) => {

        const playerData = req.body.data;

        db.userplayer.bulkCreate( playerData )
                     .then( function(result) {
                         res.json(result);
        });

    });

    // PUT USERPLAYER ROUTE
    app.put("/userplayer", (req, res) => {

        db.userplayer.update({on_roster: req.body.on_roster},
                             {where: {player_id: req.body.id,
                                      user_name: req.body.name}} )
                     .then( function(result) {
                        res.json(result);
        });

    });

    // ROSTER ROUTES
    app.get("/roster", (req, res) => {
        //res.render("roster", { title: "Roster it up : Roster page" });
        db.user.findOne({ where: {
                userteam_name: req.params.userteam,
                user_name: req.params.username
            } 
        }).then((data) => {
                res.render("roster", {
                    title: "Roster it up : Roster page",
                    teamName: data,
                    userName: data
                });
            })
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

    // GET route for returning all user's players for their team
    app.get("/api/userplayers/:user", function(req, res) {

        db.userplayer.findAll( { where: {user_name: req.params.user},
                                 include: [{model: db.user},
                                           {model: db.nflplayer}] } )
                    .then(function(result) {
                        res.json(result);
                    });
    });

    //GET route for returning NFL player stats from  the Fantasy Data API
    app.get("/api/fantasydata", function(req, res) {

        FantasyDataClient.NFLv3ProjectionsClient.getProjectedPlayerSeasonStatsPromise('2018REG')
    .then((resp) => {
        console.log(resp);
    })
    .catch((err) => {
        // handle errors
    });
});
}