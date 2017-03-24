function <%= name %>Controller($scope, $log) {
  var ctrl = this;

  // This is a smart component, here is where you make the service or api calls
  // and define the functions that will actually modify the data, you can use the
  // $scope to listen to outside events etc...
  ctrl.list = [
    {
      name: 'Superman',
      location: 'Metropolis pt 2'
    },
    {
      name: 'Batman',
      location: 'Wayne Manor'
    }
  ];

  ctrl.updateHero = function(hero, prop, value) {
    hero[prop] = value;
  };

  ctrl.deleteHero = function(hero) {
    var idx = ctrl.list.indexOf(hero);
    if (idx >= 0) {
      ctrl.list.splice(idx, 1);
    }
  };
}

var templateUrl = '<%= templateUrl %>';
angular.module('<%= moduleName %>').component('<%= name %>', {
  templateUrl: templateUrl,
  controller: ['$scope', '$log', <%= name %>Controller]
});
