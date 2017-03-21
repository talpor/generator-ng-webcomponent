function <%= name %>Controller($scope, $log) {
  // this is a dumb component, you can't make api calls here.
  // you can't either modify directly the parent object, instead call to the
  // parent functions to do that (onUpdate, onDelete...)
  // WE SHOULD'NT USE THE $SCOPE ANYMORE, instead of two way binding, we'll use
  // one way binding ("hero: '<'")
  //
  var ctrl = this;

  ctrl.editMode = false;

  ctrl.delete = function() {
    ctrl.onDelete({hero: ctrl.hero});
  };

  ctrl.update = function(prop, value) {
    ctrl.onUpdate({hero: ctrl.hero, prop: prop, value: value});
  };

  ctrl.handleModeChange = function () {
    ctrl.editMode = !ctrl.editMode;
  };

  ctrl.$onInit = function () {

    // Set a default fieldType
    if (!ctrl.fieldType) {
      ctrl.fieldType = 'text';
    }
  };
}
var templateUrl = '<%= templateUrl %>';
angular.module('app.core').component('<%= name %>', {
  templateUrl: templateUrl,
  controller: ['$scope', '$log', <%= name %>Controller],
  bindings: {
    hero: '<',
    onDelete: '&',
    onUpdate: '&'
  }
});