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
      instanceMethods: {
      },
      classMethods: {
        createFromResponseAndUser: function(checkins, user) {
          var all = checkins.map(function(checkin) {
            var getCategory = function(venue) {
              var category = venue.categories.filter(function(c) { return c.primary === true})[0];

              return category.name || '';
            }

            checkin.event = checkin.event || {};
            checkin.venue = checkin.venue || {};
            checkin.venue.location = checkin.venue.location || {};

            return {
              id: checkin.id,
              userId: user,
              venue: checkin.venue.name,
              score: checkin.score ? checkin.score.total : 0,
              checkinTime: checkin.createdAt,
              city: checkin.venue.location.city,
              state: checkin.venue.location.state,
              country: checkin.venue.location.country,
              address: checkin.venue.location.address,
              crossStreet: checkin.venue.location.crossStreet,
              event: checkin.event.name,
              timeZoneOffset: checkin.timeZoneOffset,
              category: getCategory(checkin.venue)
            };
          });

          return this.bulkCreate(all);
        }
      }
  });
};
