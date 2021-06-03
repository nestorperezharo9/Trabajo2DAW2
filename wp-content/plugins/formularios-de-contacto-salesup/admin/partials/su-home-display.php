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

if( isset($_GET['jsondata']) ){
    $json = $_GET['jsondata'];
}else{
    $json = '';
}

/* Este archivo debe consistir principalmente en HTML con un poco de PHP. */
require_once SAUP190122_PLUGIN_DIR_PATH.'admin/partials/su-header.php';

?>

<div class="container" id="suMainContent"></div>

<script>
    var $ = jQuery.noConflict();;
    jQuery(document).ready(function(){ 
        localStorage.setItem('jsonIntegracion', '<?=$json?>');
        var navegacion = (localStorage.getItem('navegacion')) ? localStorage.getItem('navegacion') : 'statusIntegracion';
        SAUP190122principal.init({menu:navegacion});
    });
</script>



