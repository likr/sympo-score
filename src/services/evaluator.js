angular.module('sympo-score')
  .factory('Evaluator', ($resource) => {
    return $resource('/api/evaluators', null, {
      update: {
        method: 'PUT'
      }
    });
  });
