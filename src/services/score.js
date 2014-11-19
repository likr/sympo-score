angular.module('sympo-score')
  .factory('Score', ($resource) => {
    return $resource('/api/evaluators/scores/:presenterKey', {
      presenterKey: '@presenterKey'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
