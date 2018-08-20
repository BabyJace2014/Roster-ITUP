var path = require("path");
var players = require(__dirname + "/../db/nflplayers.json");

/////////////////////////////////////////////////////////////////
// Player Data Object model
/////////////////////////////////////////////////////////////////
module.exports = function(sequelize, DataTypes) {
    var nflplayer = sequelize.define("nflplayer", {
      player_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      player_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });

    nflplayer.seedDB = function() {

      nflplayer.findAll({})
              .then( function(result) {
                if ( !result.length ) {
                  console.log("nflplayers empty - loading data for " + players.length + " players");
                    
                  // for(var i=0; i<players.length; i++) {
                  //   if ( players[i].active == 1 ) {
                  //     nflplayer.create( { player_id: players[i].playerId,
                  //                         player_name: players[i].displayName,
                  //                         team_id: players[i].team} )
                  //           .then( function(result) {
                  //                   console.log("Added: " + players[i].displayName);
                  //           });
                  //   }
                  // }
                }
              });
    };

    return nflplayer;
  };