'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.


      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    queryInterface.addColumn(
      'checkins',
      'lat',
      Sequelize.FLOAT
    );

    queryInterface.addColumn(
      'checkins',
      'lng',
      Sequelize.FLOAT
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    queryInterface.removeColumn('checkins', 'lat');
    queryInterface.removeColumn('checkins', 'lng');
  }
};
