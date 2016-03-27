angular.module('controller.edit', [])
  .controller('editContorller', ['$rootScope', '$http', '$state', function ($rootScope, $http, $state) {
    var vm = this
    vm.submit = submit
    $rootScope.show = [false, false, false, false, false, false, false]
    var index = 4
    $rootScope.show[index] = true

    vm.user = $rootScope.loginDetail.userName
    vm.sName = $rootScope.loginDetail.surName
    vm.name = $rootScope.loginDetail.Name
    console.log('a', vm.user, vm.sName, vm.name)
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
