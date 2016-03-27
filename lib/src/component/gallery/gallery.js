angular.module('controller.gallery', [])
  .controller('galleryContorller', ['$rootScope', '$scope', '$uibModal', '$state', function ($rootScope, $scope, $uibModal, $state) {
    var vm = this
    vm.viewPicg = viewPicg
    $rootScope.show = [false, false, false, false, false, false, false]
    var index = parseInt($state.current.name, 10)
    $rootScope.show[index] = true
    console.log($rootScope.status)
    function viewPicg (roomName, picCount) {
      var modalConfig = {
        templateUrl: './lib/src/component/gallerypopup/gallerypopup.html',
        controller: 'gallerypopupContorller',
        controllerAs: 'gallerypopup',
        size: 'lg',
        resolve: {
          items: function () {
            return {'roomName': roomName, 'max': picCount}
          }
        }
      }
      var modalInstance = $uibModal.open(modalConfig)
      modalInstance.result.then(function (loginData) {}, function error (res) {
        console.log(res)
      })
    }
  }])
