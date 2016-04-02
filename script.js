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
    'controller.gallerypopup',
    'LocalStorageModule'
  ])
  .controller('appRun', appRun)
appRun.$inject = ['$rootScope', '$state', '$scope', '$uibModal', '$http', 'localStorageService']
function appRun ($rootScope, $state, $scope, $uibModal, $http, localStorageService) {
  $rootScope.show = [true, false, false, false, false, false, false]
  $scope.changeStage = changeStage
  $scope.hover = false
  $scope.login = login
  $scope.logout = logout
  if (localStorageService.get('login')) {
    $rootScope.LoginStatus = localStorageService.get('login').status
    $rootScope.loginDetail = localStorageService.get('login').loginDetail
  }
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
  function logout () {
    delete $rootScope.LoginStatus
    delete $rootScope.loginDetail
    localStorageService.remove('login')
    $state.reload()
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
          localStorageService.set('login', {'status': $rootScope.LoginStatus,'loginDetail': $rootScope.loginDetail})
           $state.reload()
        }
      }, function error (res) {
        console.log(res)
      })
    })
  }
  $state.go('0')
}
