var $ = jQuery.noConflict();;

var _procesaToken = function(){
    var urlIntegracion = 'https://api.salesup.com/integraciones/';
    var url_integracion_sesion = 'https://api.salesup.com/integraciones/sesion';
    var self = this;
    var objGeneral = {};

    this.procesaToken = function(obj){
        SAUP190122fn.loader();
        jQuery('#SAUP190122btnGuardaToken').addClass('disabled'); 
		
        var token_integracion = jQuery("#token_integracion").val().trim();

		if(SAUP190122fn.validaObligatorio()){
            SAUP190122fn.loaderElimina();
			var objetoGeneral = {
				url:'?page=salesup',
				token:token_integracion,
			}
            setTimeout(function(){
                self.agregaToken(objetoGeneral);
            },500);
			
		}else{
            SAUP190122fn.loaderElimina();
            SAUP190122fn.mensaje('errorCampos');
			jQuery('#SAUP190122btnGuardaToken').removeClass('disabled'); 
		}
    }

    this.agregaToken = function(obj){
        if(_.size(obj)==0){ 
            SAUP190122fn.loaderElimina();
            SAUP190122fn.mensaje('errorToken'); 
            jQuery('#SAUP190122btnGuardaToken').removeClass('disabled'); 
            return false; 
        }

        var sesion = self.pideTokenSesion({token:obj.token});
        
        if(sesion == 'error'){
            SAUP190122fn.loaderElimina();
            SAUP190122fn.mensaje('errorSesion');
            jQuery('#SAUP190122btnGuardaToken').removeClass('disabled');
            return false;
        }
        obj.sesion = sesion;
        obj.status = 1;
        self.guardaToken(obj);		
    }

    this.guardaToken = function(obj){
        if(_.size(obj)==0){ SAUP190122fn.mensaje('errorToken'); return false; };
        var procesaDato = function(res, err){
            if(err != 'success' && err){
                SAUP190122fn.loaderElimina();
				SAUP190122fn.mensaje('error');
				return false;
            }
            SAUP190122fn.loaderElimina();
            setTimeout(function(){
                SAUP190122fn.mensaje('exitoGuardarToken');
            });
            
            var jsonResultado = btoa(JSON.stringify(res));

            setTimeout(function(){
                location.href=obj.url+'&jsondata='+jsonResultado;
            },1000);

        }

        SAUP190122fn.peticionAjax({
            url:salesup.url,
            method:'POST',
            dataType:'json',
            data:{
                action:'su_crud_post',
                nonce:salesup.seguridad,
                token:obj.token,
                status:obj.status,
                sesion:obj.sesion,
                tipo:'add'
            },
            callback:procesaDato
        })			
    }

    this.extract = function(obj){
        if(obj){
            objGeneral.data = JSON.parse(atob(obj));
        }else{
            objGeneral.data = self.getToken();
        }

        return objGeneral;
    }

    this.actualizaTokenSesionDb = function(obj){
        var sesionNueva = obj.sesion;
        var procesaDato = function(res, err){
            if(err != 'success' && err && err != 1){
                SAUP190122fn.mensaje('errorSesion');
                return false;
            }
            objGeneral.data = sesionNueva;
        }

        SAUP190122fn.peticionAjax({
            url:salesup.url,
            method:'POST',
            dataType:'json',
            data:{
                action:'su_crud_put',
                nonce:salesup.seguridad,
                sesion:sesionNueva,
                id:parseInt(obj.id),
                tipo:'update_sesion'
            },
            callback:procesaDato
        })		
    }

    this.pideTokenSesion = function(obj){
        var tokenSesion = '';
        var id_integracion = 0;
        if(_.size(objGeneral)>0 && _.size(obj)==0){
            tokenSesion = objGeneral.data.token;
        }else if(_.size(obj)>0){
            tokenSesion = obj.token;
            id_integracion = obj.id;
        }else{
            var dataDb = self.getToken();
            tokenSesion = dataDb.token;
            id_integracion = dataDb.id;
        }
        
        var procesaToken = function(res, err){
            if(err != 'success' && err){
                tokenSesion = 'error';
                SAUP190122fn.msgError(' No se pudo conectar las cuentas.','Inténtalo nuevamente');
            }else{
                if(id_integracion){
                    self.actualizaTokenSesionDb({
                        id:id_integracion,
                        sesion:res[0].token
                    });
                }
                tokenSesion = res[0].token;
            }
            
        }
        
        SAUP190122fn.peticionAjax({
            url:url_integracion_sesion,
            method:'POST',
            data:{token:tokenSesion},
            callback:procesaToken,
            async:(id_integracion) ? true : false
        });

        return tokenSesion;
    }

    this.getToken = function(){
        var data = '';
        var procesaData = function(res, err){
            if(err != 'success' && err){
                SAUP190122fn.msgError('No se pudo obtener la sesion, intenta mas tarde.');
                return false;
            }
            data = res[0];
        }

        SAUP190122fn.peticionAjax({
            url:salesup.url,
            method:'GET',
            dataType:'json',
            data:{
                action:'su_crud_get',
                nonce:salesup.seguridad,
                tipo:'get'
            },
            callback:procesaData,
            async:false
        });
        
        return data;
    }

}