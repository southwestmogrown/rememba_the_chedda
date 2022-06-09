'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    name: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {});
  List.associate = function(models) {
    List.belongsTo(models.User, { foreignKey: 'userId' });
    List.hasMany(models.Task, { foreignKey: 'listId' });
  };
  return List;
};