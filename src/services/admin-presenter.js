angular.module('sympo-score')
  .factory('AdminPresenter', ($resource) => {
    return $resource('/api/admin/presenters/:key', {
      key: '@key'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
