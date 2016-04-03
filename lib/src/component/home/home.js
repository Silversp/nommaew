angular.module('controller.home', [])
  .controller('homeContorller', ['$rootScope', '$interval', '$state', function ($rootScope, $interval, $state) {
    var vm = this
    var index = 0
    vm.createMap = createMap
    vm.show = false
    $rootScope.show = [false, false, false, false, false, false, false]
    var index = parseInt($state.current.name, 10)
    $rootScope.show[index] = true
    vm.cat = [true, false, false]
    $interval(function () {
      console.log(vm.cat, index)
      if (++index > 2) {
        index = 0
      }
      for (var n = 0;n < vm.cat.length;n++) {
        console.log(n, index)
        if (n !== index) {
          vm.cat[n] = false
        } else {
          vm.cat[n] = true
        }
      }
    }, 3000)
    function createMap () {
      setTimeout(function () {
        console.log('map')
        var map
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 13.9152586, lng: 99.4767047},
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        })
        var marker = new google.maps.Marker({
          position: {lat: 13.9152586, lng: 99.4767047},
          map: map,
          title: 'บ้านนมแมวรีทรีท'
        })
      }, 500)

    }

  }])
