angular.module('controller.rentList', [])
  .controller('rentListContorller', ['$rootScope', '$http', '$state', function ($rootScope, $http, $state) {
    var vm = this
    var url
    if (!$rootScope.loginDetail) {
      $state.go('4')
    }
    vm.orderBy = 'DateinD'
    vm.dayAmount = dayAmount
    vm.userType = $rootScope.loginDetail.type
    vm.changeStatus = changeStatus
    if ($rootScope.loginDetail.type == 0) {
      url = '/userlist?id=' + $rootScope.loginDetail.Id
    } else {
      url = '/staflist'
    }
    $http.get(url).then(function (res) {
      res.data.forEach(function (data) {
        data.DateinD = moment(data.Datein, 'DD/MM/YYYY')
        data.DateoutD = moment(data.Dateout, 'DD/MM/YYYY')
        data.rent_dateD = moment(data.rent_date, 'DD/MM/YYYY')
        data.totalDate = dayAmount(data.Datein, data.Dateout)
        data.totalPrice = data.totalDate * data.price
      })
      vm.datas = res.data
    }, function (res) {
      console.log(res)
    })
    function changeStatus (rentId, status) {
      var req = {
        method: 'PUT',
        url: '/changeStatus',
        headers: {
          'Content-Type': 'application/json',
          'user': $rootScope.loginDetail.userName,
          'token': $rootScope.loginDetail.token
        },
        data: {
          'rentId': rentId,
          'status': status
        }
      }
      console.log(req)
      $http(req).then(function (res) {
        $state.reload()
      }, function (res) {
        if (window.confirm('พบข้อผิดพลาดกรุณาลองใหม่')) {
          $state.reload()
        } else {
          $state.reload()
        }
      })
    }
    function dayAmount (inD, out) {
      var duration = moment.duration(moment(out, 'DD/MM/YYYY').diff(moment(inD, 'DD/MM/YYYY')))
      var days = duration.asDays()
      return parseInt(days)
    }
  }])
