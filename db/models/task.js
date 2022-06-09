'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    llistId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {model: "Lists"}
    },
    task: {
      allowNull: false,
      type: DataTypes.STRING(255)
    },
    completed: {
      type: DataTypes.BOOLEAN
    },
  }, {});
  Task.associate = function(models) {
    Task.belongsTo(models.List, { foreignKey: 'listId' });
  };
  return Task;
};