angular.module('controller.login',[])
		.controller('loginContorller',['$uibModalInstance',function($uibModalInstance){
			var vm = this
			vm.login = login
			function login() {
				vm.loginData = {
					user:vm.user,
					pass:vm.pass
				}
				$uibModalInstance.close(vm.loginData)
			}
		}])