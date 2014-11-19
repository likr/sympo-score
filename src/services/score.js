angular.module('sympo-score')
  .factory('Score', ($resource) => {
    return $resource('/api/evaluators/:evaluatorKey/scores/:presenterKey', {
      evaluatorKey: '@evaluatorKey',
      presenterKey: '@presenterKey'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
