    <?php
    # definimos la carpeta destino
    $carpetaDestino="uploads/";

    echo 'Numero de imagenes envíadas: '.count($_FILES["imagenes_articulos"]['name']);
    echo ' Imagens: '. $_FILES["imagenes_articulos"][0];
    echo ' Hola test: '. $_POST["hola"];

 
    # si hay algun archivo que subir
    if(isset($_FILES["imagenes_articulos"]) && $_FILES["imagenes_articulos"]["name"][0])
    {
 
        # recorremos todos los arhivos que se han subido
        for($i=0;$i<count($_FILES["imagenes_articulos"]["name"]);$i++)
        {
 
            # si es un formato de imagen
            if($_FILES["imagenes_articulos"]["type"][$i]=="image/jpeg" || $_FILES["imagenes_articulos"]["type"][$i]=="image/pjpeg" || $_FILES["imagenes_articulos"]["type"][$i]=="image/gif" || $_FILES["imagenes_articulos"]["type"][$i]=="image/png")
            {
 
                # si exsite la carpeta o se ha creado
                if(file_exists($carpetaDestino) || @mkdir($carpetaDestino, 0777))
                {
                    $origen=$_FILES["imagenes_articulos"]["tmp_name"][$i];
                    $destino=$carpetaDestino.$_FILES["imagenes_articulos"]["name"][$i];
 
                    # movemos el archivo
                    if(@move_uploaded_file($origen, $destino))
                    {
                        echo "<br>".$_FILES["imagenes_articulos"]["name"][$i]." movido correctamente";
                    }else{
                        echo "<br>No se ha podido mover el archivo: ".$_FILES["imagenes_articulos"]["name"][$i];
                    }
                }else{
                    echo "<br>No se ha podido crear la carpeta: up/";
                }
            }else{
                echo "<br>".$_FILES["imagenes_articulos"]["name"][$i]." - NO es imagen jpg";
            }
        }
    }else{
        throw new Exception("Error Processing Request", 1); 
        // echo "<br>No se ha subido ninguna imagen";
    }
    ?>
</body>
</html>