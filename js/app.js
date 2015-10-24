
// modulo principal de la aplicación
var app = angular.module('forshare', ['forshare.controllers', 'forshare.services', 'ngStorage', 'firebase']);


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
			controller: 'Publicar',
			controllerAs: 'publicar'
		})

		.state('articulo',{
			url: '/articulo/:id',
			templateUrl: 'partials/articulo.html',
			controller: 'ArticuloID',
			controllerAs: 'articulo'
		})

		.state('articulos',{
			url: '/articulos/:nombre',
			templateUrl: 'partials/articulos.html',
			controller: 'Articulos',
			controllerAs: 'articulos'
		})

		.state('categoria',{
			url: '/categoria/:categoria',
			templateUrl: 'partials/categoria.html',
			controller: 'Categorias',
			controllerAs: 'categorias'
		})

		.state('historial',{
			url: '/historial',
			templateUrl: 'partials/historial.html'
		})

		.state('carrito',{
			url: '/carrito',
			templateUrl: 'partials/carrito.html'
		})

		.state('mis_articulos',{
			url: '/mis_articulos',
			templateUrl: 'partials/mis_articulos.html'
		})

		.state('notification',{
			url: '/notification',
			templateUrl: 'partials/notification.html'
		})

		.state('user',{
			url: '/user/:id',
			templateUrl: 'partials/user.html',
			controller: 'User'
		})

		// .state('detalleArticulo',{
		// 	url: '/articulo/:id',
		// 	templateUrl: 'partials/detalle-articulo.html'
		// })

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

