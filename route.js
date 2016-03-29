angular.module('services.route', ['ui.router'])
  .config(config)

config.$inject = ['$stateProvider', '$urlRouterProvider']
function config ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('0', {
      url: '/home',
      templateUrl: './lib/src/component/home/home.html',
      controller: 'homeContorller',
      controllerAs: 'home'
    })
  $stateProvider
    .state('1', {
      url: '/aboutUs',
      templateUrl: './lib/src/component/aboutus/about.html',
      controller: 'homeContorller',
      controllerAs: 'home'
    })
  $stateProvider
    .state('2', {
      url: '/accommodation',
      templateUrl: './lib/src/component/accom/accom.html',
      controller: 'accomContorller',
      controllerAs: 'accom'
    })
  $stateProvider
    .state('3', {
      url: '/package',
      templateUrl: './lib/src/component/package/package.html',
      controller: 'homeContorller',
      controllerAs: 'home'
    })
  $stateProvider
    .state('4', {
      url: '/reservation',
      templateUrl: './lib/src/component/reserv/reserv.html',
      controller: 'memberContorller',
      controllerAs: 'member'
    })
  $stateProvider
    .state('5', {
      url: '/gallery',
      templateUrl: './lib/src/component/gallery/gallery.html',
      controller: 'galleryContorller',
      controllerAs: 'gallery'
    })
  $stateProvider
    .state('6', {
      url: '/contactUs',
      templateUrl: './lib/src/component/contactus/contactus.html',
      controller: 'homeContorller',
      controllerAs: 'home'
    })
  $stateProvider
    .state('7', {
      url: '/register',
      templateUrl: './lib/src/component/register/register.html',
      controller: 'registerContorller',
      controllerAs: 'regis'
    })
  $stateProvider
    .state('8', {
      url: '/rentlist',
      templateUrl: './lib/src/component/rentlist/rentlist.html',
      controller: 'rentListContorller',
      controllerAs: 'list'
    })
  $stateProvider
    .state('9', {
      url: '/editaccount',
      templateUrl: './lib/src/component/editprofile/editprofile.html',
      controller: 'editContorller',
      controllerAs: 'edit'
    })
}
