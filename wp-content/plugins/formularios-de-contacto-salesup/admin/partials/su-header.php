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

?>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
    <a class="navbar-brand" href="#"><img src="<?=SAUP190122_PLUGIN_DIR_URL?>/admin/img/LogoSU.png" width="30" height="30" alt=""></a>
    <ul class="nav navbar-nav ml-auto">
		<li class="nav-item">
			<a class="nav-link Pointer" onclick="SAUP190122principal.init({menu:'statusIntegracion'})">Estatus de Token </a>
		</li>
		<li class="nav-item">
			<a class="nav-link Pointer" onclick="SAUP190122principal.init({menu:'listaFormularios'})" >Formularios</a>
		</li>
    </ul>
  </div>
</nav>