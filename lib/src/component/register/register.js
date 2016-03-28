angular.module('controller.register', [])
  .controller('registerContorller', ['$rootScope', '$http', '$state', function ($rootScope, $http, $state) {
    var vm = this
    vm.submit = submit
    vm.checkPass = checkPass
    vm.valid = false
    $rootScope.show = [false, false, false, false, false, false, false]
    var index = 4
    $rootScope.show[index] = true
    function checkPass () {
      if (vm.password === vm.passwordRecheck) {
        vm.valid = true
      } else {
        vm.valid = false
      }
    }
    function submit () {
      var data = {
        username: vm.user,
        password: vm.password,
        name: vm.name,
        sName: vm.sName
      }
      var req = {
        method: 'POST',
        url: '/signup',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }

      $http(req).then(function (res) {
        if (window.confirm('สมัคสมาชิกสำเร็จ')) {
          $state.go('0')
        } else {
          $state.go('0')
        }
      }, function (res) {
        if (window.confirm('พบข้อผิดพลาดกรุณาลองใหม่')) {
          $state.reload()
        } else {
          $state.reload()
        }
      })
    }
  }])
