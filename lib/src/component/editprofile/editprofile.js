angular.module('controller.edit', ['LocalStorageModule'])
  .controller('editContorller', ['$rootScope', '$http', '$state', 'localStorageService', function ($rootScope, $http, $state, localStorageService) {
    var vm = this
    vm.submit = submit
    $rootScope.show = [false, false, false, false, false, false, false]
    var index = 4
    $rootScope.show[index] = true

    vm.user = $rootScope.loginDetail.userName
    vm.sName = $rootScope.loginDetail.surName
    vm.name = $rootScope.loginDetail.Name
    function submit () {
      if (vm.passwordNewCheck !== vm.passwordNew) {
        alert('กรุณากรอกpasswordให้ตรงกัน')
        return
      }
      var data = {
        username: vm.user,
        passwordOld: vm.passwordOld,
        passwordNew: vm.passwordNew,
        name: vm.name,
        sName: vm.sName,
        id: $rootScope.loginDetail.Id,
        changePassword: vm.changePass,
        token: $rootScope.loginDetail.token
      }
      var req = {
        method: 'PUT',
        url: '/accountSetting',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      }

      $http(req).then(function (res) {
        $rootScope.loginDetail['Name'] = data.name
        $rootScope.loginDetail['userName'] = data.username
        $rootScope.loginDetail['surName'] = data.sName
        if (res.data) {
          $rootScope.loginDetail['token'] = res.data
        }
        localStorageService.set('login', {'status': $rootScope.LoginStatus,'loginDetail': $rootScope.loginDetail})
        if (window.confirm('แก้ไขข้อมูลสำเร็จ')) {
          $state.go('0')
        } else {
          $state.go('0')
        }
      }, function (res) {
        console.log(res)
        var text = 'พบข้อผิดพลาดกรุณาลองใหม่'
        if (res.status === 405) {
          text = res.data
        }
        alert(text)
      })
    }
  }])
