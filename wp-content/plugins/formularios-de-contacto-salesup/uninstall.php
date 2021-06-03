<?php

/**
 * Se activa cuando el plugin va a ser desinstalado
 *
 * @link       http://salesup.com
 * @since      1.0.0
 *
 * @package    Beziercode_Blank
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/*
 * Agregar todo el código necesario
 * para eliminar ( como las bases de datos, limpiar caché,
 * limpiar enlaces permanentes, etc. ) en la desinstalación
 * del plugin
 */

 global $wpdb;

 $sql_token ="DROP TABLE IF EXISTS {$wpdb->prefix}salesup_token_integracion";
 $wpdb->query( $sql_token );

 $sql_formularios ="DROP TABLE IF EXISTS {$wpdb->prefix}salesup_formularios";
 $wpdb->query( $sql_formularios );

 $sql_campos ="DROP TABLE IF EXISTS {$wpdb->prefix}salesup_campos";
 $wpdb->query( $sql_campos );


