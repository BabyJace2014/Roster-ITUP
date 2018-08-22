var path = require("path");

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
      player_position: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });

    // adding class method to populate the nflplayers table with seed data if the table is empty
    nflplayer.seedDB = function() {

      nflplayer.findAll({})
              .then( function(result) {

                if ( !result.length ) {
                  var players = require(__dirname + "/../db/nflplayers.json");
                    
                  for(var i=0; i<players.length; i++) {

                    if ( players[i].active == 1 ) {

                      nflplayer.create( { player_id: players[i].playerId,
                                          player_name: players[i].displayName,
                                          player_position: players[i].position,
                                          nflteamTeamId: players[i].team} )
                            .then( function(result) {
                            });

                    }
                  }

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

    // Associating nflplayer with nflteam
    nflplayer.associate = function(models) {
      // an nflplayer can't be created without an nflteam due to the foreign key constraint
      nflplayer.belongsTo( models.nflteam, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return nflplayer;
  };