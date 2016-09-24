'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('checkin', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      timeZoneOffset: DataTypes.INTEGER,
      event: DataTypes.STRING,
      shout: DataTypes.TEXT,
      checkinTime: DataTypes.BIGINT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      score: DataTypes.INTEGER,
      venue: DataTypes.STRING,
      category: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      address: DataTypes.STRING,
      crossStreet: DataTypes.STRING
    }, {
      instanceMethods: {},
      classMethods: {}
  });
};
