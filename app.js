(function () {
    'use strict';

    angular.module('restaurantApp', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/signUp', {
                    templateUrl: 'signUp.html',
                    controller: 'SignUpController'
                })
                .when('/myInfo', {
                    templateUrl: 'myInfo.html',
                    controller: 'MyInfoController'
                })
                .otherwise({
                    redirectTo: '/signUp'
                });
        }])

        .controller('SignUpController', ['$scope', '$http', 'userService', function ($scope, $http, userService) {
            $scope.user = {};
            $scope.favoriteDishError = '';
            $scope.savedMessage = '';

            $scope.submitForm = function () {
                if ($scope.signUpForm.$valid) {
                    const menuUrl = `https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/${$scope.user.favoriteDish[0]}/menu_items/${$scope.user.favoriteDish}.json`;
                    $http.get(menuUrl).then(function (response) {
                        if (response.data) {
                            userService.saveUser($scope.user);
                            $scope.savedMessage = 'Your information has been saved.';
                            $scope.favoriteDishError = '';
                        } else {
                            $scope.favoriteDishError = 'No such menu number exists.';
                        }
                    });
                }
            };
        }])

        .controller('MyInfoController', ['$scope', 'userService', function ($scope, userService) {
            $scope.user = userService.getUser();
            if (!$scope.user) {
                $scope.message = "Not Signed Up Yet. Sign up Now!";
            }
        }])

        .service('userService', function () {
            let user = null;
            this.saveUser = function (userData) {
                user = userData;
            };
            this.getUser = function () {
                return user;
            };
        });

})();
