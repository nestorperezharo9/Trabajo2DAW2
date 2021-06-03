<?php

/**
  * Proporcionar una vista de área de administración para el plugin
  *
  * Este archivo se utiliza para marcar los aspectos de administración del plugin.
  *
  * @link http://salesup.com
  * @since desde 1.0.0
  *
  * @package salesup-forms
  * @subpackage salesup-forms/admin/parcials
  */

/* Este archivo debe consistir principalmente en HTML con un poco de PHP. */
require_once SAUP190122_PLUGIN_DIR_PATH.'admin/partials/su-header.php';
?>

<div class="container">
    <div class="row justify-content-md-center contenedorTop">
        <div class="card text-center col-md-7">
            <div class="card-header">
                <img src="<?=SAUP190122_PLUGIN_DIR_URL?>/admin/img/LogoSU.png">
                <h5 class="card-title">Antes de comenzar a crear formularios, necesitas conectarte a tu cuenta de SalesUp!</h5>
            </div>
            <div class="card-body">                
                <div class="form-group">
                    <label class="pull-left"  for="token_integracion">
                        Inserta el Token de integración en el siguiente campo para conectar tu sitio con SalesUp!
                    </label>
                    <input type="text" class="form-control obligatorio" placeholder="Token de integración" id="token_integracion">
                    <div class="invalid-feedback">
                       El token de integracion es obligatorio!
                    </div>
                </div>
                <button type="button" onclick="SAUP190122procesaToken.procesaToken(this)" class="btn btn-primary" id="SAUP190122btnGuardaToken" >Conectar cuentas </button>
            </div>
            <div class="card-footer text-muted">
                ¿A&uacute;n no tienes tu token de integraci&oacute;n? <a href="https://www.salesup.com/login/" target="_blank">Obt&eacute;nlo aqu&iacute;</a>
            </div>
        </div>
    </div>
</div>

