angular.module('sympo-score')
  .factory('Evaluator', ($resource) => {
    return $resource('/api/evaluators/:key', null, {
      update: {
        method: 'PUT'
      }
    });
  });
