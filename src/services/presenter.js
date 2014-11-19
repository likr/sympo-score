angular.module('sympo-score')
  .factory('Presenter', ($resource) => {
    return $resource('/api/presenters/:key');
  });
