angular.module('services.route',['ui.router'])
.config(config)

config.$inject = ['$stateProvider','$urlRouterProvider']
function config($stateProvider,$urlRouterProvider){
	$stateProvider
	.state('0',{
		url:'/home',
		templateUrl:'./lib/src/component/home/home.html',
		controller: 'homeContorller',
		controllerAs: 'home'
	})
	$stateProvider
	.state('1',{
		url:'/aboutUs',
		templateUrl:'./lib/src/component/aboutus/about.html',
		controller: 'homeContorller',
		controllerAs: 'home'
	})
	$stateProvider
	.state('2',{
		url:'/accommodation',
		templateUrl:'./lib/src/component/accom/accom.html',
		controller: 'accomContorller',
		controllerAs: 'accom'
	})
	$stateProvider
	.state('3',{
		url:'/package',
		templateUrl:'./lib/src/component/package/package.html'
	})
	$stateProvider
	.state('4',{
		url:'/reservation',
		templateUrl:'./lib/src/component/reserv/reserv.html'
	})
	$stateProvider
	.state('5',{
		url:'/gallery',
		templateUrl:'./lib/src/component/gallery/gallery.html'
	})
	$stateProvider
	.state('6',{
		url:'/contactUs',
		templateUrl:'./lib/src/component/contactus/contactus.html'
	})
}