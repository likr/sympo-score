angular.module('sympo-score')
  .filter('newlines', ($sce) => {
    return (text) => {
      var result = '';
      if (text) {
        result = text.replace(/\n/g, '<br/>');
      }
      return $sce.trustAsHtml(result);
    };
  });
