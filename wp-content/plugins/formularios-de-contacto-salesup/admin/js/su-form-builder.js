var _builderForm = function(f) {
	var self = this;
	var fn = fn ? fn : f;
	var url_tab = "https://api.salesup.com/sistema/campos/tabs";
	var url_usuarios = "https://api.salesup.com/catalogos/usuarios/"; 
	var url_opciones_select = "https://api.salesup.com/sistema/campos/";
	var url_pais = "https://api.salesup.com/sistema/generales/paises/";
	var url_opciones_integracion = "https://api.salesup.com/integraciones/catalogos";
	var url_titulo = "https://api.salesup.com/catalogos/titulos";
	var url_campos = "https://api.salesup.com/sistema/campos";
	var url_etiquetas = "https://api.salesup.com/integraciones/catalogos/5/";
	var url_origen = "https://api.salesup.com/integraciones/catalogos/2/";
	var urlIntegracion = "https://api.salesup.com/integraciones/";
	var token = "";
	var sesion = "";
	var objetoGeneral = {};
	
	this.init = function (objeto) {
		objetoGeneral.selects = [];
		objetoGeneral.guardaElementos = [];
		objetoGeneral.contenedorForm = [];
		objetoGeneral.configuracionEstilos = [];
		token = objeto.token;
		sesion = objeto.sesion;

		if (objeto.lista) {
			var template = self.templateListaFormulario();
			jQuery("#suMainContent").html(template);
			self.obtieneEtiquetas();
			self.obtieneOrigen();
			self.obtieneUsuarios();
			setTimeout(function(){
				self.obtieneListaFormularios();
				SAUP190122fn.loaderElimina()
			},800);
			
		} else if (objeto.public) {
			token = objeto.token[0].token;
			sesion = objeto.token[0].sesion;
			var cabeceraForm = objeto.cabecera;
			var cuerpoForm = objeto.cuerpo;
			var idForm = objeto.idForm;

			jQuery("#mainPublic-"+idForm).html(
				self.templatePublic({
					cabecera: cabeceraForm,
					cuerpo: cuerpoForm,
					idForm: idForm
				})
			);
			setTimeout(function(){
				SAUP190122fn.loaderElimina()
			},500);
		} else {
			
			var template = self.templateMain();
			jQuery("#suMainContent").html(template);
			jQuery(jQuery("#btnColoRadio label")[0]).addClass('active');
			jQuery(jQuery("#btnColoRadio input")[0]).prop('checked','cheked');
			self.obtieneEtiquetas();
			self.obtieneOrigen();
			self.obtieneUsuarios();
			self.initSortable();
			self.obtieneTkTab();
			setTimeout(function(){
				SAUP190122fn.loaderElimina()
			},500);
		}
		SAUP190122fn.initTooltip();
	}
  
	this.limpiaFormPublico = function(id) {
	  var datos = jQuery("#SAUP190122formEnviarSalesUp-"+id).find("input, select, textarea");
	  for (var i = 0; i < datos.length; i++) {
			valorCampo = jQuery(datos[i]).val("");
	  }
	}

	this.validaCorreoForm = function(t,flag){
		var caract = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/);
		var elemento = !flag ? jQuery(t).val(): t;
		var pasa = caract.test(elemento);
		if(flag==true){
			return pasa;
		}else{
			if(!pasa){
				jQuery(t).addClass('is-invalid');
			}else{
				jQuery(t).removeClass('is-invalid');
			}
		}
	}
  
	this.enviaFormulario = function (obj) {
		SAUP190122fn.loader();
		var idForm = obj.id;
		jQuery("#SAUP190122-btnGuardarFormulario-"+idForm).prop('disabled',true);
		var datos = jQuery("#SAUP190122formEnviarSalesUp-"+idForm).find("input, select, textarea").not(jQuery('.form-check .form-check-inline'));
		var guardarFormSalesUp = {};
		var urlProspecto = obj.token[0].token;
		var config = JSON.parse(atob(obj.cabecera[0].configuracion));
		var mensajeError = (config.mensajeError) ? config.mensajeError : '';
		var mensajeSubError = (config.mensajeSubError) ? config.mensajeSubError : '';
		var mensajeSubSuccess = (config.mensajeSubSuccess) ? config.mensajeSubSuccess : '';
		var mensajeSuccess = (config.mensajeSuccess) ? config.mensajeSuccess : '';
		var urlRedireccion = (config.urlRedireccion) ? config.urlRedireccion : '';
		var webhook = (config.webhook) ? config.webhook : '';
		var usuarioData = (config.usuarioData) ? config.usuarioData : '';

		for (var i = 0; i < datos.length; i++) {
			var keyCampo = jQuery(datos[i]).data("campo");
			var idcampo =  jQuery(datos[i]).data("idcampo");
			var valorCampo = jQuery(datos[i]).val();
			
			if(idcampo == 9 || idcampo == 10 || idcampo == 11 || idcampo == 12 || idcampo == 70 || idcampo == 71 || idcampo == 72 || idcampo == 73 || idcampo == 74 || idcampo == 75 || idcampo == 76 || idcampo == 77 || idcampo == 78 || idcampo == 79 || idcampo == 80 || idcampo == 81 || idcampo == 82 || idcampo == 83 || idcampo == 84 || idcampo == 85){
				var camp = valorCampo.split('/');
				valorCampo = camp[2]+'-'+camp[1]+'-'+camp[0];
			}else if(idcampo === 14){
				var select = jQuery(datos[i]).closest('div.row').find('select').val();
				var input = jQuery(datos[i]).closest('div.row').find('input').val();
				valorCampo = ' {"select":"'+select+'","valor":"'+input+'"}';
			}else if(idcampo === 16){
				if(valorCampo){
					var arr = [];
					for (let index = 0; index < valorCampo.length; index++) {
						arr.push({Opcion:valorCampo[index]});
					}
					valorCampo = JSON.stringify(arr);
				}
			}else if(idcampo === 18){
				if(jQuery(datos[i]).is(':checked')){
					valorCampo = '[{"Opcion":"'+valorCampo+'"}]';
				}
			}else if(idcampo === 26){
				var temp = valorCampo;
				valorCampo = '{"Opcion":"'+temp+'","Tipo":"Temp"}';
			}else if(idcampo === 17){
				valorCampo = jQuery(datos[i]).closest('div.input-group').find('input[type=text]').val();
			}

			guardarFormSalesUp[keyCampo] = valorCampo;
		}

		guardarFormSalesUp.origen = obj.cabecera[0].tk_origen;
		guardarFormSalesUp.etiqueta = obj.cabecera[0].tk_etiqueta1;
		guardarFormSalesUp.etiqueta2 = obj.cabecera[0].tk_etiqueta2;
		guardarFormSalesUp.etiqueta3 = obj.cabecera[0].tk_etiqueta3;
		guardarFormSalesUp.tkUsuario = usuarioData;

		var obligatorio = jQuery('#SAUP190122formEnviarSalesUp-'+idForm+' .obliga');
		var countError = 0;
		for (let index = 0; index < obligatorio.length; index++) {
			if(jQuery(obligatorio[index]).data('idcampo')==-6){
				if(jQuery(obligatorio[index]).val() == "" || SAUP190122formBuilder.validaCorreoForm(jQuery(obligatorio[index]).val(), true) == false ){
					jQuery(obligatorio[index]).addClass('is-invalid');
					countError++
				}else{
					jQuery(obligatorio[index]).removeClass('is-invalid');
				}
			}
		}
		var elemento = '#SAUP190122formEnviarSalesUp-'+idForm;
		if (SAUP190122fn.validaObligatorio(elemento) && countError==0) {
			var procesaGuardar = function (res, err) {
				if (err && err != "success") {
					jQuery("#SAUP190122-btnGuardarFormulario-"+idForm).prop('disabled',false);
					SAUP190122fn.loaderElimina();
					SAUP190122fn.mensaje("error");
					return false;
				}

				if (res[0].code == 0) {
					jQuery("#SAUP190122-btnGuardarFormulario-"+idForm).prop('disabled',false);
					SAUP190122fn.loaderElimina();
					SAUP190122fn.msgSuccess(mensajeSubSuccess, mensajeSuccess);
					jQuery('#SAUP190122formEnviarSalesUp-'+idForm+' .obliga').removeClass("is-invalid");
					self.limpiaFormPublico(idForm);
					if(webhook){
						guardarFormSalesUp.tkContacto = res[0].details[0].tkContacto;
						var procesaWebhook = function(res, err){
							if (err && err != "success") {
								console.log('webhook fail', err);
								return false;
							}
							if(config.urlRedireccion){
								setTimeout(function(){
									document.location.href=urlRedireccion;
								},1000);
							}
						}

						SAUP190122fn.peticionAjax({
							url: webhook,
							method: "POST",
							dataType: "json",
							data: guardarFormSalesUp,
							async:true,
							callback: procesaWebhook
						});
					}else{
						if(config.urlRedireccion){
							setTimeout(function(){
								document.location.href=urlRedireccion;
							},1000);
						}
					}
					

					
				} else {
					jQuery("#SAUP190122-btnGuardarFormulario-"+idForm).prop('disabled',false);
					SAUP190122fn.loaderElimina();
					SAUP190122fn.msgError(res[0].msg);
					jQuery('#SAUP190122formEnviarSalesUp-'+idForm+' .obliga').removeClass("is-invalid");
				}
			};

			SAUP190122fn.peticionAjax({
				url: urlIntegracion + urlProspecto,
				method: "POST",
				dataType: "json",
				data: guardarFormSalesUp,
				async:true,
				callback: procesaGuardar
			});
		} else {
			jQuery("#SAUP190122-btnGuardarFormulario-"+idForm).prop('disabled',false);
			SAUP190122fn.loaderElimina();
			SAUP190122fn.msgError(mensajeSubError, mensajeError);
		}
	}

	this.copiarShortcode = function(element){
		var $temp = jQuery("<input>");
		jQuery("body").append($temp);
		$temp.val(jQuery(element).closest('td').find('input').val()).select();
		document.execCommand("copy");
		$temp.remove();
	}
  
	this.obtieneListaFormularios = function() {
	  var procesaData = function(res, err) {
			if (err != "success" && err) {
				SAUP190122fn.loaderElimina();
				SAUP190122fn.mensaje("error");
				return false;
			}
		
			self.templateListaFormulario();
		
			var lista = "";
			for (var i = 0; i < res.length; i++) {
				var origen = _.where(objetoGeneral.origen, { TK: res[i].tk_origen })[0];
				var usuario = _.where(objetoGeneral.origen, { tkUsuario: res[i].tkUsuario })[0];
				var etiqueta1 = _.where(objetoGeneral.etiqueta, {	TK: res[i].tk_etiqueta1	})[0];
				var etiqueta2 = _.where(objetoGeneral.etiqueta, {	TK: res[i].tk_etiqueta2	})[0];
				var etiqueta3 = _.where(objetoGeneral.etiqueta, {	TK: res[i].tk_etiqueta3	})[0];
		
				var status = res[i].status == 1  ? '<span class="badge badge-success">Activo</span>' : '<span class="badge  badge-warning">Inactivo</span>';
		
				lista += `
					<tr>
						<td class="text-center">
							<input hidden value="[sudatos id=${res[i].id_formulario}]"> 
							<span class="Pointer" onclick="SAUP190122formBuilder.copiarShortcode(this)" data-toggle="tooltip" data-placement="top" title="Copiar">
								<i class="fa fa-clipboard"></i> <b>[sudatos id=${res[i].id_formulario}]</b>
							</span>
						</td>
						<td class="text-center"> ${res[i].nombre_formulario} </td>
						<td class="text-center"> ${origen.ORIGEN} </td>
						<td class="text-center"> 
							${_.size(etiqueta1) > 0 ? '<span class="badge badge-primary">' + etiqueta1.ETIQUETA + "</span><br>": ""}

							${ _.size(etiqueta2) > 0 ? '<span class="badge badge-primary">' + etiqueta2.ETIQUETA + "</span><br>" : "" }

							${  _.size(etiqueta3) > 0 ? '<span class="badge badge-primary">' + etiqueta3.ETIQUETA + "</span>"	: ""}

							</td>
						<td class="text-center"> ${status} </td>
						<td class="text-center">
							<i onclick="SAUP190122formBuilder.modificarFormulario(${ res[i].id_formulario },this)" data-toggle="tooltip" data-placement="top" title="Modificar formulario" class="Pointer fa fa-pencil-square fa-2x" aria-hidden="true"></i>

							<i onclick="SAUP190122formBuilder.eliminarForm(${ res[i].id_formulario })" data-toggle="tooltip" data-placement="top" title="Eliminar formulario" class="Pointer fa fa-times fa-2x" aria-hidden="true"></i>
						</td>
					</tr>
				`;
			}
		
			if (_.size(res) > 0) {
				jQuery("#tablaDatosEspera").html(lista);
			} else {
				jQuery("#tablaDatosEspera").html('<tr><td colspan="6" class="text-center">No se encontraron formularios.</td></tr>' );
			}
			SAUP190122fn.initTooltip();
	  };
  
		SAUP190122fn.peticionAjax({
				url: salesup.url,
				method: "GET",
				dataType: "json",
				data: {
					action: "su_crud_get",
					nonce: salesup.seguridad,
					tipo: "get_lista_forms"
				},
				async:true,
				callback: procesaData
		});
	}

	this.preProcesaFormData = function(cabecera, config, cuerpo){
		setTimeout(function(){
			self.selectEtiqueta(cabecera[0].tk_etiqueta1);
			self.selectEtiqueta(cabecera[0].tk_etiqueta2);
			self.selectEtiqueta(cabecera[0].tk_etiqueta3);
			jQuery("#nombreFormulario").val(cabecera[0].nombre_formulario);
			jQuery("#tituloFormulario").val(config.tituloFormulario);
			
			jQuery("#origenData").val(cabecera[0].tk_origen);
			jQuery("#btnFormulario").val(config.btnNombre);
			jQuery("#descripcionFormulario").val(config.descripcion);  
			jQuery("#claseContenedorPrincipal").val(config.claseContenedorPrincipal);
			jQuery("#claseLabelTitulo").val(config.claseLabelTitulo);
			jQuery("#claseFormContenedor").val(config.claseFormContenedor);
			jQuery("#claseDescripcionContenedor").val(config.claseDescripcionContenedor);
			jQuery("#claseBotonGuardar").val(config.claseBotonGuardar);

			if(config.estilosPersonalizados == 2){
				jQuery("#listaRadioPersonalizado").prop(':checked',true);
				jQuery("#listaRadioPersonalizado").click();
			}else{
				jQuery("#listaRadioBootstrap").prop(':checked',true);
				jQuery("#listaRadioBootstrap").click();
			}
			

			(config.mensajeSubError) ? jQuery("#mensajeSubError").val(config.mensajeSubError) : '';
			(config.mensajeError) ? jQuery("#mensajeError").val(config.mensajeError) : '';
			(config.mensajeSuccess) ? jQuery("#mensajeSuccess").val(config.mensajeSuccess) : '';
			(config.mensajeSubSuccess) ? jQuery("#mensajeSubSuccess").val(config.mensajeSubSuccess) : '';
			(config.urlRedireccion) ? jQuery("#urlRedireccion").val(config.urlRedireccion) : '';
			(config.webhook) ? jQuery("#webhook").val(config.webhook) : '';
			(config.usuarioData) ? jQuery("#usuarioData").val(config.usuarioData) : '';
			(config.configuracionCampos) ? objetoGeneral.configuracionCampos = JSON.parse(config.configuracionCampos) : '';
			(config.configuracionEstilos) ? objetoGeneral.configuracionEstilos = JSON.parse(config.configuracionEstilos) : '';
			self.selectRadio({radio:config.radio});
			self.colorBoton(config.radio);
		
			for (let index = 0; index < cuerpo.length; index++) {
				var campo = JSON.parse(atob(cuerpo[index].campo));
				if (campo.atributoDataIdc == -6) {
					jQuery("#inputSelecto-" + campo.tkCampo).remove();
					var correo = _.where(objetoGeneral.contenedorForm,{tkCampo:campo.tkCampo})[0];
					correo = Object.assign({},correo);
					objetoGeneral.contenedorForm = _.reject(objetoGeneral.contenedorForm,function(element) {
						return element.tkCampo == campo.tkCampo;
					});
					objetoGeneral.contenedorForm.push(correo);
					self.procesaInputsAgregados(campo, '#SAUP190122formContenedor', false);
				}else{
					var guardarCampo = _.where(objetoGeneral.campos, { tkCampo: campo.tkCampo })[0];
					objetoGeneral.contenedorForm.push(guardarCampo);
					self.procesaInputsAgregados(campo, '#SAUP190122formContenedor');
				}
			}
		},2500);
	}
  
	this.modificarFormulario = function(id,t) {
		SAUP190122fn.loader();
	  	if (!id) {
			SAUP190122fn.mensaje("error");
			return false;
		}

		var saveOnclick = 	jQuery(t).attr('onclick');
		jQuery(t).removeAttr('onclick');
	  	objetoGeneral.contenedorForm = [];
		var procesaFormulario = function(res, err) {
			if (res == "erroCampos" || res == "errorIdForm" || err) {
				jQuery(t).attr('onclick',saveOnclick);
				SAUP190122fn.msgError("Ops!","Ocurrio un problema, por favor de intentar mas tarde.");
				return false;
			}
			
			var cabecera = JSON.parse(res.cabecera);
			var config = JSON.parse(atob(cabecera[0].configuracion));
			var cuerpo = JSON.parse(res.cuerpo);
		
			var template = self.templateMain({id_formulario:id});
			jQuery("#ocultarCrearForm").slideUp();
			jQuery("#suMainContent").append(template);

			self.obtieneEtiquetas();
			self.obtieneOrigen();
			self.obtieneUsuarios();
			self.initSortable();
			self.obtieneTkTab();
			SAUP190122fn.initTooltip();
			setTimeout(function(){
				self.preProcesaFormData(cabecera,config,cuerpo);
				SAUP190122fn.loaderElimina()
			},500);
			
		};
  
		SAUP190122fn.peticionAjax({
			url: salesup.url,
			method: "GET",
			dataType: "json",
			data: {
				action: "su_crud_get",
				nonce: salesup.seguridad,
				id_formulario: id,
				tipo: "get_form"
			},
			callback: procesaFormulario,
			async: true
		});
	}
    
	this.eliminarFormulario = function(id) {
		SAUP190122fn.loader();
		if (!id) {
			SAUP190122fn.loaderElimina();
			SAUP190122fn.mensaje("error");
			return false;
	  }
		var procesaEliminar = function(res, err){
			if (err) {
				SAUP190122fn.loaderElimina();
				SAUP190122fn.msgError("Ops!","Ocurrio un problema, por favor de intentar mas tarde.");
				return false;
			}
			SAUP190122fn.loaderElimina();
			SAUP190122principal.init({menu:'listaFormularios'});
		}

		SAUP190122fn.peticionAjax({
			url: salesup.url,
			method: "POST",
			dataType: "json",
			data: {
				action: "su_crud_delete",
				nonce: salesup.seguridad,
				id_formulario: id,
				tipo: "delete_form"
			},
			async:true,
			callback: procesaEliminar,
	  });
	}

	this.eliminarForm = function(id){
		var eliminarId = id;
		iziToast.question({
			timeout: 20000,
			close: false,
			icon:'fa fa-exclamation-triangle',
			overlay: true,
			displayMode: 'once',
			id: 'eliminarFormularioRow',
			zindex: 999,
			title: '¿Estás seguro?',
			message: 'Esta acción no puede deshacerse.',
			position: 'center',
			buttons: [
					['<button><b>Si</b></button>', function (instance, toast) {
						instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');	
						SAUP190122formBuilder.eliminarFormulario(eliminarId); 
					}, true],
					['<button>No</button>', function (instance, toast) {
						instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');	 
					}],
			]
	});
	}
  
	this.validaCampo = function(campo) {
	  return campo ? campo : "";
	}
  
	this.checkInput = function(t,flag) {
		var check = jQuery(t).prop("checked");
		if (check) {
			if(flag){
				jQuery(t).closest("div").find('input[type=text]').removeAttr("disabled");
			}else{
				jQuery(t).closest("div.input-group").find('input[type="text"]').removeAttr("disabled");
			}
			
		} else {
			if(flag){
				jQuery(t).closest("div").find('input[type=text]').attr("disabled", "disabled");
			}else{
				jQuery(t).closest("div.input-group").find('input[type="text"]').attr("disabled", "disabled");
			}
			
		}
	}
 
	this.obtieneUsuarios = function(obj) {
		var procesaUsuarios = function(res, err) {
			if (err != "success" && err) {
				SAUP190122fn.msgError("No se encontraron los usuarios.");
				return false;
			}
		
			objetoGeneral.usuarios = res;
			var options = '';
			for (var i = 0; i < res.length; i++) {
				options += `<option value="${res[i].tkUsuario}">${res[i].nombre} ${res[i].apellidos}</option>`;
			}
	
			jQuery("#usuarioData").append(options);
	  	}
	 

		SAUP190122fn.peticionAjax({
			url: url_usuarios,
			metodo: "GET",
			data:{token:sesion},
			callback: procesaUsuarios,
			async: true
		});
  }

	this.obtieneOrigen = function(obj) {
	  	var procesaOrigen = function(res, err) {
			if (err != "success" && err) {
				SAUP190122fn.msgError("No se encontraron los origenes.");
				return false;
			}
		
			objetoGeneral.origen = res;
			var options = '<option value="">(... Selecciona un origen ...)</option>';
			for (var i = 0; i < res.length; i++) {
				options += `<option value="${res[i].TK}">${res[i].ORIGEN}</option>`;
			}
	
			jQuery("#origenData").append(options);
		}
  
		SAUP190122fn.peticionAjax({
				url: url_origen + token,
				metodo: "GET",
				callback: procesaOrigen,
				async: true
		});
	}
  
	this.obtieneEtiquetas = function(obj) {
	  var procesaEtiqueta = function(res, err) {
		if (err != "success" && err) {
		  SAUP190122fn.msgError("No se encontraron las etiquetas.");
		  return false;
		}

		objetoGeneral.etiqueta = res;
		var options = '<option value="">(... Selecciona una etiqueta ...)</option>';
		for (var i = 0; i < res.length; i++) {
			options += `<option value="${res[i].TK}">${res[i].ETIQUETA}</option>`;
		}

		jQuery("#etiquetaData").append(options);
		
	  };
  
	  SAUP190122fn.peticionAjax({
		url: url_etiquetas + token,
		metodo: "GET",
		callback: procesaEtiqueta,
		async: true
	  });
	}
  
	this.obtieneCampos = function(tkTab) {
	  if (!tkTab) {
		SAUP190122fn.msgError("Los parametros son obligatorios!");
		return false;
	  }
  
	  var procesaCampos = function(res, err) {
		if (!err) {
		  objetoGeneral.campos = res;
		  self.construyeContenedorCampos(res);
		} else {
		  SAUP190122fn.msgError("por favor de intentar mas tarde.");
		}
	  };
  
	  SAUP190122fn.peticionAjax({
			url: url_campos,
			metodo: "GET",
			data: {
				token: sesion,
				tkTab: tkTab,
				pagina: 0
			},
			async:true,
			callback: procesaCampos
	  });
	}
  
	this.slideToggle = function(elemento) {
	  if (jQuery("#ocultarBodyConfig").is(":visible")) {
		jQuery(elemento).attr("title", "Mostar");
	  } else {
		jQuery(elemento).attr("title", "Ocultar");
	  }
  
	  jQuery("#ocultarBodyConfig").slideToggle();
	}
  
	this.obtieneTkTab = function(obj) {
	  var procesaTkTab = function(res, err) {
		var tkTab = "";
		if (!err) {
		  for (var i = 0; i < res.length; i++) {
			  if (res[i].tabDefault == 1) {
			  tkTab = res[i].tkTab;
			}
		  }
		  objetoGeneral.tkTab = tkTab;
		  self.obtieneCampos(tkTab);
		} else {
		  SAUP190122fn.msgError("Ocurrio un error, por favor intentar mas tarde.");
		}
	  };
  
	  SAUP190122fn.peticionAjax({
			url: url_tab,
			metodo: "GET",
			data: {
				token: sesion,
				idPantalla: 1
			},
			async:true,
			callback: procesaTkTab
	  });
	}
  
	this.regresaformularios = function() {
	  jQuery("#muestraCrearForm").slideUp();
	  jQuery("#muestraCrearForm").remove();
	  jQuery("#ocultarCrearForm").slideDown();
	}
  
	this.selectEtiqueta = function(v) {
	  var valor = v;
	  if(v){
		  var count = jQuery(".badgeEtiqueta").length;
  
		  if (count < 3) {
		  buscado = _.where(objetoGeneral.etiqueta, { TK: valor })[0];
		  jQuery("#etiquetaData").val("");
		  jQuery("#bodyEtiquetas").append(
			  '<span style="margin:10px;" class="badge badge-info badgeEtiqueta Pointer" onclick="SAUP190122formBuilder.eliminarEtiqueta(this)" data-tk="' +
			  buscado.TK +
			  '">' +
			  buscado.ETIQUETA +
			  '<i class="fa fa-times" style="margin-left:5px;"></i></span>'
		  );
		  } else {
		  SAUP190122fn.msgInfo("Solo se permiten 3 etiquetas");
		  	jQuery("#etiquetaData").val("");
		  }
	  }
	  
	}
  
	this.eliminarEtiqueta = function(t) {
	  jQuery(t).remove();
	}
  
	this.agrupaInputs = function(elemento) {
	  var checks = jQuery(".checkAgrupar");
	  var count = 0;
	  var arrayChecks = [];
	  for (var i = 0; i < checks.length; i++) {
		if (jQuery(checks[i]).is(":checked")) {
		  count++;
		  //if(count <= 3){
		  var element = _.where(objetoGeneral.campos, {
			tkCampo: jQuery(checks[i]).data("indice")
		  });
  
		  arrayChecks.push(element[0]);
		  //}
		}
	  }
	  return arrayChecks;
	}
  
	this.construyeContenedorCampos = function(objeto) {
	  if (objeto) {
		for (var i = 0; i < objeto.length; i++) {
		
			
		  if (objeto[i].atributoDataIdc == -6) {
				self.agregaIndividual(objeto[i], true);
		  } else {
			  if(objeto[i].atributoDataIdc!=-30 && objeto[i].atributoDataIdc!=-32){
				  self.procesaInputsAgregados(objeto[i], "#SAUP190122inputsContenedor");
			  }
				
		  }
		}
		SAUP190122fn.initTooltip();
	  }
	}

	this.agregaCampos = function(obj, index){
		if (!obj) {
			SAUP190122fn.msgError("Ocurrio un problema, por favor de intentar mas tarde");
			return false;
		}
	}
  
	this.procesaInputsAgregados = function(elemento, contenedor, flag) {
	  var uiClass = (contenedor == "#SAUP190122formContenedor" ) ? "ui-widget-content list-group-item ui-state-default"  : "";
	  var elimina = `
			<span class="Pointer">	
				<i onclick="SAUP190122formBuilder.regresaIndividual(this)" class="pull-right fa fa-times" style=" margin:5px;"></i>
			</span>
		`;
	  var btnRegresar = elemento.atributoDataIdc != -6 ? elimina : "";
	  var html = "";
	  elemento.atributoDataIdc != -6 ? jQuery("#inputSelecto-" + elemento.tkCampo).remove() 	: "";
	  html += `
			  <li id="inputSelecto-${elemento.tkCampo}" data-attrid="${elemento.atributoDataIdc}" data-tkcampo="${elemento.tkCampo}"  class="${uiClass}" style="list-style:none;">
				
				  <button data-indice="${elemento.tkCampo }" onclick="SAUP190122formBuilder.agregaIndividual(this,'',true)" type="button" class="btnProcesa btn btn-secondary btn-lg btn-block">
					  ${elemento.campo}
				  </button>
			  
					<div class="contenedorFormGroup"  >
						<span class="text-center">
					   	<label  ><h5>${elemento.campo}</h5></label>
					   	${btnRegresar}
					  	<span class="Pointer" data-toggle="modal" onclick="SAUP190122formBuilder.configuracionCampo('${elemento.tkCampo}')">	
						  	<i  class="pull-right fa fa-cog" style=" margin:5px;"></i>
						 	</span>
					
				  </div>
			  </li>
		  `;
	  flag ? jQuery(contenedor).prepend(html) : jQuery(contenedor).append(html);
  
	  jQuery("#inputSelecto-" + elemento.tkCampo).disableSelection();
	  SAUP190122fn.initTooltip();
	}
  
	this.agregaIndividual = function(elemento, tipo, style) {
	  var $pone = jQuery(elemento);
	  var tkCampo = jQuery($pone).data("indice");
	  if (tipo) {
			tkCampo = elemento.tkCampo;
		}

		var campo = _.where(objetoGeneral.campos,{tkCampo:tkCampo})[0];
		var tipoValor = '';
		if(style){
			if(campo){
				if(campo.esInput){
					tipoValor = 'esInput';
				}else if(campo.esCheckInput){
					tipoValor = 'esCheckInput';
				}else if(campo.esListaCheck){
					tipoValor = 'esListaCheck';
				}else if(campo.esListaRadio){
					tipoValor = 'esListaRadio';
				}else if(campo.esPorcentaje){
					tipoValor = 'esPorcentaje';
				}else if(campo.esSelect){
					tipoValor = 'esSelect';
				}else if(campo.esSelectInput){
					tipoValor = 'esSelectInput';
				}else if(campo.esTemperatura){
					tipoValor = 'esTemperatura';
				}else if(campo.esTextArea){
					tipoValor = 'esTextArea';
				}else if(campo.esTipoModulo){
					tipoValor = 'esTipoModulo';
				}
				var objEstilos = objetoGeneral.configuracionEstilos;	
				var estilosP = {};		
				for (let i = 0; i < objEstilos.length; i++) {
					if(objEstilos[i].tipoValor == tipoValor && objEstilos[i].aplicarAtodos == true){
						estilosP.estilosContenedor = objEstilos[i].estilosContenedor;
						estilosP.estilosLabel = objEstilos[i].estilosLabel;
						estilosP.estilosInput = objEstilos[i].estilosInput;
						estilosP.aplicarAtodos = objEstilos[i].aplicarAtodos;
						estilosP.quitarTodosMenosAEste = true;
						estilosP.tkCampo = campo.tkCampo;
						break;
					}
				}

			}
			objetoGeneral.configuracionEstilos.push(estilosP);
		}
			

	  var guardarCampo = _.where(objetoGeneral.campos, { tkCampo: tkCampo })[0];
		objetoGeneral.contenedorForm.push(guardarCampo);
		
	  self.procesaInputsAgregados(guardarCampo, "#SAUP190122formContenedor");
	}
  
	this.regresaInputs = function(flag) {
	  var contenedor = jQuery("#SAUP190122formContenedor li");
	  var guardarCampo = "";
	  for (var i = 0; i < contenedor.length; i++) {
			if (jQuery(contenedor[i]).data("attrid") != -6) {
				contenedor[i].remove();
				jQuery("#SAUP190122inputsContenedor").prepend(contenedor[i]);
			
			} else {
				var tkCampo = jQuery(contenedor[i]).data("tkcampo");
				guardarCampo = _.where(objetoGeneral.campos, { tkCampo: tkCampo })[0];
			}
	  }
	  jQuery("#SAUP190122inputsContenedor li").removeClass("ui-widget-content list-group-item ui-state-default");
		objetoGeneral.contenedorForm = [];
		objetoGeneral.configuracionEstilos = [];
	  objetoGeneral.contenedorForm.push(guardarCampo);
  
	  if (!flag) {
			SAUP190122fn.msgSuccess("Elementos eliminados");
	  }
  
	  SAUP190122fn.initTooltip();
	}
  
	this.initSortable = function() {
	  jQuery("#SAUP190122formContenedor").sortable({
			update: function(event, ui) {
				var formOrden = jQuery('#SAUP190122formContenedor li');
				var arr = [];
				for (var i = 0; i < formOrden.length; i++) {
						var tkCampo = jQuery(formOrden[i]).data("tkcampo");
						var guardarCampo = _.where(objetoGeneral.campos, {tkCampo: tkCampo})[0];
						arr.push(guardarCampo);  
				}
				objetoGeneral.contenedorForm = arr;
				jQuery(ui.item[0]).addClass("ui-widget-content list-group-item ui-state-default");
			},
			cursor: "move",
			delay: 150,
			connectWith: ".connectedSortable"
		});  
	  jQuery("#SAUP190122formContenedor").disableSelection();
	}
  
	this.regresaIndividual = function(elemento) {
	  var elem = jQuery(elemento);
	  var liElemento = jQuery(elem[0]).closest("li");
  
	  objetoGeneral.contenedorForm = _.reject(objetoGeneral.contenedorForm,function(element) {
				return element.tkCampo == jQuery(liElemento).data("tkcampo");
		});

		objetoGeneral.configuracionEstilos = _.reject(objetoGeneral.configuracionEstilos,function(element) {
			return element.tkCampo == jQuery(liElemento).data("tkcampo");
		});
  
	  jQuery(elem[0]).closest("li").remove();
	  jQuery("#SAUP190122inputsContenedor").prepend(liElemento);
	  jQuery("#SAUP190122inputsContenedor li").removeClass("ui-widget-content list-group-item ui-state-default");
	  SAUP190122fn.msgSuccess("Elemento reiniciado");
	  SAUP190122fn.initTooltip();
	}
  
	this.obtieneEtiquetasGuardar = function() {
	  var etiquetaData = jQuery(".badgeEtiqueta");
	  var arr = [];
	  for (var i = 0; i < etiquetaData.length; i++) {
		arr["tk_etiqueta" + (i + 1)] = jQuery(etiquetaData[i]).data("tk");
	  }
	  return arr;
	}

	this.colorBoton = function(v){
		var tipoBoton = v || 'btn-primary';
		var colorBoton = jQuery("#btnTipoColor");
		jQuery(colorBoton).removeAttr('class');
		jQuery(colorBoton).attr('class', 'btn '+tipoBoton);

	}

	this.selectRadio = function(obj){
		var contenedorRadios = jQuery('#btnColoRadio input');
		var radios = (obj.radio) ? obj.radio : false;
		if(!radios){
			jQuery(jQuery('#btnColoRadio input')[0]).prop('checked',true);
		}

		for(var i = 0; i<contenedorRadios.length; i++){
			var ra = jQuery(contenedorRadios[i]).val();
			if(ra == radios){
			  jQuery(contenedorRadios[i]).prop('checked',true);
			}
		}

	}

	this.procesaRadios = function(){
		var contenedorRadios = jQuery('#btnColoRadio input');
		var radios = '';
		for(var i = 0; i<contenedorRadios.length; i++){
			var ra = jQuery(contenedorRadios[i]).is(':checked');
			if(ra){
				radios = jQuery(contenedorRadios[i]).val();
			}
		}

		return radios;
	}
  
	this.guardaFormulario = function(obj) {
		SAUP190122fn.loader();
		jQuery(obj.t).attr('disabled',true);
		var id_formulario = (obj.id_formulario) ? obj.id_formulario : '';
		var pasa = SAUP190122fn.validaObligatorio();
		var array = objetoGeneral.contenedorForm;
		var nombreFormulario = jQuery("#nombreFormulario").val();
		var tituloFormulario = jQuery("#tituloFormulario").val();
		var usuarioData = jQuery("#usuarioData").val();
		var descripcionFormulario = jQuery("#descripcionFormulario").val();
		var btnFormulario = jQuery("#btnFormulario").val();
		var origenData = jQuery("#origenData").val();
		var mensajeSuccess = jQuery("#mensajeSuccess").val();
		var mensajeSubSuccess = jQuery("#mensajeSubSuccess").val();
		var mensajeError = jQuery("#mensajeError").val();
		var mensajeSubError = jQuery("#mensajeSubError").val();
		var urlRedireccion = jQuery("#urlRedireccion").val();
		var webhook = jQuery("#webhook").val();
		var claseContenedorPrincipal = jQuery("#claseContenedorPrincipal").val();
		var claseLabelTitulo = jQuery("#claseLabelTitulo").val();
		var claseFormContenedor = jQuery("#claseFormContenedor").val();
		var claseDescripcionContenedor = jQuery("#claseDescripcionContenedor").val();
		var claseBotonGuardar = jQuery("#claseBotonGuardar").val();
		var etiquetaData = self.obtieneEtiquetasGuardar();
		var radioSelect = self.procesaRadios();
		var formulario = [];

		var estilosPersonalizados = jQuery("#listaRadioPersonalizado").is(':checked') ? 2 : 1;
  
	  	if (pasa && _.size(array) > 0) {
			for (var i = 0; i < array.length; i++) {
				formulario.push(btoa(JSON.stringify(array[i])));
			}
  
			var procesaGuardar = function(res, err) {
				if (err != "success" && err) {
					SAUP190122fn.loaderElimina();
					jQuery(obj.t).attr('disabled',false);
					SAUP190122fn.mensaje("error");
					return false;
				}
		
				if (res != "error") {
					SAUP190122fn.loaderElimina();
					if(id_formulario){
						SAUP190122fn.loaderElimina();
						SAUP190122fn.msgSuccess("Exito.","Se actualizó correctamente.");
					}else{
						SAUP190122fn.loaderElimina();
						SAUP190122fn.msgSuccess("Exito.","Se creó el formulario.");
					}
				
					jQuery("#nombreFormulario").val("");
					jQuery("#tituloFormulario").val("");
					jQuery("#descripcionFormulario").val("");
					jQuery("#btnFormulario").val("");
					jQuery("#origenData").val("");
					jQuery("#etiquetaData").val("");
					jQuery("#mensajeSuccess").val("");
					jQuery("#mensajeSubSuccess").val("");
					jQuery("#mensajeError").val("");
					jQuery("#mensajeSubError").val("");
					jQuery(".badgeEtiqueta").remove();
					SAUP190122formBuilder.regresaInputs(true);
					setTimeout(function() {
						SAUP190122fn.loaderElimina();
						SAUP190122principal.init({ menu: "listaFormularios" });
					}, 100);
				}
			};
		 
			SAUP190122fn.peticionAjax({
				url: salesup.url,
				method:"POST",
				dataType: "json",
				async:true,
				data: {
					action:  (id_formulario) ? "su_crud_put" : 'su_crud_post',
					nonce: salesup.seguridad,
					nombreFormulario: nombreFormulario,
					id_formulario:id_formulario,
					configuracion: btoa(JSON.stringify({
							claseContenedorPrincipal:claseContenedorPrincipal,
							claseLabelTitulo:claseLabelTitulo,
							claseFormContenedor:claseFormContenedor,
							claseDescripcionContenedor:claseDescripcionContenedor,
							claseBotonGuardar:claseBotonGuardar,
							descripcion: descripcionFormulario,
							btnNombre: btnFormulario,
							mensajeSuccess: mensajeSuccess,
							mensajeSubSuccess: mensajeSubSuccess,
							mensajeError: mensajeError,
							mensajeSubError: mensajeSubError,
							urlRedireccion:urlRedireccion,
							webhook:webhook,
							estilosPersonalizados:estilosPersonalizados,
							usuarioData:usuarioData,
							tituloFormulario:tituloFormulario,
							radio:radioSelect,
							configuracionCampos:JSON.stringify(objetoGeneral.configuracionCampos),
							configuracionEstilos:JSON.stringify(objetoGeneral.configuracionEstilos)
						})
					),
					origenData: origenData,
					etiqueta1: etiquetaData["tk_etiqueta1"],
					etiqueta2: etiquetaData["tk_etiqueta2"],
					etiqueta3: etiquetaData["tk_etiqueta3"],
					formulario: formulario,
					tipo: (id_formulario) ? "update_form" : 'add_form'
				},
				callback: procesaGuardar
			});
	  } else {
			SAUP190122fn.loaderElimina();
			if (_.size(array) == 0) {
				SAUP190122fn.loaderElimina();
				SAUP190122fn.msgError("Es obligatorio agregar elementos para el formulario");
			} else if( _.size(etiquetaData)==0){
				SAUP190122fn.loaderElimina();
				jQuery("#etiquetaData").addClass('is-invalid');
				SAUP190122fn.msgError("Todo los campos son obligatorios");
			}else{
				SAUP190122fn.loaderElimina();
				SAUP190122fn.msgError("Todo los campos son obligatorios");
			}
	  }
	}

	this.tabsConfig = function(t){
		if(jQuery(t).attr('id') == 'tab1' ){
			jQuery('#tab1').find('a').addClass('active')
			jQuery('#tab2').find('a').removeClass('active')
			jQuery('#SAUP190122ocultarFormularioConfig').show();
			jQuery('#ocultarBodyConfig').hide();
		}else{
			jQuery('#tab1').find('a').removeClass('active')
			jQuery('#tab2').find('a').addClass('active')
			jQuery('#SAUP190122ocultarFormularioConfig').hide();
			jQuery('#ocultarBodyConfig').show();
		}
	}

	this.guardarConfiguracion = function(tk,t){
		SAUP190122fn.loader()
		var tkCampo = tk;
		jQuery(t).prop('disabled',true);
		
		( _.size(objetoGeneral.configuracionCampos) ==0 ) ? objetoGeneral.configuracionCampos = [] : '';
		( _.size(objetoGeneral.configuracionEstilos) ==0 ) ? objetoGeneral.configuracionEstilos = [] : '';

		var obj = {};
		var objEstilos = {};
		obj.nombreCampo = jQuery("#nombreCampo").val();
		obj.placeholderCampo = jQuery("#placeholderCampo").val();
		obj.esObligatorioCampo = jQuery("#esObligatorioCampo").is(':checked');
		objEstilos.estilosContenedor = jQuery("#estilosContenedor").val();
		objEstilos.estilosLabel = jQuery("#estilosLabel").val();
		objEstilos.estilosInput = jQuery("#estilosInput").val();
		objEstilos.aplicarAtodos = jQuery("#aplicarAtodos").is(':checked');
		objEstilos.tipoValor = jQuery("#tipoValor").val();
		obj.tkCampo = tkCampo;
		objEstilos.tkCampo = tkCampo;

		if(jQuery("#aplicarAtodos").is(':checked') == true){
			if(!objEstilos.estilosContenedor || !objEstilos.estilosLabel || !objEstilos.estilosInput){
				SAUP190122fn.loaderEliminaPersonalizadoError('Los campos personalizados','Son obligatorios');
				
				(!jQuery("#estilosContenedor").val()) ? jQuery("#estilosContenedor").addClass('is-invalid') : jQuery("#estilosContenedor").removeClass('is-invalid');
				(!jQuery("#estilosLabel").val()) ? jQuery("#estilosLabel").addClass('is-invalid'): jQuery("#estilosLabel").removeClass('is-invalid');
				(!jQuery("#estilosInput").val()) ? jQuery("#estilosInput").addClass('is-invalid'): jQuery("#estilosInput").removeClass('is-invalid');
				
				jQuery(t).prop('disabled',false);
				return false;
			}
		}else{
			if(objEstilos.estilosContenedor || objEstilos.estilosLabel || objEstilos.estilosInput){
				if(!objEstilos.estilosContenedor || !objEstilos.estilosLabel || !objEstilos.estilosInput){
					SAUP190122fn.loaderEliminaPersonalizadoError('Los campos personalizados','Son obligatorios');
					(!jQuery("#estilosContenedor").val()) ? jQuery("#estilosContenedor").addClass('is-invalid') : jQuery("#estilosContenedor").removeClass('is-invalid');
					(!jQuery("#estilosLabel").val()) ? jQuery("#estilosLabel").addClass('is-invalid'): jQuery("#estilosLabel").removeClass('is-invalid');
					(!jQuery("#estilosInput").val()) ? jQuery("#estilosInput").addClass('is-invalid'): jQuery("#estilosInput").removeClass('is-invalid');
					jQuery(t).prop('disabled',false);
					return false;
				}
			}
		}
	
		var update = _.where(objetoGeneral.configuracionCampos,{tkCampo:tkCampo})[0];
		var updateEstilo = _.where(objetoGeneral.configuracionEstilos,{tkCampo:tkCampo})[0];
		var campos = objetoGeneral.contenedorForm;
		var aplicaCambio = jQuery("#aplicarAtodos").val();

		if(jQuery("#aplicarAtodos").is(':checked')){
			for (let i = 0; i < campos.length; i++) {
				if(campos[i][aplicaCambio]){
					var aplicarTodos = _.where(objetoGeneral.configuracionEstilos,{tkCampo:campos[i].tkCampo})[0];
					if(aplicarTodos){
						aplicarTodos.estilosContenedor = objEstilos.estilosContenedor;
						aplicarTodos.estilosLabel = objEstilos.estilosLabel;
						aplicarTodos.estilosInput = objEstilos.estilosInput;
						aplicarTodos.aplicarAtodos = objEstilos.aplicarAtodos;
						aplicarTodos.quitarTodosMenosAEste = true;
						aplicarTodos.tipoValor = objEstilos.tipoValor
					}else{
						objetoGeneral.configuracionEstilos.push({
							estilosContenedor:jQuery("#estilosContenedor").val(),
							estilosLabel:jQuery("#estilosLabel").val(),
							estilosInput:jQuery("#estilosInput").val(),
							aplicarAtodos:jQuery("#aplicarAtodos").is(':checked'),
							quitarTodosMenosAEste:true,
							tipoValor:jQuery("#tipoValor").val(),
							tkCampo:campos[i].tkCampo
						});
					}
				}
			}
		}else if(jQuery("#quitarTodosMenosAEste").is(':checked')){
			for (let i = 0; i < campos.length; i++) {
				if(campos[i][aplicaCambio]){
					if(campos[i].tkCampo == tkCampo ){
						var aplicarTodos = _.where(objetoGeneral.configuracionEstilos,{tkCampo:tkCampo})[0];
						aplicarTodos.estilosContenedor = jQuery("#estilosContenedor").val();
						aplicarTodos.estilosLabel = jQuery("#estilosLabel").val();
						aplicarTodos.estilosInput = jQuery("#estilosInput").val();
						aplicarTodos.aplicarAtodos = jQuery("#aplicarAtodos").is(':checked');
						aplicarTodos.tipoValor = jQuery("#tipoValor").val();
						aplicarTodos.quitarTodosMenosAEste = false;
					}else{
						var aplicar = _.where(objetoGeneral.configuracionEstilos,{tkCampo:campos[i].tkCampo})[0];
						aplicar.estilosContenedor = '';
						aplicar.estilosLabel = '';
						aplicar.estilosInput = '';
						aplicar.aplicarAtodos = false;
						aplicar.quitarTodosMenosAEste = false;
						aplicar.tipoValor = jQuery("#tipoValor").val();
					}
				}
			}
		}else{
			if(_.size(updateEstilo)>0){
				updateEstilo.estilosContenedor = objEstilos.estilosContenedor;
				updateEstilo.estilosLabel = objEstilos.estilosLabel;
				updateEstilo.estilosInput = objEstilos.estilosInput;
				updateEstilo.aplicarAtodos = objEstilos.aplicarAtodos;
				updateEstilo.tipoValor = objEstilos.tipoValor;
			}else{
				objetoGeneral.configuracionEstilos.push(objEstilos);		
			}
		}
		
		if(_.size(update)>0){
			update.nombreCampo = obj.nombreCampo;
			update.placeholderCampo = obj.placeholderCampo;
			update.esObligatorioCampo = obj.esObligatorioCampo;
		
		}else{
			objetoGeneral.configuracionCampos.push(obj);
		}

		SAUP190122fn.loaderEliminaPersonalizadoSuccess("Exito!","Para que se agregue el cambio actualiza el formulario.");
		jQuery('#modalSetting').modal('hide');
	}

	this.eliminaClases = function(t){
		if(t){
			if(jQuery(t).is(':checked')){
				jQuery("#aplicarAtodos").prop('checked',false);
			}
		}
	}

	this.aplicaTodos = function(t){
		if(t){
			if(jQuery(t).is(':checked')){
				jQuery("#quitarTodosMenosAEste").prop('checked',false);
			}
		}
	}

	this.agregaTipoCampoEstilosPersonalizados = function(tk){
		var tkCampo = tk;
		var campo = _.where(objetoGeneral.contenedorForm,{tkCampo:tkCampo})[0];
		var campoEstilo = _.where(objetoGeneral.configuracionEstilos,{tkCampo:tkCampo})[0];
		campoEstilo = (campoEstilo) ? campoEstilo : {};
		var tipo = '';
		var tipoValor = '';
		var mensaje = 'El campo '+campo.campo+' es obligatorio';
		var obligatorio = (campo.atributoDataIdc == -6) ? 'checked disabled' : '';
		var quitar = '';

		if(campo.esInput){
			tipoValor = 'esInput';
			tipo = 'inputs';
		}else if(campo.esCheckInput){
			tipoValor = 'esCheckInput';
			tipo = 'Check inputs';
		}else if(campo.esListaCheck){
			tipoValor = 'esListaCheck';
			tipo = 'lista check';
		}else if(campo.esListaRadio){
			tipoValor = 'esListaRadio';
			tipo = 'lista radio';
		}else if(campo.esPorcentaje){
			tipoValor = 'esPorcentaje';
			tipo = 'Porcentajes';
		}else if(campo.esSelect){
			tipoValor = 'esSelect';
			tipo = 'Selects';
		}else if(campo.esSelectInput){
			tipoValor = 'esSelectInput';
			tipo = 'Select inputs';
		}else if(campo.esTemperatura){
			tipoValor = 'esTemperatura';
			tipo = 'Temperatura';
		}else if(campo.esTextArea){
			tipoValor = 'esTextArea';
			tipo = 'Textarea';
		}else if(campo.esTipoModulo){
			tipoValor = 'esTipoModulo';
			tipo = 'Tipo modulo';
		}

		if(campoEstilo.quitarTodosMenosAEste == true){
			quitar = `
			 <div class="custom-control custom-checkbox my-1 mr-sm-2" style="top:10px;">
				 <input type="checkbox" onclick="SAUP190122formBuilder.eliminaClases(this)"  class="custom-control-input" id="quitarTodosMenosAEste" value="quitar">
				 <label class="custom-control-label" for="quitarTodosMenosAEste">Eliminar a todos los demas la clase agregada a los (${tipo}).</label>
			 </div>
			`;
	 }
	
		var html = `
			<div class="col">
				<label><b>Nombre del campo</b></label>
				<input id="nombreCampo" class="form-control" value="${campo.campo}">
			</div>

			<div class="col" style="top:9px;">
				<label><b>Texto dentro del campo</b></label>
				<input id="placeholderCampo" class="form-control" value="Agrega ${campo.campo}">
			</div>

			<div class="col">
				<div class="custom-control custom-checkbox my-1 mr-sm-2" style="top:10px;">
					<input type="checkbox" class="custom-control-input" id="esObligatorioCampo" ${obligatorio}>
					<label class="custom-control-label" for="esObligatorioCampo">Campo obligatorio.</label>
				</div>
			</div>`;
			if(jQuery("#listaRadioPersonalizado").is(':checked')){
				html += ` 
					<hr>
					<div class="col">
						<label><b>Clase del contenedor</b></label>
						<input id="estilosContenedor" class="form-control" value="${(campoEstilo.estilosContenedor) ? campoEstilo.estilosContenedor : ''}">
					</div>
					<div class="col" style="top:9px;">
						<label><b>Clase del label</b></label>
						<input id="estilosLabel" class="form-control" value="${(campoEstilo.estilosLabel) ? campoEstilo.estilosLabel : ''}">
					</div>
					<div class="col" style="top:9px;">
						<label><b>Clase del input</b></label>
						<input id="estilosInput" class="form-control" value="${(campoEstilo.estilosInput) ? campoEstilo.estilosInput : ''}">
					</div>
					<div class="col">
						<div class="custom-control custom-checkbox my-1 mr-sm-2" style="top:10px;">
							<input onclick="SAUP190122formBuilder.aplicaTodos(this)" type="checkbox" ${(campoEstilo.aplicarAtodos!=undefined) ? (campoEstilo.aplicarAtodos == true) ? 'checked' : '' : ''} class="custom-control-input" id="aplicarAtodos" value="${tipoValor}">
							<label class="custom-control-label" for="aplicarAtodos">Aplicar a todos los tipo (${tipo}).</label>
						</div>
						${quitar}
					</div>
					<input type="hidden" value="${tipoValor}" id="tipoValor">
				`;
			}

		return html;
		

	}

	this.configuracionCampo = function(tk){
		var tkCampo = tk;
		var campo = _.where(objetoGeneral.contenedorForm,{tkCampo:tkCampo})[0];
		var styleCustom = self.agregaTipoCampoEstilosPersonalizados(tk);
		jQuery("#modalSetting").remove();
	
		if(tkCampo){
			var html = `
				<!-- Modal -->
				<div class="modal fade bd-example-modal-md" id="modalSetting" tabindex="-1" role="dialog" aria-labelledby="personalizadoCampo" aria-hidden="true">
					<div class="modal-dialog modal-lg" role="document">
						<div class="modal-content">
							<div class="modal-header">
								<h5 class="modal-title" id="personalizadoCampo">
									Personalización del campo - ${campo.campo}
								</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body">
								<form>
									<div class=" col-12 SAUP190122contenedorSubdivision">
										<div class="">
											<div class="row">
												<div class="col-12">
													<form>
														<div class="form">					
															${styleCustom}
														</div>
														<br>
													</form>
												</div>
											</div>
										</div>
									</div>
								</form>
							</div>
							<div class="modal-footer">
									<button type="button" id="btnCerrar" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
									<button type="button" class="btn btn-primary" onclick="SAUP190122formBuilder.guardarConfiguracion('${tkCampo}',this)">Guardar</button>
							</div>
						</div>
					</div>
				</div><!-- Modal -->
			`;
			var camposPersonalizados = _.where(objetoGeneral.configuracionCampos, {tkCampo:tkCampo})[0];
			jQuery("#muestraCrearForm").append(html);

			if(_.size(camposPersonalizados)>0){
				(camposPersonalizados.nombreCampo) ? jQuery("#nombreCampo").val(camposPersonalizados.nombreCampo) : '';
				(camposPersonalizados.placeholderCampo) ? jQuery("#placeholderCampo").val(camposPersonalizados.placeholderCampo) : '';
				(camposPersonalizados.esObligatorioCampo !=undefined) ?	jQuery("#esObligatorioCampo").prop('checked',camposPersonalizados.esObligatorioCampo) : '';
				(camposPersonalizados.estilosContenedor) ? jQuery("#estilosContenedor").val(camposPersonalizados.estilosContenedor) : '';
				(camposPersonalizados.estilosLabel) ? jQuery("#estilosLabel").val(camposPersonalizados.estilosLabel) : '';
				(camposPersonalizados.estilosInput) ? jQuery("#estilosInput").val(camposPersonalizados.estilosInput) : '';
				(camposPersonalizados.aplicarAtodos !=undefined) ? jQuery("#aplicarAtodos").prop('checked',camposPersonalizados.aplicarAtodos) : '';
			}
			
			jQuery('#modalSetting').modal('show');
		}else{
			SAUP190122fn.mensajeError('Ocurrio un error.','Por favor intenta mas tarde.');
			return false;
		}
		
	}

	this.muestraPersonalizdo = function(t){
		var elemento = jQuery(t);
		
		if(jQuery(elemento).val()==2){
			jQuery("#configEstilos").slideDown();
		}else{
			jQuery("#configEstilos").slideUp();
			jQuery("#configEstilos input").val('');
		}
	}

	this.ejemploEstilos = function(){
		jQuery("#modalSetting").remove();
		var html = `
			<!-- Modal -->
			<div class="modal fade bd-example-modal-md" id="modalSetting" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div class="modal-dialog modal-lg" role="document">
							<div class="modal-content">
									<div class="modal-header">
											<h5 class="modal-title" id="exampleModalLabel">Estructura html</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
													<span aria-hidden="true">&times;</span>
											</button>
									</div>
									<div class="modal-body ">
										
										//Contenedor principal CSS
										<pre>&lt;div class=&quot;contenedorPrincipalCss&quot;&gt;</pre>
											&nbsp;&nbsp;//Titulo CSS
											<pre>&nbsp;&nbsp;&lt;label class=&quot;TituloCss&quot;&gt; Ejemplo &lt;/label&gt;</pre>
											&nbsp;&nbsp;//Descripcion CSS
											<pre>&nbsp;&nbsp;&lt;div class=&quot;DescripcionCss&quot;&gt;</pre>
												&nbsp;&nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin aliquam maximus lectus 
											<pre>&nbsp;&nbsp;&lt;/div&gt;</pre>
											&nbsp;&nbsp;//Form CSS
											<pre>&nbsp;&nbsp;&lt;form class=&quot;FormCss&quot;&gt;</pre>
											&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//Contenedor del input
												<pre>&nbsp;&nbsp;&nbsp;&nbsp;&lt;div class=&quot;ContenedorCss&quot;&gt;</pre>
												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//Label CSS
													<pre>&nbsp;&nbsp;&nbsp;&nbsp;&lt;label class=&quot;LabelCss&quot;&gt;Nombre&lt;/label&gt;</pre>
													&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//Input Css
													<pre>&nbsp;&nbsp;&nbsp;&nbsp;&lt;input class=&quot;InputCss&quot; /&gt;</pre>
												<pre>&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;</pre>
											<pre>&nbsp;&nbsp;&lt;/form&gt;</pre>
											&nbsp;&nbsp;//Boton CSS
											<pre>&nbsp;&nbsp;&lt;div class=&quot;BotonCss&quot;&gt;</pre>
												<pre>&nbsp;&nbsp;&nbsp;&nbsp;&lt;div&gt;Boton&lt;/div&gt;</pre>
											<pre>&nbsp;&nbsp;&lt;/div&gt;</pre>
										<pre>&lt;/div&gt;</pre>
										
									</div>
									<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
									</div>
							</div>
					</div>
			</div><!-- Modal -->
		`;
		jQuery("#muestraCrearForm").append(html);
		jQuery('#modalSetting').modal('show');
		
	}

	this.previsualizar = function(){
		var id_formulario = (id_formulario) ? id_formulario : '';
		var array = objetoGeneral.contenedorForm;
		var nombreFormulario = jQuery("#nombreFormulario").val();
		var tituloFormulario = jQuery("#tituloFormulario").val();
		var descripcionFormulario = jQuery("#descripcionFormulario").val();
		var btnFormulario = jQuery("#btnFormulario").val();
		var mensajeSuccess = jQuery("#mensajeSuccess").val();
		var mensajeSubSuccess = jQuery("#mensajeSubSuccess").val();
		var mensajeError = jQuery("#mensajeError").val();
		var mensajeSubError = jQuery("#mensajeSubError").val();
		var claseContenedorPrincipal = jQuery("#claseContenedorPrincipal").val();
		var claseLabelTitulo = jQuery("#claseLabelTitulo").val();
		var claseBotonGuardar = jQuery("#claseBotonGuardar").val();
		var claseFormContenedor = jQuery("#claseFormContenedor").val();
		var claseDescripcionContenedor = jQuery("#claseDescripcionContenedor").val();
		var estilosPersonalizados = jQuery("#listaRadioPersonalizado").is(':checked') ? 2 : 1;

		var urlRedireccion = jQuery("#urlRedireccion").val();
		var radioSelect = self.procesaRadios();
		var formulario = [];

		for (var i = 0; i < array.length; i++) {
			formulario.push({campo:btoa(JSON.stringify(array[i]))});
		}

		var configuracion = btoa(JSON.stringify({
			descripcion: descripcionFormulario,
			btnNombre: btnFormulario,
			mensajeSuccess: mensajeSuccess,
			mensajeSubSuccess: mensajeSubSuccess,
			mensajeError: mensajeError,
			mensajeSubError: mensajeSubError,
			claseContenedorPrincipal: claseContenedorPrincipal,
			claseLabelTitulo: claseLabelTitulo,
			claseBotonGuardar: claseBotonGuardar,
			claseFormContenedor: claseFormContenedor,
			claseDescripcionContenedor: claseDescripcionContenedor,
			urlRedireccion:urlRedireccion,
			radio:radioSelect,
			estilosPersonalizados:estilosPersonalizados,
			tituloFormulario:tituloFormulario,
			configuracionCampos:JSON.stringify(objetoGeneral.configuracionCampos),
			configuracionEstilos:JSON.stringify(objetoGeneral.configuracionEstilos)
		}));
	
		var vista = self.templatePublic({
			cabecera: [{
				configuracion:configuracion,
				nombre_formulario:nombreFormulario
			}],
			cuerpo: formulario,
			pre:true
		});

		jQuery("#modalSetting").remove();
		if(vista){
			var html = `
				<!-- Modal -->
				<div class="modal fade bd-example-modal-md" id="modalSetting" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
						<div class="modal-dialog modal-lg" role="document">
								<div class="modal-content">
										<div class="modal-header">
												<h5 class="modal-title" id="exampleModalLabel">Configuracion</h5>
												<button type="button" class="close" data-dismiss="modal" aria-label="Close">
														<span aria-hidden="true">&times;</span>
												</button>
										</div>
										<div class="modal-body">
											${vista}
										</div>
										<div class="modal-footer">
												<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
										</div>
								</div>
						</div>
				</div><!-- Modal -->
			`;
			jQuery("#muestraCrearForm").append(html);
			jQuery('#modalSetting').modal('show');
		}else{
			SAUP190122fn.msgError('Ocurrio un error.','Por favor intenta mas tarde.');
			return false;
		}
	}
  
	this.templateMain = function(obj) {
	  var id_formulario = _.size(obj) ? obj.id_formulario : "";
	  var regrear = _.size(obj) ? obj.id_formulario : "";
		var regresaHtml = regrear	? `<i data-toggle="tooltip" data-placement="top"  title="Lista de formularios" class="Pointer pull-right fa fa-arrow-left" aria-hidden="true" onclick="SAUP190122principal.init({menu:'crearFormulario'})"></i>`
		: `<i data-toggle="tooltip" data-placement="top"  title="Lista de formularios" class="Pointer pull-right fa fa-arrow-left" aria-hidden="true" onclick="SAUP190122principal.init({menu:'crearFormulario'})"></i>`;
		
	  var html = `
					<div class="container" id="muestraCrearForm">
					<div class="row ">
							<div class="col-12">
									<div class="card col-12">
											<div class="card-header">
													<ul class="nav nav-tabs card-header-tabs">
															<li id="tab1" class="Pointer nav-item" onclick="SAUP190122formBuilder.tabsConfig(this);">
																	<a class=" nav-link active">Campos del formulario</a>
															</li>
															<li id="tab2" class="Pointer nav-item" onclick="SAUP190122formBuilder.tabsConfig(this);">
																	<a class="nav-link">Configuración</a>
															</li>
													</ul>
												
											</div>
											<div class="card-body card-group" id="SAUP190122ocultarFormularioConfig">
												<div class="col-6">
													<div class="card" style=" ">
														<div class="card-header text-center">
															Campos disponibles  
														</div>
														<div class="ui-widget-header" style="height: auto;">
															<ul id="SAUP190122inputsContenedor" class="connectedSortable list-group list-group-flush" style="min-height:350px;max-height: 550px; overflow: auto;">
															</ul>
														</div>
													</div>
												</div>
												<div class="col-6">
													<div class="card">
														<div class="card-header text-center">
															<i onclick="SAUP190122formBuilder.previsualizar()" data-toggle="tooltip" data-placement="top"  title="previsualizar" class="Pointer pull-left fa fa-eye"></i>
																Tu formulario
															<i data-toggle="tooltip" data-placement="top"  title="Eliminar  elementos"class="Pointer pull-right fa fa-trash" aria-hidden="true" onclick="SAUP190122formBuilder.regresaInputs()"></i>
														</div>
														<div class="ui-widget-header" style="height: auto;">
															<ul id="SAUP190122formContenedor" class="connectedSortable list-group list-group-flush" style="min-height:350px; max-height: 550px; overflow: auto;"></ul>
														</div>
													</div>
												</div>
												<div class="col" style="top:10px">
													<span  class="btn btn-primary pull-right" onclick="SAUP190122formBuilder.tabsConfig('#tab2')">Configuración</span>
												</div>
											</div>
											<div id="ocultarBodyConfig" class="card-body" style="display:none; padding-left:0px;padding-right:0px;padding-top:0px;">
													<div class="card col-12 SAUP190122contenedorSubdivision">
														<div class="card-body">
															<div class="row">
																<div class="col-12">
																	<label for="nombreFormulario">Nombre</label>
																	<input id="nombreFormulario" type="text" class="obligatorio form-control obligatorio" placeholder="Nombre del formulario">
																	<div class="invalid-feedback">
																			El nombre del formulario es obligatorio!
																	</div>
																</div>
																<div class="col-12 SAUP190122margenTop">
																	<label for="tituloFormulario">Titulo</label>
																	<input id="tituloFormulario" type="text" class="form-control" placeholder="Nombre del formulario">
																</div>
																<div class="col-12 SAUP190122margenTop">
																	<label for="descripcionFormulario">Descripción</label>
																	<textArea id="descripcionFormulario" type="text" class="form-control" placeholder="Descripción del formulario"></textarea>
																</div>
															</div>
														</div>
													</div>
													<div class="card col-12 SAUP190122contenedorSubdivision">
														<div class="card-body">
															<h5 class="card-title">Identifica los contactos en SalesUp!</h5>
															<div class="row">
																<div class="col-12">
																	<form>
																		<div class="form-row">
																			<div class="col">
																				<label for="etiquetaForm">Etiqueta(s) </label>
																				<select id="etiquetaData" onchange="SAUP190122formBuilder.selectEtiqueta(value)" class="SAUP190122selectBotstrap form-control"></select>
																				<div id="bodyEtiquetas"></div>
																				 
																			</div>
																			<div class="col">
																				<label for="orgienForm">Origen</label>
																				<select id="origenData" class="SAUP190122selectBotstrap obligatorio form-control"></select>
																				<div class="invalid-feedback">
																						El origin es obligatorio!
																				</div>
																			</div>
																			<div class="col">
																				<label for="orgienForm">
																					Asignar a usuario
																				</label>
																				<select id="usuarioData" class="SAUP190122selectBotstrap form-control"><option value="">(.. Ninguno ..)</option></select>
																			</div>
																		</div>
																	</form>
																</div>
															</div>
														</div>
													</div>	
													
													<div class="card col-12 SAUP190122contenedorSubdivision">
														<div class="card-body">
															<h5 class="card-title">Mensaje de confirmación de envío de datos</h5>
															<div class="row">
																<div class="col-12">
																	<form>
																		<div class="form-row">
																			<div class="col">
																					<label for="">Texto principal	</label>
																					<input id="mensajeSuccess" class="obligatorio form-control" value="¡Excelente!">
																					<div class="invalid-feedback">
																							El mensaje es obligatorio!
																					</div>
																			</div>
																			<div class="col">
																					<label for="">Texto complementario</label>
																					<input id="mensajeSubSuccess" class="obligatorio form-control" value="La información se envió correctamente">
																					<div class="invalid-feedback">
																							El mensaje es obligatorio!
																					</div>
																			</div>
																		</div>
																	</form>
																</div>
															</div>
														</div>
													</div>
													<div class="card col-12 SAUP190122contenedorSubdivision">
															<div class="card-body">
																	<h5 class="card-title">Mensaje de error de un campo obligatorio no llenado</h5>
																	<div class="row">
																			<div class="col-12">
																					<form>
																							<div class="form-row">
																									<div class="col">
																											<label for="">Texto principal	</label>
																											<input id="mensajeError" class="obligatorio form-control" value="Error">
																											<div class="invalid-feedback">
																													El mensaje es obligatorio!
																											</div>
																									</div>
																									<div class="col">
																											<label for="">Texto complementario
																											</label>
																											<input id="mensajeSubError" class="obligatorio form-control" value="La información no pudo ser enviada">
																											<div class="invalid-feedback">
																													El mensaje es obligatorio!
																											</div>
																									</div>
																							</div>
																					</form>
																			</div>
																	</div>
															</div>
													</div>
														
													<div class="card col-12 SAUP190122contenedorSubdivision">
														<div class="card-body">
															<h5 class="card-title">URL de redirección al finalizar el envío de datos (opcional).</h5>
															<div class="row">
																<div class="col-12">
																	<form>
																		<div class="form-row">
																			<div class="col">
																				<label for="">URL</label>
																				<input id="urlRedireccion" class="form-control" value="">
																			</div>
																		</div>
																	</form>
																</div>
															</div>
														</div>
													</div>
													<div class="card col-12 SAUP190122contenedorSubdivision">
														<div class="card-body">
															<h5 class="card-title">Webhook.</h5>
															<div class="row">
																<div class="col-12">
																	<form>
																		<div class="form-row">
																			<div class="col">
																				<label for="">URL</label>
																				<input id="webhook" class="form-control" value="">
																			</div>
																		</div>
																	</form>
																</div>
															</div>
														</div>
													</div>
													<div class="card col-12 SAUP190122contenedorSubdivision">
														<div class="card-body">
															<h5 class="card-title">Configuraci&oacute;n de estilos <i onclick="SAUP190122formBuilder.ejemploEstilos()" class="Pointer fa fa-question-circle"></i></h5> 
															<div class="row">
																<div class="col-12">
																	 
																		<div class="form-check form-check-inline">
																			<input checked onclick="SAUP190122formBuilder.muestraPersonalizdo(this)" class="form-check-input "  type="radio" value="1" name="listaRadioPersonalizado" id="listaRadioBootstrap">
																			<label class="form-check-label" for="listaRadioPersonalizado">
																				Estilos bootstrap
																			</label>
																		</div>
																		<div class="form-check form-check-inline">
																			<input onclick="SAUP190122formBuilder.muestraPersonalizdo(this)"   class="form-check-input "  type="radio" value="2" name="listaRadioPersonalizado" id="listaRadioPersonalizado">
																			<label class="form-check-label" for="listaRadioPersonalizado">
																				Estilos Personalizados
																			</label>
																		</div>
																	 
																</div>
															</div>
															<div class="row">
																<div class="col-12">
																	<form id="configEstilos" style="display:none;margin-top:20px;">
																		<div class="form-row">
																			<div class="col">
																				<label>Contenedor principal</label>
																				<input type="text" class="form-control" id="claseContenedorPrincipal" value="">
																			</div>
																			<div class="col">
																				<label>Titulo</label>
																				<input type="text" class="form-control" id="claseLabelTitulo" value="">
																			</div>
																			<div class="col">
																				<label>Form</label>
																				<input type="text" class="form-control" id="claseFormContenedor" value="">
																			</div>
																			<div class="col">
																				<label>Descripcion</label>
																				<input type="text" class="form-control" id="claseDescripcionContenedor" value="">
																			</div>
																			<div class="col">
																				<label>Boton guardar</label>
																				<input type="text" class="form-control" id="claseBotonGuardar" value="">
																			</div>
																		</div>
																	</form>
																</div>
															</div>
														</div>
													</div>
													<div class="card col-12 SAUP190122contenedorSubdivisionUltimo">
														<div class="card-body">
															<h5 class="card-title">Bot&oacute;n</h5>
															<div class="row">
																<div class="col-12">
																	<form>
																		<div class="form-row">
																			<div class="col">
																					<label for="nombreBoton">Texto en el botón <span id="btnTipoColor" class="btn btn-primary">Color</span></label>
																					<input id="btnFormulario" class="obligatorio form-control" value="Enviar">
																					<div class="invalid-feedback">
																							El nombre del boton es obligatorio!
																					</div>
																			</div>
																			<div class="col">
																				<label for="nombreBoton">Color del bot&oacute;n</label><br>
																				<div id="btnColoRadio" class="btn-group btn-group-toggle" data-toggle="buttons">
																					<label class="btn btn-primary" onclick="SAUP190122formBuilder.colorBoton('btn-primary');">
																						<input type="radio" name="options" autocomplete="off" value="btn-primary">  Bot&oacute;n
																					</label>
																					<label onclick="SAUP190122formBuilder.colorBoton('btn-secondary');" class="btn btn-secondary">
																						<input type="radio" name="options" autocomplete="off"  value=" btn-secondary"> Bot&oacute;n
																					</label>
																					<label onclick="SAUP190122formBuilder.colorBoton('btn-warning');" class="btn btn-warning">
																						<input type="radio" name="options" autocomplete="off"  value="btn-warning"> Bot&oacute;n
																					</label>
																					<label onclick="SAUP190122formBuilder.colorBoton('btn-success');" class="btn btn-success">
																						<input type="radio" name="options"  autocomplete="off"  value="btn-success"> Bot&oacute;n
																					</label>
																					<label onclick="SAUP190122formBuilder.colorBoton('btn-danger');" class="btn btn-danger">
																						<input type="radio" name="options"  autocomplete="off"  value="btn-danger"> Bot&oacute;n
																					</label>
																					<label onclick="SAUP190122formBuilder.colorBoton('btn-info');" class="btn btn-info">
																						<input type="radio" name="options"  autocomplete="off"  value="btn-info"> Bot&oacute;n
																					</label>
																					<label onclick="SAUP190122formBuilder.colorBoton('btn-light');" class="btn btn-light">
																						<input type="radio" name="options"  autocomplete="off"  value="btn-light"> Bot&oacute;n
																					</label>
																					<label onclick="SAUP190122formBuilder.colorBoton('btn-dark');" class="btn btn-dark">
																						<input type="radio" name="options"  autocomplete="off"  value="btn-dark"> Bot&oacute;n
																					</label>
																				</div>
																			</div> 
																		</div>
																	</form>
																</div>
															</div>
														</div>
													</div>
													<div class="col">
														<span style="top:20px;" onclick="SAUP190122formBuilder.guardaFormulario({id_formulario:${id_formulario || 0},t:this})" class=" pull-right btn btn-primary">${(id_formulario) ? 'Actualizar formulario' : 'Guardar formulario'}</span>	
													</div>
											</div>
									</div>
							</div>
					</div>
			</div>			
		`;
	  return html;
	};

	this.fechaActiva = function(t){
		if(!jQuery(t).hasClass('hasDatepicker')){
			jQuery(t).datepicker({
				closeText: 'Cerrar',
				prevText: '<Ant',
				nextText: 'Sig>',
				currentText: 'Hoy',
				monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
				monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
				dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
				dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
				dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
				weekHeader: 'Sm',
				dateFormat: 'dd/mm/yy',
				firstDay: 1,
				isRTL: false,
				showMonthAfterYear: false,
				yearSuffix: ''
			});
			jQuery(t).datepicker( "show" );
		}
		
	}

	this.selectEstado = function(t){
		var idPais = jQuery(t).val();
		var estilos = jQuery(t).data('estilos');
		var tipoCss = jQuery(t).data('cssestilos');
		jQuery('#select-4C9E021D-5927-4F06-ADC0-62E6B9326094').remove();
		if(idPais){
			var procesaEstado = function(res, err){
				if ( err) {
					SAUP190122fn.mensaje("error");
					return false;
				}
				var estilosCss = (estilos==2) ? tipoCss : 'form-group';
				var estilosCss2 = (estilos==2) ? tipoCss : 'SAUP190122selectBotstrap  form-control';
				var html = `
					<div id="select-4C9E021D-5927-4F06-ADC0-62E6B9326094" class="form-group">
						<label class="SAUP190122labelPublic">Estado</label>
						<select data-campo="pEstado" class="SAUP190122selectBotstrap  form-control" onchange="SAUP190122formBuilder.selectMunicipio(this,'${idPais}', '${estilos}', '${tipoCss}')">
						<option value="">(... Selecciona el estado ...)</option>`;
				
						for (let i = 0; i < res.length; i++) {
							html +=  '<option value="' +  res[i].idestado +  '">' +  res[i].estado +  "</option>";
						}

				html += `</div>`;
				jQuery('#select-E2EF09FF-44A1-49A0-9744-CA31136031D2').remove();
				if(res.length>0){
					jQuery(t).closest('div').after(html);
				}
				
			}
			var data = { token: sesion };
			SAUP190122fn.peticionAjax({
				url: url_pais+idPais+'/estados',
				metodo: "GET",
				data: data,
				async: true,
				callback: procesaEstado
			});
		}		
	}

	this.selectMunicipio = function(t,idPais,tieneEstilo,estilo){
		var idEstado = jQuery(t).val();
		var idPais = idPais;

		jQuery('#select-E2EF09FF-44A1-49A0-9744-CA31136031D2').remove();
		if(idEstado && idPais){
			var procesaEstado = function(res, err){
				if ( err) {
					SAUP190122fn.mensaje("error");
					return false;
				}
				var estilosCss = (tieneEstilo==2) ? estilo : 'form-group';
				var estilosCss2 = (tieneEstilo==2) ? estilo : 'SAUP190122selectBotstrap  form-control';
				var html = `
					<div id="select-E2EF09FF-44A1-49A0-9744-CA31136031D2" class="form-group" >
						<label class="SAUP190122labelPublic">Municipio</label>
						<select data-campo="idMunicipio" class="SAUP190122selectBotstrap  form-control">
						<option value="">(... Selecciona el municipio ...)</option>`;
				
						for (let i = 0; i < res.length; i++) {
							html +=  '<option value="' +  res[i].idMunicipio +  '">' +  res[i].municipio +  "</option>";
						}

				html += `</div>`;
				if(res.length>0){
					jQuery(t).closest('div').after(html);
				}
			}
			var data = { token: sesion };
			SAUP190122fn.peticionAjax({
				url: url_pais+idPais+'/estados/'+idEstado+'/municipios',
				metodo: "GET",
				data: data,
				async: true,
				callback: procesaEstado
			});
		}		
	}

	this.construyeTipoCampo = function(obj) {
		var campoDatos = obj.campoDecode || {};
		var tkCampo = obj.tkCampo; 
		var configCampos = (obj.objCamposConfig) ? obj.objCamposConfig : {};
		var configuracionCampos = (configCampos.configuracionCampos) ? configCampos.configuracionCampos : {};
		configuracionCampos = _.where(configuracionCampos,{tkCampo:tkCampo})[0];		
		var obliga = (configuracionCampos) ? (configuracionCampos.esObligatorioCampo) ? 'obliga' : '' : '';
		var placeholderCampo = (configuracionCampos) ? (configuracionCampos.placeholderCampo) ? 		
		configuracionCampos.placeholderCampo : 'Agrega  '+campoDatos.campo : 'Agrega '+campoDatos.campo;		 
		var estilosPersonalizados = obj.estilosPersonalizados;
		
		var estilosInput = (estilosPersonalizados == 2) ? obj.estilosInput : 'form-control';
		
		var selectEstilos = (estilosPersonalizados == 2) ? estilosInput : 'SAUP190122selectBotstrap form-control';		

		if (!campoDatos) {
			SAUP190122fn.msgError("Ocurrio un problema, por favor de intentar mas tarde");
			return false;
		}
  
	  	if (campoDatos.esSelect) {
		
			var selectArmado = "";
  
			if (campoDatos.atributoDataIdc == -5) {
				
				var select = '<select data-campo="' + campoDatos.atributoNombre +'" data-idcampo="'+campoDatos.atributoDataIdc+'" class=" '+obliga+' '+selectEstilos+' " >';
				var selectPlaceHolder = placeholderCampo || 'Selecciona una opcion';
				var opciones ='<option value="">(... '+selectPlaceHolder+' ...)</option>';
				opciones +='<option value="M">Mujer</option><option value="H">Hombre</option>';
				selectArmado = select + opciones + "</select>";
				setTimeout(function() {
				if(jQuery("#select-" + tkCampo+' select').length==0){
					jQuery("#select-" + tkCampo).append(selectArmado);
				}
				
				}, 500);
			
			} else {
			
				var procesaSelect = function(res, err) {
					if (!err) {
						objetoGeneral.selects[campoDatos.atributoId] = res;
						var funcion = (campoDatos.atributoDataIdc == -29) ? 'SAUP190122formBuilder.selectEstado(this)' : '';

						var select ='<select data-campo="' +campoDatos.atributoNombre +'" data-idcampo="'+campoDatos.atributoDataIdc+'" data-estilos="'+estilosPersonalizados+'" data-cssEstilos="'+selectEstilos+'" class="'+obliga+' '+selectEstilos+'" onchange="'+funcion+'">';

						var selectPlaceHolder = placeholderCampo || 'Selecciona una opcion';
						
						var opciones ='<option value="">(... '+selectPlaceHolder+' ...)</option>';
			
						if (res.length != 0) {
							for (var i = 0; i < res.length; i++) {
								if (campoDatos.atributoDataIdc == -4) {
									opciones +='<option value="' +res[i].tkTitulo +'">' + res[i].titulo + "</option>";
								} else if (campoDatos.atributoDataIdc == -21) {
									opciones +='<option value="' +  res[i].tkFase +'">' +  res[i].fase + "</option>";
								} else if (campoDatos.atributoDataIdc == -20) {
									opciones +='<option value="' +  res[i].tkOrigen +'">' +  res[i].origen + "</option>";
								}  else if (campoDatos.atributoDataIdc == -29) {
									opciones +='<option value="' +  res[i].idPais +'">' + res[i].pais + "</option>";
								}else {
									opciones +='<option value="' + res[i].tkOpcion +'">' + res[i].opcion + "</option>";
								}
							}
							selectArmado = select + opciones + "</select>";
						}
					} else {
						SAUP190122fn.msgError('Las opciones de "' + campoDatos.campo + '" no se encontraron' );
						selectArmado = '<select data-campo="' +campoDatos.atributoNombre +'" data-idcampo="'+campoDatos.atributoDataIdc+'" class="'+obliga+' '+selectEstilos+'" ><option value="">(... Sin datos ...)</option></select>';
					}
					setTimeout(function() {
						if(jQuery("#select-" + tkCampo+' select').length==0){
							jQuery("#select-" + tkCampo).append(selectArmado);
						}
					}, 500);
				};
		
				var url = (campoDatos.atributoDataIdc == -4) ? url_titulo  : url_opciones_select + campoDatos.tkCampo + "/opciones";
				var data = { token: sesion };
				
				if (campoDatos.atributoDataIdc == -21) {
					url = url_opciones_integracion + "?catalogo=fases";
					data.token = token;
				} else if (campoDatos.atributoDataIdc == -20) {
					url = url_opciones_integracion + "?catalogo=origenes";
					data.token = token;
				}else if(campoDatos.atributoDataIdc == -29){
					url = url_pais;
					data.token = token;
				}
		
				if (_.size(objetoGeneral.selects[campoDatos.atributoId]) > 0) {
					procesaSelect(objetoGeneral.selects[campoDatos.atributoId], "");
				} else {
					SAUP190122fn.peticionAjax({
						url: url,
						metodo: "GET",
						data: data,
						async: true,
						callback: procesaSelect
					});
				}
			}
	  }else if (campoDatos.esCheckInput) {		

		if(estilosPersonalizados != 2){
			var checkinput = `
			<div class="input-group">
				<div class="input-group-prepend">
					<div class="input-group-text">
					<input type="checkbox" id="checkOfInput" data-idcampo="${campoDatos.atributoDataIdc}" onclick="SAUP190122formBuilder.checkInput(this)">
					</div>
				</div>
				<input disabled data-campo="${campoDatos.atributoNombre }" data-idcampo="${campoDatos.atributoDataIdc}" type="text" class="${obliga} form-control" id="checkinput" placeholder="${placeholderCampo || self.validaCampo(campoDatos.atributoPlaceholder)}">
			</div>
		`;
		}else{
			var checkinput = `
			<div class="${estilosInput}">
				<div class="">
					<div class="">
					<input type="checkbox" id="checkOfInput" data-idcampo="${campoDatos.atributoDataIdc}" onclick="SAUP190122formBuilder.checkInput(this)">
					</div>
				</div>
				<input disabled data-campo="${campoDatos.atributoNombre }" data-idcampo="${campoDatos.atributoDataIdc}" type="text" class="${obliga}" id="checkinput" placeholder="${placeholderCampo || self.validaCampo(campoDatos.atributoPlaceholder)}">
			</div>
		`;
		}

		return checkinput;
	  }else if (campoDatos.esInput) {
		  	if(campoDatos.atributoDataIdc == -6){
				var input = `
					<input onchange="SAUP190122formBuilder.validaCorreoForm(this);" type="text" data-campo="${campoDatos.atributoNombre}" data-idcampo="${campoDatos.atributoDataIdc}" class="obliga ${estilosInput}" id="input" placeholder="${placeholderCampo || self.validaCampo(campoDatos.atributoPlaceholder)}"/>
				`;
			}else 	if(campoDatos.atributoDataIdc == 9  ||campoDatos.atributoDataIdc == 10  ||campoDatos.atributoDataIdc == 11  ||campoDatos.atributoDataIdc == 12  ||campoDatos.atributoDataIdc == 70  ||campoDatos.atributoDataIdc == 71  ||campoDatos.atributoDataIdc == 72  ||campoDatos.atributoDataIdc == 73  ||campoDatos.atributoDataIdc == 74  ||campoDatos.atributoDataIdc == 75  ||campoDatos.atributoDataIdc == 76  ||campoDatos.atributoDataIdc == 77  || campoDatos.atributoDataIdc == 78 || campoDatos.atributoDataIdc == 79  || campoDatos.atributoDataIdc == 80 || campoDatos.atributoDataIdc == 81 || campoDatos.atributoDataIdc == 82 || campoDatos.atributoDataIdc == 83 || campoDatos.atributoDataIdc == 84 || campoDatos.atributoDataIdc == 85){
				var input = `
					<input readonly onclick="SAUP190122formBuilder.fechaActiva(this)" type="text" data-campo="${campoDatos.atributoNombre}" data-idcampo="${campoDatos.atributoDataIdc}" class="${obliga} ${estilosInput}" id="input-${tkCampo}" placeholder="${placeholderCampo || self.validaCampo(campoDatos.atributoPlaceholder)}"/>
				`;
			}else if(campoDatos.atributoDataIdc == 33){
				var input = `
					<input type="numeric" data-campo="${campoDatos.atributoNombre}" data-idcampo="${campoDatos.atributoDataIdc}" class="${obliga} ${estilosInput}" id="input" placeholder="${placeholderCampo || self.validaCampo(campoDatos.atributoPlaceholder)}"/>
				`;
			}else{
				var input = `
					<input type="text" data-campo="${campoDatos.atributoNombre}" data-idcampo="${campoDatos.atributoDataIdc}" class="${obliga} ${estilosInput}" id="input" placeholder="${placeholderCampo || self.validaCampo(campoDatos.atributoPlaceholder)}"/>
				`;
			}
			
			return input;
	  }else if (campoDatos.esTextArea) {
			var textArea = `
				<textarea data-campo="${ campoDatos.atributoNombre}" data-idcampo="${campoDatos.atributoDataIdc}" class="${obliga} ${estilosInput}" id="textarea" placeholder="${placeholderCampo || self.validaCampo(campoDatos.atributoPlaceholder)}"></textarea>
			`;
			return textArea;
	  }else if (campoDatos.esPorcentaje) {
		var porcentaje = `
			<input data-campo="${campoDatos.atributoNombre }" data-idcampo="${campoDatos.atributoDataIdc}" class="${obliga} ${estilosInput}" type="number" id="inputPorcentaje" min="1" max="100" placeholder="${placeholderCampo || self.validaCampo(campoDatos.atributoPlaceholder)}"/>
		`;

		return porcentaje;
	  }else if (campoDatos.esSelectInput) {
			if(estilosPersonalizados != 2){
				var selectPlaceHolder = placeholderCampo || 'Selecciona una opcion';
				var esSelectInput = `
					<div class="row">
						<div class="col">
							<select data-campo="${campoDatos.atributoNombre }" data-idcampo="${campoDatos.atributoDataIdc}" class="${obliga}  form-control SAUP190122selectBotstrap" id="selectInput"><option value="">(.. Selecciona una opcion ..)</option>`;

						for (let i = 0; i < campoDatos.opciones.length; i++) {
							esSelectInput+=`<option value="${campoDatos.opciones[i].Opcion}">${campoDatos.opciones[i].Opcion}</option>`;
						}
						
						esSelectInput +=`
							</select>
						</div>
						<div class="col">
							<input type="text" class="${obliga} form-control" placeholder="${selectPlaceHolder}" id="inputSelect"/>
						</div>
					</div>
				`;
			}else{
				var selectPlaceHolder = placeholderCampo || 'Selecciona una opcion';
				var esSelectInput = `
					<div class="">
						<div class="">
							<select data-campo="${campoDatos.atributoNombre }" data-idcampo="${campoDatos.atributoDataIdc}" class="${obliga} ${estilosInput}" id="selectInput"><option value="">(.. Selecciona una opcion ..)</option>`;

						for (let i = 0; i < campoDatos.opciones.length; i++) {
							esSelectInput+=`<option value="${campoDatos.opciones[i].Opcion}">${campoDatos.opciones[i].Opcion}</option>`;
						}
						
						esSelectInput +=`
							</select>
						</div>
						<div class="">
							<input type="text" class="${obliga} ${estilosInput}" placeholder="${selectPlaceHolder}" id="inputSelect"/>
						</div>
					</div>
				`;
			}
		    
			
			return esSelectInput;
	  }else if (campoDatos.esListaCheck) {
			var esListaCheck = `
				<select  data-campo="${campoDatos.atributoNombre }" data-idcampo="${campoDatos.atributoDataIdc}" multiple class="${obliga} ${selectEstilos}" id="listaCheck">
			`;

			for (var i = 0; i < campoDatos.opciones.length; i++) {
				esListaCheck += "<option value='"+ campoDatos.opciones[i].Opcion +"'>" + campoDatos.opciones[i].Opcion + "</option>";
			}
  
			esListaCheck += `</select>`;
  
			return esListaCheck;
	  }else if (campoDatos.esListaRadio){
		var esListaRadio = '';
		for (var i = 0; i < campoDatos.opciones.length; i++) {
			if(estilosPersonalizados != 2){
				esListaRadio +=	`
				<div class="form-check form-check-inline">
					<input class="form-check-input ${obliga}" data-campo="${campoDatos.atributoNombre }" data-idcampo="${campoDatos.atributoDataIdc}" type="radio" value="${campoDatos.opciones[i].Opcion}" name="listaRadio" id="listaRadio">
					<label class="form-check-label" for="listaRadio">
						${campoDatos.opciones[i].Opcion}
					</label>
				</div>`;
			}else{
				esListaRadio +=	`
					<input class="${obliga} ${estilosInput}" data-campo="${campoDatos.atributoNombre }" data-idcampo="${campoDatos.atributoDataIdc}" type="radio" value="${campoDatos.opciones[i].Opcion}" name="listaRadio" id="listaRadio">
					<label class="" for="listaRadio">
						${campoDatos.opciones[i].Opcion}
					</label>
				 `;
			}
			
		}
		return esListaRadio;
	  }else if(campoDatos.esTemperatura){
		var esTemperatura = `
			<select  data-campo="${campoDatos.atributoNombre }" data-idcampo="${campoDatos.atributoDataIdc}" class="${obliga} ${selectEstilos}" id="listaCheck"><option value="">(.. Selecciona una opcion ..)</option>
		`;

		for (var i = 0; i < campoDatos.opciones.length; i++) {
			esTemperatura += "<option value='"+ campoDatos.opciones[i].Opcion +"'>" + campoDatos.opciones[i].Opcion + "</option>";
		}

		esTemperatura += `</select>`;
		
		return esTemperatura;
	  }
  
	  SAUP190122fn.initTooltip();
	}
  
	this.templatePublic = function(obj) {
		var idForm = obj.idForm;
		var cabecera = obj.cabecera[0];
		var objConfig = JSON.parse(atob(cabecera.configuracion));
		var cuerpo = obj.cuerpo;
		var configuracionCampos = (objConfig.configuracionCampos) ? JSON.parse((objConfig.configuracionCampos)) : {};
		var configuracionEstilos = (objConfig.configuracionEstilos) ? JSON.parse((objConfig.configuracionEstilos)) : {};
		var claseContenedorPrincipal = (objConfig.claseContenedorPrincipal) ? objConfig.claseContenedorPrincipal : '';
		var claseDescripcionContenedor = (objConfig.claseDescripcionContenedor) ? objConfig.claseDescripcionContenedor : '';
		var claseBotonGuardar = (objConfig.claseBotonGuardar) ? objConfig.claseBotonGuardar : '';
		var claseFormContenedor = (objConfig.claseFormContenedor) ? objConfig.claseFormContenedor : '';
		var claseLabelTitulo = (objConfig.claseLabelTitulo) ? objConfig.claseLabelTitulo : '';
		var radio = (objConfig.radio) ? objConfig.radio : '';
		var tituloFormulario = (objConfig.tituloFormulario) ? objConfig.tituloFormulario : '';
		var descripcion = (objConfig.descripcion) ? objConfig.descripcion : '';
		var objCamposConfig = {configuracionCampos:configuracionCampos,configuracionEstilos:configuracionEstilos};

		var estilosPersonalizados = objConfig.estilosPersonalizados;

		var html = '';

		if(estilosPersonalizados == 2){
			html = `<div class="${claseContenedorPrincipal}"  id="SAUP190122formBuilder-${idForm}">`;
					
					if(tituloFormulario){
						html += `<label class="${claseLabelTitulo}">
							${tituloFormulario}
						</label>`;
					}	

					if(descripcion){
						html += `<div class="${claseDescripcionContenedor}">
							${descripcion}
						</div>`;
					}					
					
					html += `<div class="${claseFormContenedor}" id="SAUP190122formEnviarSalesUp-${idForm}">`; 
						for (var i = 0; i < cuerpo.length; i++) {
							var campoDecode = JSON.parse(atob(cuerpo[i].campo));
							var buscaNombre = _.where(configuracionCampos,{tkCampo:campoDecode.tkCampo})[0];
							var nombreCampo = (buscaNombre) ? (buscaNombre.nombreCampo) ? buscaNombre.nombreCampo : campoDecode.campo : campoDecode.campo;

							var configuracionEstilos = (objCamposConfig.configuracionEstilos) ? objCamposConfig.configuracionEstilos : {};
							var estilos = _.where(configuracionEstilos, {tkCampo:campoDecode.tkCampo})[0];
							var estilosContenedor = (_.size(estilos)>0) ? estilos.estilosContenedor : ''; 
							var estilosLabel = (_.size(estilos)>0) ? estilos.estilosLabel : '';
							var estilosInput = (_.size(estilos)>0) ? estilos.estilosInput : '';
							html += `
								<div id="select-${campoDecode.tkCampo}" class="${estilosContenedor}">
									<label class="${estilosLabel}">${nombreCampo}</label>
									${self.construyeTipoCampo({
										campoDecode:campoDecode, 
										tkCampo:campoDecode.tkCampo, 
										objCamposConfig:objCamposConfig,
										estilosInput:estilosInput,
										estilosPersonalizados:estilosPersonalizados
									}) || ""}
								</div>
							`;
						}
					html+=`<span class="${claseBotonGuardar}" id="SAUP190122-btnGuardarFormulario-${idForm}">${objConfig.btnNombre}</span>
					</div>
					
				</div>
			`;
		}else{
			html = `
				<div class="container" id="SAUP190122formBuilder-${idForm}">
					<div class="row">
						<div class="col-12">
							<div class="card col-12" style="padding-left:0px; padding-right:0px;">
								<div class="card-header text-center">
									${tituloFormulario}
								</div>`;
						if(descripcion){
							html += `
								<ul class="list-group list-group-flush">
									<li class="list-group-item">${descripcion}</li>
								</ul>
							`;										
						}
						html += `
								<div id="ocultarBodyConfig" class="card-body">
									<form id="SAUP190122formEnviarSalesUp-${idForm}">
								`;
									for (var i = 0; i < cuerpo.length; i++) {
										var campoDecode = JSON.parse(atob(cuerpo[i].campo));
										var buscaNombre = _.where(configuracionCampos,{tkCampo:campoDecode.tkCampo})[0];
										var nombreCampo = (buscaNombre) ? (buscaNombre.nombreCampo) ? buscaNombre.nombreCampo : campoDecode.campo : campoDecode.campo;

										html += `
											<div id="select-${campoDecode.tkCampo}" class="form-group">
												<label class="SAUP190122labelPublic">${nombreCampo}</label>
												${self.construyeTipoCampo({
													campoDecode:campoDecode, 
													tkCampo:campoDecode.tkCampo, 
													objCamposConfig:objCamposConfig
												}) || ""}
											</div>
										`;
									}

								html += `
									</form>
									<button style="margin-top:20px;" ${(!obj.pre) ? 'id="SAUP190122-btnGuardarFormulario-'+idForm+'"' : ''} class="btn ${(radio) ? radio : 'btn-primary'}">${objConfig.btnNombre}</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			`;
		}

		return html;
	  
	};

	this.templateListaFormulario = function() {
	  var html = `
				<div class="container" id="ocultarCrearForm">
				  <blockquote class="blockquote text-center" style="margin-top:20px;">
					<h4 style="display:inline-block;"> Tus formularios</h4>
					<span onclick="SAUP190122principal.init({menu:'crearFormulario'})" class="pull-right btn btn-primary"><i class="fa fa-plus"></i> Agregar formulario</span>
				  </blockquote>
				  <table class="table table-striped table-bordered">
					<thead class="thead-dark">
					  <tr>
						<th class="text-center">Código único  </th>
						<th class="text-center">Nombre </th>
						<th class="text-center">Origen </th>
						<th class="text-center">Etiquetas </th>
						<th class="text-center">Estatus </th>
						<th class="text-center"></th>
					  </tr>
					</thead>
					<tbody id="tablaDatosEspera">
						<tr >
							<td colspan="6" class="text-center"><h5><b>Un momento por favor <i class="fa fa-spinner fa-pulse fa fa-fw"></i></b></h5></td>
						</tr>
					</tbody>
				  </table>
			  </div>
		  `;
	  return html;
	};
};
  