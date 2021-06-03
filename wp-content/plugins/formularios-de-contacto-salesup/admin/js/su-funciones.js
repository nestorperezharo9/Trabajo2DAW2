var $ = jQuery.noConflict();;
    
var _fn = function(){
    var self = this;
    this.peticionAjax = function (obj) {
        var method = (obj.method) ? obj.method : 'GET',
            url = (obj.url) ? obj.url : '',
            data = (obj.data) ? obj.data : '',
            callback = (obj.callback) ? obj.callback : '',
            dataType = (obj.dataType) ? obj.dataType : 'json',
            async = (obj.async) ? true : false;

        var config = {
            method: method,
            dataType: dataType,
            url: url,
            data: data,
            async:async,
            beforeSend: function(request) { 
                request.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded'); 
            }
        }

        if (!url) {
            console.error('Ruta invalida');
            return false;
        }
        
        jQuery.ajax(config).done(function(data,status,obj){
            callback(data,'');
        }).fail(function(err,status,obj){
            if(err.responseJSON[0].code == 4){
                var sesion = SAUP190122procesaToken.getToken();
                SAUP190122principal.actualizaSesion(sesion.token, sesion.id);
            }
            callback('',err);
        });
    }

    this.validaObligatorio = function(form){
        var formValida = (form) ? form : '';
        var obligatorio = (jQuery(formValida + ' .obligatorio').length>0) ? jQuery(formValida + ' .obligatorio') : jQuery(formValida + ' .obliga');
        
        var count = 0;
        for (let index = 0; index < obligatorio.length; index++) {
            if(jQuery(obligatorio[index]).val()==""){
                jQuery(obligatorio[index]).addClass('is-invalid');
                count++;
            }else{
                jQuery(obligatorio[index]).removeClass('is-invalid');
            }
        } 

        return (count == 0) ? true : false;
    }

    this.initTooltip = function(){
        jQuery('[data-toggle="tooltip"]').tooltip({
          position: {
            my: "center bottom-20",
            at: "center top",
            using: function( position, feedback ) {
              jQuery( this ).css( position );
              jQuery( "<div>" )
                .addClass( "arrow" )
                .addClass( feedback.vertical )
                .addClass( feedback.horizontal )
                .appendTo( this );
            }
          }
        });
    }

    this.loader = function(elemento){
        iziToast.info({
            title: 'Espera un momento.',
            position:'topCenter',
            message: 'por favor.',
            color:'gray',
            icon: 'fa fa-spinner fa-pulse fa-3x fa-fw',
            timeout: false,
            animateInside: false,
            progressBar: false,
        });
    }

    this.loaderElimina = function(){
        if(jQuery('.iziToast').length){
            iziToast.hide({
                transitionOut: 'fadeOutUp'
            }, '.iziToast');
        }
       
    }

    this.msgError = function(title, msg){
        title = title || 'Ocurrio un error.';
        iziToast.error({
            title: title,
            position:'topRight',
            icon:'fa fa-exclamation-triangle',
            message: msg || '',
        });
        
    }

    this.msgInfo = function(title, msg){
        title = title || 'Tip!';
        iziToast.info({
            title: title,
            position:'topRight',
            icon:'fa fa-exclamation-circle',
            message: msg || '',
        });
        
    }

    this.msgSuccess = function(title, msg){
        title = title || 'Exito.';
        iziToast.success({
            title: title,
            position:'topRight',
            message: msg || '',
        });
    }
    
    this.mensaje = function(tipo){
        switch (tipo) {
            case 'errorCampos':
                 iziToast.error({
                    title: 'Ocurrio un error.',
                    position:'topRight',
                    message: 'Todo los campos son obligatiorios.',
                });
            break;
            case 'errorToken':
                 iziToast.error({
                    title: 'Ocurrio un error.',
                    position:'topRight',
                    message: 'El token es necesario.',
                });
            break;
            case 'errorSesion':
                iziToast.error({
                    title: '',
                    position:'topRight',
                    message: 'El Token es inválido',
                });
            break;
            case 'error':
                iziToast.error({
                    title: 'Ocurrio un error.',
                    position:'topRight',
                    message: 'por favor de intentar mas tarde.',
                });
            break;
            case 'exitoGuardarToken':
                iziToast.success({
                    title: 'OK',
                    icon:'fa fa-check',
                    message: 'La información se guardó correctamente',
                    position:'topRight',
                });
            break;
        
            default:
                break;
        }
        
    }

    this.loaderEliminaPersonalizadoSuccess = function(title,msg){
        title = (title) ? title : 'Éxito.';
        msg = (msg) ? msg : 'Se actualizó correctamente';
        setTimeout(function(){
            SAUP190122fn.loaderElimina();
        },400);
        setTimeout(function(){
            SAUP190122fn.msgSuccess(title,msg);
        },500);
    }

    this.loaderEliminaPersonalizadoError = function(title,msg){
        title = (title) ? title : 'Ocurrio un error!';
        msg = (msg) ? msg : 'Por favor de internat mas tarde.';
        setTimeout(function(){
            SAUP190122fn.loaderElimina();
        },400);
        setTimeout(function(){
            SAUP190122fn.msgError(title,msg);
        },500);
    }
}