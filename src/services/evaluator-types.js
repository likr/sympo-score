angular.module('sympo-score')
  .factory('evaluatorTypes', () => {
    return [
      {value: 0, label: '審査員'},
      {value: 1, label: '院生'},
      {value: 2, label: '学部生'}
    ];
  });
