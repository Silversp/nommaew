angular.module('controller.gallerypopup',['ui.bootstrap'])
		.controller('gallerypopupContorller',['$uibModalInstance','items',function($uibModalInstance,items){
			var vm = this
			var picName = 1
			var roomName = items.roomName
			vm.part = './lib/src/img/'+roomName+'/'+roomName+picName+'.jpg'
			vm.changePicNext = changePicNext
			vm.changePicPrevious = changePicPrevious
			function changePicNext(){
				if(++picName>items.max){
					picName = 1
				}
				vm.part = './lib/src/img/'+roomName+'/'+roomName+picName+'.jpg'
			}
			function changePicPrevious(){
				if(--picName<1){
					picName = items.max
				}
				vm.part = './lib/src/img/'+roomName+'/'+roomName+picName+'.jpg'
			}
		}])