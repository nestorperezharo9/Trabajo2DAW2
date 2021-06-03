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
class SAUP190122_Ajax {
    
    /**
	 * Método constructor
	 *
	 * Se ejecuta cuando se instancia la clase
	 *
	 * @since    1.0.0
     * access public
	 */    
    public function __construct() {
        
        // Algún código a ejecutar en la instancia del objeto
        
    }
    
    /**
	 * Método para interactuar con el archivo Javascript
	 *
	 * Se usa para interactuar con un archivo específico
     * de javascript con el método AJAX
	 *
	 * @since    1.0.0
     * @access public
	 */ 
    public function peticiones() {
        
        // Checkea el código generado por wp_create_nonce()
        // y pasado al archivo javascript
        check_ajax_referer( 'codigo_seguridad', 'clave_nonce' );
            
        echo json_encode( $json );
        wp_die();
    }
    
}