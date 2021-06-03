<?php

/**
 * Se activa en la desactivación del plugin
 *
 * @link       http://salesup.com
 * @since      1.0.0
 *
 * @package    salesup-forms
 * @subpackage salesup-forms/includes
 */

/**
 * Ésta clase define todo lo necesario durante la desactivación del plugin
 *
 * @since      1.0.0
 * @package    salesup-forms
 * @subpackage salesup-forms/includes
 * @author     SalesUp! http://salesup.com
 */

class SAUP190122_Deactivator {

	/**
	 * Método estático
	 *
	 * Método que se ejecuta al desactivar el plugin
	 *
	 * @since 1.0.0
     * @access public static
	 */
	public static function deactivate() {
        
        flush_rewrite_rules();
        
	}

}