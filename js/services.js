
var app = angular.module('forshare.services', [])

app.factory('Login_user', ['$http', '$localStorage', function($http, $localStorage){
	var baseUrl = "https://forshare-api.herokuapp.com";

	function changeUser(user) {
    angular.extend(currentUser, user);
  }

	function urlBase64Decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
          case 0:
              break;
          case 2:
              output += '==';
              break;
          case 3:
              output += '=';
              break;
          default:
              throw 'Illegal base64url string!';
      }
      return window.atob(output);
  }


	function getUserFromToken() {
      var token = $localStorage.token;
      var user = {};
      if (typeof token !== 'undefined') {
          var encoded = token.split('.')[1];
          user = JSON.parse(urlBase64Decode(encoded));
      }
      return user;
  }

	var currentUser = getUserFromToken();

	return {
		 save: function(data, success, error) {
				 $http.post(baseUrl + '/api/signup', data).success(success).error(error)
		 },
		 signin: function(data, success, error) {
				 $http.post(baseUrl + '/api/login', data).success(success).error(error)
		 },
		 me: function(success, error) {
				 $http.get(baseUrl + '/api/me').success(success).error(error)
		 },
		 logout: function(success) {
				 changeUser({});
				 delete $localStorage.token;
				 success();
		 }
 };

}]);

app.factory('Home', ['$http', function($http){
  var baseUrl = "https://forshare-api.herokuapp.com";
  return {
    // servicio que retorna todos los articulos dela DB
    getArticulos: function(success, err){
      $http.get(baseUrl+'/api/articulos').success(success).error(err)
    },

    // retorna los articulos para compartir
    getArticulosCompartir: function(success, err){
      $http.get(baseUrl+'/api/compartir/articulos').success(success).error(err)
    },

     // retorna los articulos para compartir
    getArticulosIntercambiar: function(success, err){
      $http.get(baseUrl+'/api/intercambiar/articulos').success(success).error(err)
    },

    getUserID: function(id, success, err){
      $http.get(baseUrl+'/api/user/'+id).success(success).error(err)
    }

  }
}]);


app.factory('Categorias', ['$http', function($http){
  var baseUrl = "https://forshare-api.herokuapp.com";
  return {
    getCategorias: function(success, err){
      $http.get(baseUrl+'/api/categorias').success(success).error(err)
    },

    getArticulosCategoria: function(data, success, err){
      $http.get(baseUrl+'/api/articulos/'+data).success(success).error(err)
    }
  }
}]);



app.factory('Articulo', ['$http', function($http){
  var baseUrl = "https://forshare-api.herokuapp.com";

  return {
    sendArticulo: function(data, success, err){
      $http.post(baseUrl + '/api/articulo/add', data).success(success).error(err)
    },

    getArticuloID: function(data, success, err){
      $http.get(baseUrl + '/api/articulo/' + data).success(success).error(err)
    }

  }

}]);



app.factory("Comentarios", function($firebaseArray) {
  var comentarios = new Firebase("https://forshare.firebaseio.com/comentarios");
  return $firebaseArray(comentarios);
});

app.factory("Pedidos", function($firebaseArray) {
  var pedidos = new Firebase("https://forshare.firebaseio.com/pedidos");
  return $firebaseArray(pedidos);
});

app.factory("Notification", function($firebaseArray) {
  var notification = new Firebase("https://forshare.firebaseio.com/notification");
  return $firebaseArray(notification);
});

