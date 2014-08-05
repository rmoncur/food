angular.module("sampleApp", ["firebase"])
  .factory("sampleService", ["$firebase", function($firebase) {
    var ref = new Firebase("https://brilliant-fire-721.firebaseio.com");
    return $firebase(ref);
  }])
  .controller("SampleController", ["$scope", "sampleService",
    function($scope, service) {
      service.$bind($scope, "text");
    }
  ]);