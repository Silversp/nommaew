angular.module('controller.accom', [])
  .controller('accomContorller', ['$rootScope', '$scope', '$uibModal', '$state', function ($rootScope, $scope, $uibModal, $state) {
    var vm = this
    vm.viewPic = viewPic
    $rootScope.show = [false, false, false, false, false, false, false]
    var index = parseInt($state.current.name, 10)
    $rootScope.show[index] = true
    console.log($rootScope.status)
    function viewPic (roomName, picCount) {
      var modalConfig = {
        templateUrl: './lib/src/component/accom_popup/accomPopup.html',
        controller: 'accomPopupContorller',
        controllerAs: 'accomPopup',
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
