/////////////////////////////////////////////////////////////////
// User Data Object model
/////////////////////////////////////////////////////////////////
module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      user_pwd: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userteam_name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    // adding class method to populate the users table with seed data if the table is empty
    user.seedDB = function() {

      user.findAll({})
              .then( function(result) {

                if ( !result.length ) {

                  user.create( {  user_name: "Demo",
                                  user_pwd: "PWDxxx",
                                  userteam_name: "RosterItUp!"} )
                          .then( function(result) {
                          });
                }
              });
    };

  return user;
};