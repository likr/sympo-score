angular.module('sympo-score')
  .factory('AdminScore', ($resource) => {
    return $resource('/api/admin/scores/:key', {
      key: '@key'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
