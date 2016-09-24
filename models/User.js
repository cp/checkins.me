'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
      foursquare_token: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER
      }
    }, {
      instanceMethods: {
        toJson: function() {
          return {
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            email: this.email,
            name: this.name,
            id: this.id,
          }
        }
      },
      classMethods: {
        createFromProfileAndToken: function(profile, token) {
          var name = [profile.name.givenName, profile.name.familyName].join(' ');
          var email;

          if (profile.emails[0] && profile.emails[0].value) {
            email = profile.emails[0].value;
          }

          return this.findOrCreate({
            where: { id: profile.id },
            defaults: {
              foursquare_token: token,
              email: email,
              name: name
            }
          });
        }
      }
  });
};
