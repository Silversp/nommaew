angular
  .module('appModule', [
    'services.route',
    'controller.home',
    'ui.bootstrap',
    'controller.login',
    'controller.accom',
    'controller.accomPopup',
    'LocalStorageModule',
    'controller.member'

  ])
  .controller('appRun', appRun)
appRun.$inject = ['$rootScope', '$state', '$scope', '$uibModal', '$http']
function appRun ($rootScope, $state, $scope, $uibModal, $http) {
  $scope.show = [true, false, false, false, false, false, false]
  $scope.changeStage = changeStage
  $scope.hover = false
  $scope.login = login
  $rootScope.LoginStatus = true
  $rootScope.loginDetail = {
    'Name': 'test',
    'Id': 7,
    'type': 1
  }

  function changeStage (index) {
    for (var n = 0;n < $scope.show.length;n++) {
      $scope.show[n] = false
    }
    $scope.show[index] = true
    $state.go(index.toString())
  }
  function login () {
    var modalConfig = {
      templateUrl: './lib/src/component/login/login.html',
      controller: 'loginContorller',
      controllerAs: 'login'
    }
    var modalInstance = $uibModal.open(modalConfig)
    modalInstance.result.then(function (loginData) {
      var option = {
        method: 'post',
        url: '/login',
        headers: {
          'Content-Type': 'application/json'
        },
        data: loginData
      }
      $http(option).then(function success (res) {
        console.log(res)
        if (!res.data || res.data.length < 1) {
          alert('login Fail')
        } else {
          alert('login Success')
          $rootScope.LoginStatus = true
          $rootScope.loginDetail = {
            'Name': res.data[0].Username,
            'Id': res.data[0].Userid,
            'type': res.data[0].Usertype
          }
        }
      }, function error (res) {
        console.log(res)
      })
    })
  }
  $state.go('0')
}
