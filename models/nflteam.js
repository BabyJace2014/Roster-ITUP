var path = require("path");

/////////////////////////////////////////////////////////////////
// Team Data Object model
/////////////////////////////////////////////////////////////////
module.exports = function(sequelize, DataTypes) {
    var nflteam = sequelize.define("nflteam", {
      team_id: {
        type: DataTypes.STRING(3),
        allowNull: false,
        primaryKey: true
      },
      team_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bye_week: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    // adding class method to populate the nflteam table with seed data if the table is empty
    nflteam.seedDB = function() {

      nflteam.findAll({})
              .then( function(result) {

                if ( !result.length ) {

                  let teams = require(__dirname + "/../db/nflteams.json");
                   
                  for(var i=0; i<teams.length; i++) {
                    nflteam.create( { team_id: teams[i].code,
                                      team_name: teams[i].fullName,
                                      bye_week: teams[i].byeweek} )
                            .then( function(result) {
                            });
                  }
                }
                
              });
    };

    // Associating nflteam with nflplayer
    nflteam.associate = function(models) {

      nflteam.hasMany(models.nflplayer, {
        onDelete: "cascade"
      });

    };
  
    return nflteam;
  };