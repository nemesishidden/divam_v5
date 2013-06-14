/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var pictureSource;   // Origen de la imagen
var destinationType; // Formato del valor retornado
var db;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('logear').addEventListener('click', this.logear, false);
        
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('guardarLibro').addEventListener('click', this.guardarLibro, false);
        document.getElementById('newSolicitud').addEventListener('click', this.cambioPagina, false);
    },
    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        window.pictureSource=navigator.camera.PictureSourceType;
        window.destinationType=navigator.camera.DestinationType;
        window.db = window.openDatabase("solicitudesPorEnviar", "1.0", "Solicitudes por Enviar", 1000000);
        app.receivedEvent('deviceready');
    },

    baseDatos: function() {
        
        window.db = window.openDatabase("solicitudesPorEnviar", "1.0", "Solicitudes por Enviar", 1000000);
        window.db.transaction(
            function populateDB(tx) {
                 tx.executeSql('DROP TABLE IF EXISTS DEMO');
                 tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
                 tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
                 tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
            },function err(){
                console.log('error')
            },function successCB() {
                alert("success!");
            });
        //window.db.transaction(queryDB, errorCB);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Evento Recivido: ' + id);
    },
    scan: function() {
        console.log('scanning');
        try {
            window.plugins.barcodeScanner.scan(function(args) {
                console.log("Scanner result: \n" +
                    "text: " + args.text + "\n" +
                    "format: " + args.format + "\n" +
                    "cancelled: " + args.cancelled + "\n");
                /*
                if (args.format == "QR_CODE") {
                    window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
                }
                */
                //document.getElementById("texto").innerHTML = args.text;
                // document.getElementById("formato").innerHTML = args.format;
                app.buscarLibro(args.text);
                document.getElementById("isbn").value = args.text;
                // document.getElementById("texto").innerHTML = args.text;
                // document.getElementById("formato").innerHTML = args.format;
                // document.getElementById("cancelled").innerHTML = args.cancelled;
                // document.getElementById("args").innerHTML = args;
                $.mobile.changePage( '#newSolicitudPag', { transition: "slide"} );
                console.log(args);
            });
        } catch (ex) {
            console.log(ex.message);
        }
    },

    logear: function(){
        console.log('logear');
        $.ajax({
            url: 'data/libro.json',
            type: 'GET',
            dataType: 'json',
            error : function (){ document.title='error'; }, 
            success: function (data) {
                console.log("user: "+data.model.usuario);
                console.log("pass: "+data.model.pass);
                console.log("success: "+data.success);
                if(data.success){
                    app.obtenerPresupuestos();
                    var pag = '#inicio';
                    $.mobile.changePage( pag, { transition: "slide"} );
                }

                
            }
        });
    },
    cambioPagina: function(){
        //app.buscarLibro(9789568410575)
        var pag = '#'+this.id+'Pag';
        $.mobile.changePage( pag, { transition: "slide"} );
        console.log('this.cambioPagina');
    },

    obtenerPresupuestos: function(){

        $.ajax({
            url: 'data/presupuestos.json',
            type: 'POST',
            dataType: 'json',
            error : function (){ document.title='error'; }, 
            success: function (data) {
                if(data.success){
                    data.model.forEach(function(a){
                        console.log(a);
                        document.getElementById("listaPresupuestos");
                    });
                }
            }
        });
    },

    buscarLibro: function(codigoIsbn){
        $.ajax({
            url: 'data/libro.json',
            type: 'POST',
            dataType: 'json',
            error : function (){ document.title='error'; }, 
            success: function (data) {
                if(data.success){
                    data.model.forEach(function(a){
                        if(a.isbn == codigoIsbn){
                            document.getElementById("isbn").value = a.isbn;
                            document.getElementById("titulo").value = a.titulo;
                            document.getElementById("autor").value = a.autor;
                            document.getElementById("precioReferencia").value = a.precioReferencia;
                        }else{

                        }
                            //$( "#dialogoError" ).popup( "open" );
                    });
                }
            }
        });
    },

    guardarLibro: function(){
        console.log('guardarLibro');
        var pag = '#inicio';
        $.mobile.changePage( pag, { transition: "slide"} );
    },

    // Rellena la base de datos 
    //
    populateDB: function(tx) {
         tx.executeSql('DROP TABLE IF EXISTS DEMO');
         tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
         tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "Primera fila")');
         tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Segunda fila")');
    },

    queryDB: function(tx) {
        tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
    },

    querySuccess: function(tx, results) {
        // debería estar vacio ya que se inserto nada
        log("ID insert = " + results.insertId);
        console.log("ID insert = " + results.insertId);
        // Sera 0 debido que es una sentencia SQL de tipo 'select'
        console.log("Filas afectadas = " + results.rowAffected);
        // El numero de filas retornadas
        console.log("Filas retornadas = " + results.rows.length);
        document.getElementById("logBDD").innerHTML = "ID insert = " + results.insertId+"Filas afectadas = " + results.rowAffected+"Filas retornadas = " + results.rows.length;
        alert("ID insert = " + results.insertId+"Filas afectadas = " + results.rowAffected+"Filas retornadas = " + results.rows.length);
    },

    // Función 'callback' de error de transacción
    //
    errorCB: function(tx, err) {
        alert("Error procesando SQL: "+err);
    },

    // Función 'callback' de transacción satisfactoria
    //
    successCB:  function() {
        alert("bien!");
    }

};
