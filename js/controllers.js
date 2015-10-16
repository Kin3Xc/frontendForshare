

// modulo principal para los controladores de la aplicación
app = angular.module('forshare.controllers', ['ui.router', 'ngAnimate'])

app.controller('Home',['$rootScope', '$scope', 'Login_user', '$location', function($rootScope, $scope, Login_user, $location){
    
    Login_user.me(function(res) {
        $scope.perfil = res;
        if (!res.type) {
            console.log('No hay nadie logueado ' +res.type);
        }else{
            console.log('Estas logueado ' +res.type);
        }

    }, function() {
        $rootScope.error = 'Failed to fetch details';
    });

    $scope.logout = function() {
        console.log('Cierra sesión');
         Login_user.logout(function() {
                 window.location = "/"
                 // $location.path('/');
         }, function() {
                alert("Failed to logout!");
         });
     };

}]);


// LOGIN
app.controller('Login', ['$rootScope','$scope', '$location', '$localStorage', 'Login_user', function($rootScope, $scope, $location, $localStorage, Login_user){
    var vm = this;
    var obj_login = {};

    vm.login = function(){
        obj_login = {
            email: vm.email,
            password: vm.password
        };

        Login_user.signin(obj_login, function(res) {
             if (res.type == false) {
                     alert(res.data)
             } else {
                 $localStorage.token = res.data.token;
                 window.location = "/";
                 // $location.path('/');
             }
     }, function() {
             $rootScope.error = 'Failed to signin';
     })

        console.log(obj_login);
    }


    vm.me = function() {
         Login_user.me(function(res) {
                 $scope.perfil = res;
         }, function() {
                 $rootScope.error = 'Failed to fetch details';
         })
 };

    vm.token = $localStorage.token;

    

}]);


// SIGNUP
app.controller('Signup', ['$rootScope','$scope', '$location', '$localStorage', 'Login_user', function($rootScope, $scope, $location, $localStorage, Login_user){
    var vm = this;

    var obj_signup = {};

    vm.signup = function(){
        obj_signup = {
            nombre: vm.nombre,
            email: vm.email,
            password: vm.password
        };

        console.log(obj_signup);

     Login_user.save(obj_signup, function(res) {
             if (res.type == false) {
                     alert(res.data)
             } else {
                     $localStorage.token = res.data.token;
                     window.location = "/"
                     // $location.path('/');
             }
     }, function() {
            $rootScope.error = 'Failed to signup';
     });

    }

}]);




app.controller('Account', ['$scope', function($scope){
    console.log('Controlador de Account');
}]);




app.controller('Editar_perfil', ['$scope', function($scope){
    console.log('Controlador Editar_perfil');
}]);



// ***********************************************************************************************
// directiva para enviar la imagen al server
// esto deberia estar en un archivo independiente, es solo que es mi primera directiva xD
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
 
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])