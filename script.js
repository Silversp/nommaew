angular
  .module('appModule', [
    'services.route',
    'controller.home',
    'ui.bootstrap',
    'controller.login',
    'controller.accom',
    'controller.accomPopup',
    'LocalStorageModule',
    'controller.member',
    'controller.register',
    'controller.rentList',
    'controller.edit',
    'controller.gallery',
    'controller.gallerypopup'

  ]).run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state
    $rootScope.$stateParams = $stateParams
  }
])
  .controller('appRun', appRun)
appRun.$inject = ['$rootScope', '$state', '$scope', '$uibModal', '$http']
function appRun ($rootScope, $state, $scope, $uibModal, $http) {
  $rootScope.show = [true, false, false, false, false, false, false]
  $scope.changeStage = changeStage
  $scope.hover = false
  $scope.login = login
  // $rootScope.LoginStatus = true
  // $rootScope.loginDetail = {
  //   'Name': 'admin',
  //   'Id': 9,
  //   'type': 1,
  //   'token': 'admin',
  //   'userName': 'admin'
  // }
  function changeStage (index) {
    for (var n = 0;n < $scope.show.length;n++) {
      $rootScope.show[n] = false
    }
    $rootScope.show[index] = true
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
            'Name': res.data[0].Name,
            'Id': res.data[0].Userid,
            'type': res.data[0].Usertype,
            'userName': res.data[0].Username,
            'surName': res.data[0].Surname,
            'token': res.data[0].Pass
          }
        }
      }, function error (res) {
        console.log(res)
      })
    })
  }
  $state.go('0')
}
