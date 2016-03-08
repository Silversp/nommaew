angular.module('controller.login', [])
  .controller('loginContorller', ['$rootScope', '$uibModalInstance', function ($rootScope, $uibModalInstance) {
    var vm = this
    vm.login = login
    function login () {
      vm.loginData = {
        user: vm.user,
        pass: vm.pass
      }
      $uibModalInstance.close(vm.loginData)
    }
  }])
