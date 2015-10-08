/**
 * Created by raj on 9/10/15.
 */
var myApp = angular.module('myApp', ['restangular', 'angular.filter','ngRoute','ngTable','ngLoadingSpinner']);
myApp.config(function($routeProvider, RestangularProvider) { //Configure routes and templates
        $routeProvider.
            when('/',{
            controller: ContactListCtrl,
            templateUrl: 'templates/list.html', // Template for contact list
            resolve: {
                Contacts: function(Restangular){
                    //Fetch all the contacts from API using Restangular
                    return Restangular.all('users').getList().$object;
                }
            }
        }).
            when('/admin',{
            controller: AdminCtrl,
            templateUrl:'templates/admin.html',// Template for admin
            resolve: {
                List: ['$q','Restangular',function($q, Restangular){
                    var deferred = $q.defer();
                    //Fetch all the contacts from API using Restangular
                    deferred.resolve( Restangular.all('users').getList().$object);
                    return deferred.promise;
                }]
            }
        }).
            when('/contacts/:Id', {
                controller:ContactCtrl,
                templateUrl:'templates/card.html',
                resolve: {
                    contact: function( Restangular, $route){
                        //Fetch single contact from API using Restangular
                        return Restangular.one('users', $route.current.params.Id).get();
                    }
                }
            }).
            otherwise({redirectTo:'/'});
    //Initialize library with API url to fetch data
        RestangularProvider.setBaseUrl('http://jsonplaceholder.typicode.com');
    });

function ContactListCtrl($scope, Contacts,  Restangular, NgTableParams){

    var data = Contacts;

    setTimeout(
        function() {
            $scope.tableParams = new NgTableParams({
                sorting: { name: "asc" },
                filter: {name:""}
            }, {
                data: data
            });
        },200);

}

function ContactCtrl($scope, $location, Restangular, contact) {
    $scope.contact = contact;
}

function AdminCtrl($scope, Restangular,NgTableParams, List){
    var array = [];
    $scope.list = List;
    setTimeout(
        function() {
            var el = [];
            angular.forEach(List, function(value, key) {
                array.push(value.name);
            }, array);
            for (var i in array) {
                var count = 1;
                var letter = array[i].charAt(0);
                for(j in array){
                    count = array[j].charAt(0)==letter?++count:count;
                }
                el.push({alpha:letter, total:count});
            }
            $scope.tableParams = new NgTableParams({
                sorting:{alpha:'asc'}
            }, {
                data: el
            });
        },600);


    /**/
}
myApp.filter('firstNames', function() {
    return function(str) {
        if(str == undefined || str === null){
            return '';
        }else{
            var firstnames = ""
            var strx = str.split(" ");
            for (var i=0; i < strx.length-1; i++){
                firstnames += strx[i] + " "
            }
            return firstnames;
        }
    }
});
myApp.filter('surname', function() {
    return function(str) {
        if(str == undefined || str === null){
            return '';
        }else{
            var strx = str.split(" ");
            return strx[strx.length - 1]
        }
    }
});
(function() {
    "use strict";

    angular.module("myApp").run(configureDefaults);
    configureDefaults.$inject = ["ngTableDefaults"];

    function configureDefaults(ngTableDefaults) {
        ngTableDefaults.params.count = 5;
        ngTableDefaults.settings.counts = [];
    }
})();