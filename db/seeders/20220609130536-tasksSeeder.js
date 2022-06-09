'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkInsert('Tasks', [{
     listId: 1,
     task: 'rememba tha chedda',
     createdAt: new Date(),
     updatedAt: new Date()
   },
   {
     listId: 1,
     task: 'grab some dr pepper',
     createdAt: new Date(),
     updatedAt: new Date()
   },
   {
     listId: 1,
     task: 'get cookies',
     createdAt: new Date(),
     updatedAt: new Date()
   }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
   return queryInterface.bulkDelete('Tasks', null, {});
  }
};
