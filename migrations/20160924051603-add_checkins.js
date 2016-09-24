'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('checkins',
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        timeZoneOffset: Sequelize.INTEGER,
        event: Sequelize.STRING,
        shout: Sequelize.TEXT,
        checkinTime: Sequelize.BIGINT,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        score: Sequelize.INTEGER,
        venue: Sequelize.STRING,
        category: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        country: Sequelize.STRING,
        address: Sequelize.STRING,
        crossStreet: Sequelize.STRING
      }
    )

  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('checkins');
  }
};
