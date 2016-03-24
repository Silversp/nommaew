angular.module('controller.member', [])
  .controller('memberContorller', ['$rootScope', '$scope', '$uibModal', '$http', '$state', function ($rootScope, $scope, $uibModal, $http, $state) {
    var vm = this
    vm.registerStatus = $rootScope.LoginStatus
    vm.outDateSelect = outDateSelect
    vm.inDateSelect = inDateSelect
    vm.reserv = reserv
    vm.selectCheck = selectCheck
    vm.roomSelect = {}
    vm.net = 0
    var outDate
    var inDate
    function selectCheck (id, price) {
      console.log(id)
      if (vm.roomSelect[id]) {
        delete vm.roomSelect[id]
        vm.net -= price
      } else {
        vm.roomSelect[id] = id
        vm.net += price
      }
    }
    function reserv () {
      console.log(vm.roomSelect)
      var req = {
        method: 'POST',
        url: '/reserv',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'outDate': outDate,
          'inDate': inDate,
          'user': $rootScope.loginDetail.Id,
          'roomId': vm.roomSelect,
          'rentDate': moment().format('DD/MM/YYYY'),
          'srent': '',
          'status': '0'
        }
      }
      $http(req).then(function (res) {
        if (window.confirm('จองสำเร็จ')) {
          $state.reload()
        } else {
          $state.reload()
        }
      }, function (res) {
        if (window.confirm('จองสำเร็จ')) {
          $state.reload()
        } else {
          $state.reload()
        }
      })
    }
    function inDateSelect () {
      vm.minOut = moment(vm.inDate).add(1, 'days').format('YYYY-MM-DD')
    }
    function outDateSelect () {
      console.log('sadf')
      vm.showTable = true
      var duration = moment.duration(moment(vm.outDate).diff(moment(vm.inDate)))
      vm.days = duration.asDays()
      console.log(vm.days)
      outDate = moment(vm.outDate).format('DD/MM/YYYY')
      inDate = moment(vm.inDate).format('DD/MM/YYYY')
      if (moment(vm.outDate).format('E') < 5) {
        vm.heightRate = 0
      } else {
        vm.heightRate = 1
      }
      console.log()
      $http.get('./reservDate?outDate=' + outDate + '&inDate=' + inDate).then(function (res) {
        vm.room = res.data
        console.log(vm.room)
      }, function (res) {
        vm.room = []
        console.log(res)
      })
    }
  }])
