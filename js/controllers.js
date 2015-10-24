

// modulo principal para los controladores de la aplicación
app = angular.module('forshare.controllers', ['ui.router', 'ngAnimate'])

app.controller('Home',['$rootScope', '$scope', 'Login_user', '$location', 'Home', function($rootScope, $scope, Login_user, $location, Home){
    
    $scope.mensaje_articulos = null;
    $scope.mensaje_compartir = null;
    $scope.mensaje_intercambiar = null;

    $scope.show_noti = false;
    $scope.count = 0;

    var id=null;

    // articulos recientes
    Home.getArticulos(function(res){
        if (res.type) {
            var articulos = [];

            if (res.data.length > 4) {
                for (var i = 0; i <= 3; i++) {
                    articulos[i] = res.data[i];
                    // para mostrar los primeros 50 caracteres de la descripcion
                    articulos[i].descripcion = articulos[i].descripcion.substr(0,50) + '...'; 
                    $scope.articulos = articulos;
                };

            }else{
                articulos = res.data;
                for (var i = 0; i <= res.data.length-1; i++) {
                    // para mostrar los primeros 50 caracteres de la descripcion
                    articulos[i].descripcion = articulos[i].descripcion.substr(0,50) + '...'; 
                    $scope.articulos = articulos;
                };
            }
            
            if ($scope.articulos == null) {
                $scope.mensaje_articulos = 'No hay articulos para mostrar :(';
            }
            

        }else{
            $scope.mensaje = 'No hay articulos para mostrar';
        }
    }, function(){
        $rootScope.error = 'Failed to fetch details';
    });


    // articulos para compartir
    Home.getArticulosCompartir(function(res){
        if (res.type) {
            var articulos = [];

            if (res.data.length > 4) {
                 for (var i = 0; i <= 3; i++) {
                    articulos[i] = res.data[i];
                    // para mostrar los primeros 50 caracteres de la descripcion
                    articulos[i].descripcion = articulos[i].descripcion.substr(0,50) + '...'; 
                    $scope.articulosCompartir = articulos;
                };
            }else{
                articulos = res.data;
                 for (var i = 0; i <= res.data.length-1 ; i++) {
                    // para mostrar los primeros 50 caracteres de la descripcion
                    articulos[i].descripcion = articulos[i].descripcion.substr(0,50) + '...'; 
                    $scope.articulosCompartir = articulos;
                };
            }

            if ($scope.articulosCompartir == null) {
                $scope.mensaje_compartir = 'No hay articulos para compartir :(';
            }
           
        }else{
            $scope.mensaje = 'No hay articulos para mostrar';
        }
    }, function(){
        $rootScope.error = 'Failed to fetch details';
    });

   // articulos para intercambiar
    Home.getArticulosIntercambiar(function(res){
        if (res.type) {
            var articulos = [];

            if (res.data.length > 4) {
                 for (var i = 0; i <= 3; i++) {
                    articulos[i] = res.data[i];
                    // para mostrar los primeros 50 caracteres de la descripcion
                    articulos[i].descripcion = articulos[i].descripcion.substr(0,50) + '...'; 
                    $scope.articulosIntercambiar = articulos;
                };
            }else{
                articulos = res.data;
                 for (var i = 0; i <= res.data.length-1 ; i++) {
                    // para mostrar los primeros 50 caracteres de la descripcion
                    articulos[i].descripcion = articulos[i].descripcion.substr(0,50) + '...'; 
                    $scope.articulosIntercambiar = articulos;
                };
            }
            
            if ($scope.articulosIntercambiar == null) {
                $scope.mensaje_intercambiar = 'No hay articulos para intercambiar :(';
            }
           
        }else{
            $scope.mensaje = 'No hay articulos para mostrar';
        }
    }, function(){
        $rootScope.error = 'Failed to fetch details';
    });

    $scope.precioTotal= 0;    

    // devuelve el usuario logueado
    Login_user.me(function(res) {
        if (res.type) {
            $scope.perfil = res;

                // carrito
                var count = 0;
                var carro = [];
                var data = null;
                
                // pedidos
                var numArticulo = new Firebase("https://forshare.firebaseio.com/pedidos");
                numArticulo.orderByChild("usuario").equalTo(res.data._id).on("child_added", function(snapshot) {
                    carro[count] = snapshot.val();
                    carro[count].$id = snapshot.key();
                    data = carro.filter(Boolean);
                    $scope.pedidos = data;
                    $scope.count = data.length;
                    
                    console.log(data[count].precio);

                    $scope.precioTotal = $scope.precioTotal + parseInt(data[count].precio);
                    count++;
                   
                });


                // notification 'sin asignar'
                var count1 = 0;
                var noti1 = [];
                var data1 = null;

                var notificationes = new Firebase("https://forshare.firebaseio.com/notification");
                notificationes.orderByChild("usuario_dueno").equalTo(res.data._id).on("child_added", function(snapshot) {
                    count1++;
                    noti1[count1] = snapshot.val();
                    noti1[count1].$id = snapshot.key();
                    data1 = noti1.filter(Boolean);
                    $scope.notify_no_asignado = data1;
                    $scope.noti_count = data1.length;

                });


                // notification 'prestado'
                var count2 = 0;
                var noti2 = [];
                var data2 = null;
                
                var notifications = new Firebase("https://forshare.firebaseio.com/notification");
                notifications.orderByChild("usuario_demanda").equalTo(res.data._id).on("child_added", function(snapshot) {
                    noti2[count2] = snapshot.val();
                    noti2[count2].$id = snapshot.key();
                    data2 = noti2.filter(Boolean);
                    $scope.notify_asignado = data2;
               
                    count1++;
                });


        }else{
            console.log('No hay nadie logueado');
        }

    }, function() {
        $rootScope.error = 'Failed to fetch details';
    });


    // si lo presto
    $scope.si = function(id){
        console.log('Dijo que si '+id);
        var notification = new Firebase("https://forshare.firebaseio.com/notification/"+id);
        notification.update({
            estado: 'prestado',
            mensaje: 'Te han pretado el artículo que pediste'
        });
    };


    // no lo presto
    $scope.no = function(id){
        console.log('Dijo que no '+id);
        var notification = new Firebase("https://forshare.firebaseio.com/notification/"+id);
        notification.remove();
    };

    

    // cerrar session de usuario
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




app.controller('Account', ['$scope', 'Login_user', function($scope, Login_user){
    var vm = this;

    Login_user.me(function(res){
    if (res.type) {
        vm.usuario = res.data;
    }else{
        alert('Registrate o ingresa con tu usuario para poder comentar');
    }

    }, function() {
        $rootScope.error = 'Failed to fetch details';
    });
}]);



app.controller('Publicar', ['$scope', 'Categorias', 'Articulo', '$http', 'Login_user', function($scope, Categorias, Articulo, $http, Login_user){
    var vm = this;
    var obj_publicar = {};

    $scope.tipos = [
        {
            nombre: 'Compartir',
            valor: 'compartir'
        },
        {
            nombre: 'Intercambio',
            valor: 'intercambio'
        }
    ];

    // categorias
    Categorias.getCategorias(function(res){
        if (!res.type) {
            $scope.categorias = null;
        }else{
            $scope.categorias = res.data;
        }
     },function() {
        $rootScope.error = 'Failed to fetch details';
    });


    // publicar
    vm.compartir = function(){

        var id_user = null;
        var files = vm.imagenes;
        var fd = new FormData();
        // fd.append('imagenes_articulos', files[0]);

        var imagenes = [];
        var img_send = [];


        for (var i = 0; i < files.length; i++) {
            imagenes[i] = files[i].name;
            fd.append('imagenes_articulos[]', files[i]);
        }


        Login_user.me(function(res){
            if (res.type) {
                id_user = res.data._id;
            }
        })

        
        obj_publicar = {
            articulo: vm.articulo,
            categoria: vm.categoria,
            precio: vm.precio,
            dias: vm.dias,
            tipo: vm.tipo,
            id_user: id_user,
            descripcion: vm.descripcion,
            observacion: vm.observacion,
            imagenes: imagenes
        };

        Articulo.sendArticulo(obj_publicar, function(res){
            if (res.type) {
                // subo las imagenes al server
                console.log(fd);
                upload(fd);
            }
        });
    }



    // funcion que permite subir las imagenes de un articulo al server
    function upload (form) {
    $http.post('http://forshare.co/test/php/files_articulos.php',form, {
        transformRequest: angular.identity, 
        headers: {'Content-Type': undefined}
        })
        .success(function(response){
            console.log('Respuesta: '+response);
        })
        .error(function(response){
    });
};

}]);



app.controller('Editar_perfil', ['$scope', function($scope){
    
}]);


// controlador que permite gestionar la vista de articulo por id
app.controller('ArticuloID', ['$rootScope', '$scope', 'Comentarios', 'Pedidos', 'Notification', 'Login_user', '$stateParams', 'Articulo', function($rootScope, $scope, Comentarios, Pedidos, Notification, Login_user, $stateParams, Articulo){
    var vm = this;
    vm.articulo = null;
    vm.ver_noti = false;

    vm.usuario = {};

    var id = $stateParams.id;

    // cargo los comentarios del articulo
    // vm.comentarios = Comentarios;
    var count = 0;
    var coment = [];

    var comentarios = new Firebase("https://forshare.firebaseio.com/comentarios");
    comentarios.orderByChild("id_articulo").equalTo(id).on("child_added", function(snapshot) {
        count++;
        coment[count] = snapshot.val();
        vm.comentarios = coment.filter(Boolean);
    });

    var usuario =null;

    // usuarios registrado
    Login_user.me(function(res){
        if (res.type) {
            usuario = res.data;
            console.log(usuario);
        }
    });


    // retorna un articulo por su ID
    Articulo.getArticuloID(id, function(res){
        console.log(res.data[0].imagenes);
        vm.articulo = res.data;
    });

    // funcion que permite agregar un comentario al articulo
    vm.add_comentario = function(){
        
        Login_user.me(function(res){
        if (res.type) {
            vm.usuario.nombre = res.data.nombre;
            vm.usuario.id = res.data._id;

            Comentarios.$add({
                comentario: vm.comentario,
                usuario: vm.usuario.nombre,
                id_user: vm.usuario.id,
                id_articulo: id
            });

            vm.comentario = '';
        }else{
            alert('Registrate o ingresa con tu usuario para poder comentar');
        }

        }, function() {
            $rootScope.error = 'Failed to fetch details';
        });
    }


    //funcion para pedir un articulo prestado
    vm.pedir_prestado = function(articulo){

        articulo.usuario = usuario._id;
        articulo.estado = 'sin asignar';
        
        articulo._id = id;

        var notification = {
            articulo: articulo.articulo,
            estado: 'sin asignar',
            valor: articulo.precio,
            usuario: usuario.nombre,
            mensaje: 'El usuario ' + usuario.nombre + ' ha pedido prestado tu articulo: '+ articulo.articulo,
            id_articulo: articulo._id,
            usuario_dueno: articulo.id_user._id,
            usuario_demanda: usuario._id
        };

        Pedidos.$add(articulo);
        Notification.$add(notification);
        vm.ver_noti = true;
        vm.mensaje = 'Solicitid envíada';
    }

}]);



app.controller('Articulos', ['$rootScope', '$scope','Home', '$stateParams', function($rootScope, $scope, Home, $stateParams){
    var vm = this;
    $scope.mensaje = null;

    var nombre = $stateParams.nombre;

    switch(nombre){
        case 'all':
            Home.getArticulos(function(res){
                $scope.articulos = res.data;
            });
            $scope.title = "Todos los artículos";
        break;

        case 'compartir':
            Home.getArticulosCompartir(function(res){
                $scope.articulos = res.data;
            });
            $scope.title = "Articulos para "+ nombre;
        break;

        case 'intercambiar':
            Home.getArticulosIntercambiar(function(res){
                $scope.articulos = res.data;
            });
            $scope.title = "Articulos para "+ nombre;
        break;

        default:
            $scope.mesaje = 'No hay articulos para mostrar';
    }

}]);


app.controller('User', ['$rootScope', '$scope', '$stateParams', 'Home', function($rootScope, $scope, $stateParams, Home){
    var user = $stateParams.id;

    Home.getUserID(user, function(res){
        if (res.type) {
            $scope.user = res.data;
            console.log(res.data);
        }
    });

}]);


app.controller('Categorias', ['$rootScope', '$scope','Categorias', '$stateParams', function($rootScope, $scope, Categorias, $stateParams){
    var vm = this;
    $scope.mensaje = null;
    $scope.count = 0;

    var categoria = $stateParams.categoria;
    $scope.title = categoria;

    Categorias.getArticulosCategoria(categoria, function(res){
        $scope.articulos = res.data;
        $scope.count = res.count;

        if ($scope.articulos == '') {
            $scope.mensaje = 'No hay articulos en esta categoría :(';
        }
    });



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
                    modelSetter(scope, element[0].files);
                });
            });
        }
    };
}])

// app.directive("fileModel", [function () {
//     return {
//         scope: {
//             fileread: "="
//         },
//         link: function (scope, element, attributes) {
//             element.bind("change", function (changeEvent) {
//                 scope.$apply(function () {
//                     // scope.fileread = changeEvent.target.files[0];
//                     // or all selected files:
//                     scope.fileread = changeEvent.target.files;
//                 });
//             });
//         }
//     }
// }]);