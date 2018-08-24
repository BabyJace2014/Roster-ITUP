/////////////////////////////////////////////////////////////////
// User Team Object model
/////////////////////////////////////////////////////////////////
module.exports = function(sequelize, DataTypes) {
    var userplayer = sequelize.define("userplayer", {
      id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      player_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      on_roster: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  
    // Associating userplayer with user and nflplayer, so we can retrieve w/ join
    userplayer.associate = function(models) {
      
      userplayer.belongsTo(models.user, {
        foreignKey: {
          allowNull: false
        }
      });

      userplayer.belongsTo(models.nflplayer, {
        foreignKey: {
          allowNull: false
        }
      });

    };
  
  return userplayer;
};