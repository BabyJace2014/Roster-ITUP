var path = require("path");
var teams = require(__dirname + "/../db/nflteams.json");

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
  
    nflteam.seedDB = function() {

      nflteam.findAll({})
              .then( function(result) {
                if ( !result.length ) {
                  console.log("nflteams empty - loading data for " + teams.length + " teams");
                    
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

    return nflteam;
  };