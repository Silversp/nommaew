angular.module('controller.register', [])
  .controller('registerContorller', ['$http', '$state', function ($http, $state) {
    var vm = this
    vm.submit = submit
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
          $state.reload()
        } else {
          $state.reload()
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
