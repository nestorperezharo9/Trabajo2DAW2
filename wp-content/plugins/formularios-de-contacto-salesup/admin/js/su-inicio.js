var _inicio = function(){
	var self = this;

	var $mainContener = jQuery("#suMainContent");

	this.init = function(obj){
		SAUP190122fn.loader()
		if(_.size(obj)>0){
			if(self[obj.menu]){
				localStorage.setItem('navegacion',obj.menu);
				var config = SAUP190122procesaToken.extract(localStorage.getItem('jsonIntegracion'));
				var dataParse =(typeof config.data == 'string') ? JSON.parse(config.data) : config.data;
				self[obj.menu](dataParse);
			}else{
				SAUP190122fn.loaderElimina()
				SAUP190122fn.msgError('404');
				self.noSeEncontro();
			}
			
		}else{
			SAUP190122fn.loaderElimina()
			SAUP190122fn.mensaje('error');
 		}
	}

	this.listaFormularios = function(obj){
		if(_.size(obj)==0){
			SAUP190122fn.mensaje('error');
 			return false;
		}

		$mainContener.html('');
		SAUP190122formBuilder.init({
			sesion:obj.sesion,
			token:obj.token,
			lista:true
		});
		SAUP190122fn.initTooltip();
	}

	this.statusIntegracion = function(obj){
		setTimeout(function(){
			SAUP190122fn.loaderElimina()
		},1000);
		if(_.size(obj)==0){
 			return false;
		}
		$mainContener.html('');
		$mainContener.html(self.templateStatusIntegracion());
		SAUP190122fn.initTooltip();
	}
	
	this.crearFormulario = function(obj){
		SAUP190122fn.loaderElimina();
		if(_.size(obj)==0){
 			return false;
		}
		$mainContener.html('');
		SAUP190122formBuilder.init({
			sesion:obj.sesion,
			token:obj.token
		});
	}

	this.noSeEncontro = function(){
		$mainContener.html(`
			<div class="jumbotron " style="margin-top:50px;">
			  <div class="container">
			    <h1 class="display-4 text-center">404</h1>
			    <p class="lead text-center">P&aacute;gina no dispobible.</p>
			  </div>
			</div>
		`);
	}

	this.templateStatusIntegracion = function(){
		var objTokenIntegracion = SAUP190122procesaToken.getToken();

		var status = (objTokenIntegracion.status == 1) ? '<span class="badge badge-success">Activo</span>' : '<span class="badge badge-warning">Inactivo</span>';

		var html = `
			<div class="container">
				<blockquote class="blockquote text-center" style="margin-top:100px;">
				  <h4> Estado de la integración</h4>
				</blockquote>
				<table class="table table-striped table-bordered" style="margin-top:50px;">
				  <thead class="thead-dark">
				    <tr>
				      <th class="text-center">Token</th>
				      <th class="text-center">Sesión</th>
				      <th class="text-center">Estatus</th>
				      <th class="text-center"></th>
				    </tr>
				  </thead>
				  <tbody>
		  			<tr>
		  			
		  				<td class="text-center">
		  					<span data-toggle="tooltip" data-placement="top" title="${objTokenIntegracion.token}" class="d-inline-block text-truncate" style="max-width: 150px;">
							   ${objTokenIntegracion.token}
							</span>
						</td> 
						<td data-toggle="tooltip" data-placement="top" title="${objTokenIntegracion.sesion}" class="text-center">
							<span class="d-inline-block text-truncate" style="max-width: 150px;">
							   ${objTokenIntegracion.sesion}
							</span>
						</td> 
						<td class="text-center"> ${status} </td> 
						<td class="text-center"> 
							<i onclick="SAUP190122principal.modificaIntegracion('${objTokenIntegracion.token}', ${objTokenIntegracion.id})" data-toggle="tooltip" data-placement="top" title="Modificar" class="Pointer fa fa-pencil-square fa-2x" aria-hidden="true"></i>

							<i onclick="SAUP190122principal.actualizaSesion('${objTokenIntegracion.token}', ${objTokenIntegracion.id})" data-toggle="tooltip" data-placement="top" title="Actualizar sesion" class="Pointer fa fa-refresh fa-2x" aria-hidden="true"></i>
						</td>

					 <tr>
				</tbody>
				</table>
			</div>

			<!-- Modal -->
			  <div class="modal fade" id="modalModifica" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
			      <div class="modal-dialog" role="document">
			        <div class="modal-content">
			          <div class="modal-header">
			            <h5 class="modal-title" id="exampleModalLabel">Actualizar integraci&oacute;n.</h5>
			            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			              <span aria-hidden="true">&times;</span>
			            </button>
			          </div>
			          <div class="modal-body">
			            <form>
			              <div class="form-group">
			                <label for="recipient-name" class="col-form-label">Token:</label>
			                <input type="text" class="form-control obligatorio" id="suToken" value="${objTokenIntegracion.token}">
			                <div class="invalid-feedback">
		                       El token obligatorio!
		                    </div>
			              </div>
			            </form>
			          </div>
			          <div class="modal-footer">
			            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
			            <button type="button" id="btnActualizaIntegracion" class="btn btn-primary" onclick="SAUP190122principal.guardaIntegracion(${objTokenIntegracion.id})">Guardar</button>
			          </div>
			        </div>
			      </div>
			    </div><!-- Modal -->
		`;

		return html;
	}

	this.modificaIntegracion = function(tk){
		var objTokenIntegracion = (tk) ? tk : SAUP190122procesaToken.getToken();
		//jQuery("#suToken").val(objTokenIntegracion.token);
		jQuery('#modalModifica').modal({backdrop: 'static', keyboard: false}).modal('show');
		jQuery(".obligatorio").removeClass('is-invalid');
	}

	this.guardaIntegracion = function(id){
		jQuery("#btnActualizaIntegracion").attr('disabled',true);
		SAUP190122fn.loader();
		var idIntegracion = id;
		var suToken = jQuery('#suToken').val().trim();
		var sesion = SAUP190122procesaToken.pideTokenSesion({token:suToken});
		if(SAUP190122fn.validaObligatorio() && sesion!='error'){
			var procesaGuardado = function(res, err){
				if(err != 'success' && err){
					SAUP190122fn.loaderElimina();
					SAUP190122fn.mensaje('error');
					jQuery("#btnActualizaIntegracion").attr('disabled',false);
 					return false;
				}

				if(res == 1 || res == 0){
					jQuery('#modalModifica').modal('toggle');
					SAUP190122fn.loaderElimina();
					SAUP190122fn.msgSuccess('Se actualizo correctamente.');
					setTimeout(function(){
 						SAUP190122principal.init({menu:'statusIntegracion'})
					},300);
					

				}else{
					SAUP190122fn.loaderElimina();
					SAUP190122fn.mensaje('error');
					jQuery("#btnActualizaIntegracion").attr('disabled',false);
 					return false;
				}
				
			}

			SAUP190122fn.peticionAjax({
	            url:salesup.url,
	            method:'POST',
	            dataType:'json',
	            data:{
	                action:'su_crud_put',
	                nonce:salesup.seguridad,
	                token:suToken,
	                status:1,
	                id:idIntegracion,
	                sesion:sesion.trim(),
	                tipo:'update'
	            },
	            callback:procesaGuardado
	        })		
		}else{
			SAUP190122fn.loaderElimina();
			jQuery("#btnActualizaIntegracion").attr('disabled',false);
		}
	}

	this.actualizaSesion = function(tk,id){
		SAUP190122fn.loader();
		SAUP190122procesaToken.pideTokenSesion({token:tk,id:id});
		setTimeout(function(){
			SAUP190122fn.loaderElimina();
			SAUP190122fn.msgSuccess('Se actualizo la sesion.');
		},500);
	}
}