<?php
/**
 * Archivo del plugin 
 * Este archivo es leído por WordPress para generar la información del plugin
 * en el área de administración del complemento. Este archivo también incluye 
 * todas las dependencias utilizadas por el complemento, registra las funciones 
 * de activación y desactivación y define una función que inicia el complemento.
 *
 * @link                http://salesup.com
 * @since               1.0.0
 * @package             SalesUp!
 *
 * @wordpress-plugin
 * Plugin Name:         Formularios de contacto SalesUp!
 * Plugin URI:          https://www.salesup.com/crm-online/integracion-wordpress.shtml?utm_source=comunicacion-salesup&utm_medium=mail&utm_campaign=nuevas-funciones-2019-activos&utm_content=text-link-leer-mas-wordpress
 * Description:         Genera formularios de contacto con los campos de tu CRM y agrega más prospectos desde tu sitio web.
 * Version:             1.0.14
 * Author:              SalesUp!
 * Author URI:          http://salesup.com
 * License:             GPL2
 * License URI:         https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:         salesup
 * Domain Path:         /languages
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}
global $wpdb;
define( 'SAUP190122_REALPATH_BASENAME_PLUGIN', dirname( plugin_basename( __FILE__ ) ) . '/' );
define( 'SAUP190122_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ) );
define( 'SAUP190122_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) );

define( 'SAUP190122_TABLE_TOKEN_INTEGRACION', "{$wpdb->prefix}salesup_token_integracion" );
define( 'SAUP190122_TABLES_FORMULARIOS', "{$wpdb->prefix}salesup_formularios" );
define( 'SAUP190122_TABLE_CAMPOS', "{$wpdb->prefix}salesup_campos" );

/**
 * Código que se ejecuta en la activación del plugin
 */
function activate_salesup_forms() {
    require_once SAUP190122_PLUGIN_DIR_PATH . 'includes/class-su-activator.php';
	SAUP190122_Activator::activate();
}

/**
 * Código que se ejecuta en la desactivación del plugin
 */
function deactivate_salesup_forms() {
    require_once SAUP190122_PLUGIN_DIR_PATH . 'includes/class-su-deactivator.php';
	SAUP190122_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_salesup_forms' );
register_deactivation_hook( __FILE__, 'deactivate_salesup_forms' );

require_once SAUP190122_PLUGIN_DIR_PATH . 'includes/class-su-master.php';

function run_su_master() {
    $su_master = new SAUP190122_Master;
    $su_master->run();
}

run_su_master();