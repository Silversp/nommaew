angular.module('controller.member', [])
  .controller('memberContorller', ['$rootScope', '$scope', '$uibModal','$http', function ($rootScope, $scope, $uibModal,$http) {
    var vm = this
   	vm.registerStatus = $rootScope.LoginStatus
   	vm.dateSelect = dateSelect
   	function dateSelect(){
      vm.showTable = true
   		var date = moment(vm.date).format('DD/MM/YYYY')
      if(moment(vm.date).format('E')<5){
        vm.heightRate = 0
      }else{
        vm.heightRate = 1
      }
      console.log()
   		$http.get('./reservDate?date='+date).then(function(res){
   			vm.room = res.data
        console.log(vm.room)
   		},function(res){
        vm.room = []
   			console.log(res)
   		})
   	}
  }])
