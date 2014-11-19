angular.module('sympo-score')
  .factory('AdminEvaluator', ($resource) => {
    return $resource('/api/admin/evaluators/:key', {
      key: '@key'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
