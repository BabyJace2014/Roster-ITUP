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
      },
      // ERROR >>>
      // >>> Unhandled rejection SequelizeDatabaseError: Unknown column 'player_imgURL' in 'field list'
      // player_imgURL: {
      //   type: DataTypes.STRING,
      //   allowNull: false
      // }
    });

    // adding class method to populate the nflplayers table with seed data if the table is empty
    nflplayer.seedDB = function() {

      nflplayer.findAll({})
              .then( function(result) {

                if ( !result.length ) {
                  var players = require(__dirname + "/../db/nflplayers.json");
                  var playerDataArray = [];

                  console.log("Adding up to " + players.length + " players ...");

                  // run through all the players in the JSON file, check their status & add them if appropriate
                  for(var i=0; i<players.length; i++) {

                    var addPlayer = false;

                    if ( players[i].FantasyPosition === "DEF" ||
                         (players[i].PositionCategory === "OFF" &&
                          players[i].Active == true &&
                          players[i].Team != null &&
                          players[i].FantasyPosition != null ) ) {
                      addPlayer = true;
                    }

                    if ( addPlayer ) {
                      var imgURL = players[i].PhotoUrl;

                      if ( !imgURL || imgURL === "" || imgURL.includes("/0.png") ) {
                        imgURL = "/assets/img/team-logos/" + players[i].Team + ".svg";
                      } else {
                        imgURL.replace(/\//g, "/");
                      }

                      var playerData = {  player_id: players[i].PlayerID,
                                          player_name: players[i].Name,
                                          player_position: players[i].FantasyPosition,
                                          player_imgURL: imgURL,
                                          nflteamTeamId: players[i].Team, };
                  
                      playerDataArray.push(playerData);
                    }
                  }

                  console.log("Adding " + playerDataArray.length + " NFL fantasy players ...");

                  nflplayer.bulkCreate( playerDataArray )
                           .then( function(result) {
                      console.log("NFL Players added!");
                  });
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

      nflplayer.hasMany(models.userplayer, {
        onDelete: "cascade"
      });

    };
  
    return nflplayer;
  };