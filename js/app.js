
// modulo principal de la aplicación
var app = angular.module('forshare', ['forshare.controllers', 'forshare.services', 'ngStorage']);


//app.constant('firebaseUrl', 'https://tucocina.firebaseio.com/');

// configuración de las rutas para la aplicación web
app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider){

	// defino las rutas de la app
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'partials/home.html',
			controller: 'Home',
			controllerAs: 'home'
		})

		.state('login', {
			url: '/login',
			templateUrl: 'partials/login.html',
			controller: 'Login',
			controllerAs: 'login'
		})

		.state('signup',{
			url: '/signup',
			templateUrl: 'partials/signup.html',
			controller: 'Signup',
			controllerAs: 'signup'
		})

		.state('account',{
			url: '/account',
			templateUrl: 'partials/account.html',
			controller: 'Account',
			controllerAs: 'account'
		})

		.state('publicar',{
			url: '/publicar',
			templateUrl: 'partials/publicar.html',
			controller: 'Account',
			controllerAs: 'account'
		})
		.state('categoria',{
			url: '/categoria',
			templateUrl: 'partials/categoria.html'
		})
		.state('categorias',{
			url: '/categorias',
			templateUrl: 'partials/categorias.html'
		})
		.state('detalleArticulo',{
			url: '/articulo/:idArticulo',
			templateUrl: 'partials/detalle-articulo.html'
		})

		.state('edit_profile',{
			url: '/edit_profile',
			templateUrl: 'partials/edit_profile.html',
			controller: 'Editar_perfil',
			controllerAs: 'editar_perfil'
		});

		$urlRouterProvider.otherwise('/');


	$httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
		return {
		        'request': function (config) {
		            config.headers = config.headers || {};
		            if ($localStorage.token) {
		                config.headers.Authorization = 'Bearer ' + $localStorage.token;
		            }
		            return config;
		        },
		        'responseError': function(response) {
		            if(response.status === 401 || response.status === 403) {
		                $location.path('/login');
		            }
		            return $q.reject(response);
		        }
		    };
	}]);

});
