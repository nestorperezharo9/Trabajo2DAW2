<?php

/**
 * Se activa en la activación del plugin
 *
 * @link       http://salesup.com
 * @since      1.0.0
 *
 * @package    salesup-forms
 * @subpackage salesup-forms/includes
 */

/**
 * Ésta clase define todo lo necesario durante la activación del plugin
 *
 * @since      1.0.0
 * @package    salesup-forms
 * @subpackage salesup-forms/includes
 * @author     SalesUp! http://salesup.com
 */
class SAUP190122_Activator {

	/**
	 * Método estático que se ejecuta al activar el plugin
	 *
	 * Creación de la tabla {$wpdb->prefix}beziercode_data
     * para guardar toda la información necesaria
	 *
	 * @since 1.0.0
     * @access public static
	 */
	public static function activate() {
		global $wpdb;
		
		$sql_token = "CREATE TABLE IF NOT EXISTS " . SAUP190122_TABLE_TOKEN_INTEGRACION . " (
			id INT (11) NOT NULL AUTO_INCREMENT,
			token VARCHAR(250) 	NOT NULL,
			sesion VARCHAR(250) NOT NULL,
			status int (2) NOT NULL,
			PRIMARY KEY (id)
		);";
		$wpdb->query( $sql_token );

		$sql_formulario = "CREATE TABLE IF NOT EXISTS " . SAUP190122_TABLES_FORMULARIOS . " (
			id_formulario INT (11) NOT NULL AUTO_INCREMENT,
			nombre_formulario VARCHAR(200),
			fecha_creacion DATE,
			tk_origen VARCHAR(100),
			tk_etiqueta1 VARCHAR(100),
			tk_etiqueta2 VARCHAR(100),
			tk_etiqueta3 VARCHAR(100),
			configuracion TEXT,
			status int (2),
			PRIMARY KEY (id_formulario)
		);";
		$wpdb->query( $sql_formulario );

		$sql_campos = "CREATE TABLE IF NOT EXISTS " . SAUP190122_TABLE_CAMPOS . " (
			id_campo INT (11) NOT NULL AUTO_INCREMENT,
			id_formulario INT NOT NULL,
			orden INT (11),
			campo TEXT,
			PRIMARY KEY (id_campo)
		);";

		$wpdb->query( $sql_campos );
        
	}

}





