<?php

/**
 * Define la funcionalidad de internacionalización
 *
 * Carga y define los archivos de internacionalización de este plugin para que esté listo para su traducción.
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
class SAUP190122_i18n {
    
    /**
	 * Carga el dominio de texto (textdomain) del plugin para la traducción.
	 *
     * @since    1.0.0
     * @access public static
	 */    
    public function load_plugin_textdomain() {
        
        load_plugin_textdomain(
            'SAUP190122-textdomain',
            false,
            SAUP190122_PLUGIN_DIR_PATH . 'languages'
        );
        
    }
    
}