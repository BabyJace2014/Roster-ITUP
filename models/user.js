/////////////////////////////////////////////////////////////////
// User Data Object model
/////////////////////////////////////////////////////////////////
module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false
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
  
    return user;
  };