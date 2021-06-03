<?php

/**
 * La funcionalidad específica de administración del plugin.
 *
 * @link       http://salesup.com
 * @since      1.0.0
 *
 * @package    plugin_name
 * @subpackage plugin_name/admin
 */

/**
 * Define el nombre del plugin, la versión y dos métodos para
 * Encolar la hoja de estilos específica de administración y JavaScript.
 * 
 * @since      1.0.0
 * @package    salesup-forms
 * @subpackage salesup-forms/admin
 * @author     SalesUp! http://salesup.com
 * 
 * @property string $plugin_name
 * @property string $version
 */
class SAUP190122_Public {
    
    /**
	 * El identificador único de éste plugin
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name  El nombre o identificador único de éste plugin
	 */
    private $plugin_name;
    
    /**
	 * Versión actual del plugin
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version  La versión actual del plugin
	 */
    private $version;

     /**
     * conexion a la db
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $db  conexion a la db
     */
    private $db;
    
    /**
     * @param string $plugin_name nombre o identificador único de éste plugin.
     * @param string $version La versión actual del plugin.
     */
    public function __construct( $plugin_name, $version ) {
        
        $this->plugin_name  = $plugin_name;
        $this->version      = '1.0.14';     
        global $wpdb;
        $this->db = $wpdb;
    }
    
    /**
	 * Registra los archivos de hojas de estilos del área de administración
	 *
	 * @since    1.0.0
     * @access   public
	 */
    public function enqueue_styles() {
        
        /**
         * Una instancia de esta clase debe pasar a la función run()
         * definido en SAUP190122_Cargador como todos los ganchos se definen
         * en esa clase particular.
         *
         * El SAUP190122_Cargador creará la relación
         * entre los ganchos definidos y las funciones definidas en este
         * clase.
		 */
		//wp_enqueue_style( $this->plugin_name, SAUP190122_PLUGIN_DIR_URL . 'public/css/su-admin.css', array(), $this->version, 'all' );

         /*iziToast.min*/
        wp_enqueue_style( 'su_izitoast_css', SAUP190122_PLUGIN_DIR_URL . 'helpers/izitoast/css/iziToast.min.css', array(), $this->version, 'all' );
        
        wp_enqueue_style( 'su_jquery_ui_css', SAUP190122_PLUGIN_DIR_URL . 'helpers/jquery-ui-1.12.1/jquery-ui.min.css', array(), $this->version, 'all' );

    }
    
    /**
	 * Registra los archivos Javascript del área de administración
	 *
	 * @since    1.0.0
     * @access   public
	 */
    public function enqueue_scripts() {
        
        /**
         * Una instancia de esta clase debe pasar a la función run()
         * definido en SAUP190122_Cargador como todos los ganchos se definen
         * en esa clase particular.
         *
         * El SAUP190122_Cargador creará la relación
         * entre los ganchos definidos y las funciones definidas en este
         * clase.
		 */

        /*jquery*/ 
        wp_enqueue_script( 'jquery' );
        wp_enqueue_script( 'jquery-ui-sortable' );
        wp_enqueue_script( 'jquery-ui-datepicker' );
        wp_enqueue_script( 'jquery-ui-tooltip' );
        
        /*su_izitoast*/
        wp_enqueue_script( 'su_izitoast_js', SAUP190122_PLUGIN_DIR_URL . 'helpers/izitoast/js/iziToast.min.js', ['jquery'], $this->version, true );

        /*underscore*/
        wp_enqueue_script( 'su_underscore_js', SAUP190122_PLUGIN_DIR_URL . 'helpers/underscore/underscore.js', ['jquery'], $this->version, true );

         /*su-guarda-token.js*/
        wp_enqueue_script( 'su_funciones', SAUP190122_PLUGIN_DIR_URL . 'admin/js/su-funciones.js', ['jquery'], $this->version, true );      

         /*su-form-builder.js*/
        wp_enqueue_script( 'su_form_builder', SAUP190122_PLUGIN_DIR_URL . 'admin/js/su-form-builder.js', ['jquery'], $this->version, true );
        
        /*su-public.js*/
        wp_enqueue_script( 'su_public_funciones', SAUP190122_PLUGIN_DIR_URL . 'public/js/su-public.js', ['jquery'], $this->version, true );  
    }


    public function sudatos_shortcode_id($atts, $content = ''){
    
        $args = shortcode_atts([
            'id' => ''
        ], $atts);



        extract( $args, EXTR_OVERWRITE );
       
        if($id != ""){

            $sql_token = "SELECT * FROM " . SAUP190122_TABLE_TOKEN_INTEGRACION;
            $resultado_token = $this->db->get_results( $sql_token );


            $sql = $this->db->prepare("SELECT * FROM " . SAUP190122_TABLES_FORMULARIOS . " WHERE id_formulario = %d ", intval( sanitize_text_field($id) ) );
            $resultado = $this->db->get_results( $sql );

            if( $resultado[0]->id_formulario != '' ){
               
                $sql_campos = $this->db->prepare("SELECT * FROM " . SAUP190122_TABLE_CAMPOS . " WHERE id_formulario = %d ORDER BY orden", intval($resultado[0]->id_formulario) );
                
                $resultadoCampos = $this->db->get_results( $sql_campos );

                $tieneEstilos = 0;
                 
                foreach ($resultado[0] as $key => $value) {
                    if($key == 'configuracion'){
                        $buscaEstilosPersonalizado = json_decode(base64_decode($value));
                        foreach ($buscaEstilosPersonalizado as $key1 => $value1) {
                            if($key1=='estilosPersonalizados'){
                                if($value1==2){
                                    $tieneEstilos=2;
                                }else if($value1==1){
                                    $tieneEstilos=1;
                                }
                            }
                        }
                    }
                }

                $cabecera  = wp_json_encode($resultado);
                $cuerpo = wp_json_encode($resultadoCampos);
                $token = wp_json_encode($resultado_token);
                
                if($tieneEstilos == 1){
                    wp_enqueue_style( 'su_font_awesome_css', SAUP190122_PLUGIN_DIR_URL . 'helpers/font-awesome-4.7.0/css/font-awesome.min.css', array(), $this->version, 'all' );
                    wp_enqueue_style( 'su_bootstrap_admin_css', SAUP190122_PLUGIN_DIR_URL . 'helpers/bootstrap/css/bootstrap.min.css', array(), $this->version, 'all' );
                    wp_enqueue_script( 'su_popper_js', SAUP190122_PLUGIN_DIR_URL . 'helpers/bootstrap/popper.min.js', ['jquery'], $this->version, true );
                    wp_enqueue_script( 'su_bootstrap_admin_js', SAUP190122_PLUGIN_DIR_URL . 'helpers/bootstrap/js/bootstrap.min.js', ['jquery'], $this->version, true );
                }

                $cabecera  = wp_json_encode($resultado);
                $cuerpo = wp_json_encode($resultadoCampos);
                $token = wp_json_encode($resultado_token);

                if($tieneEstilos==0){
                    
                }

                $output = "
                    <script>
                        var $ = jQuery.noConflict();
                        
                        jQuery(document).ready(function(){
                            SAUP190122formBuilder.init({
                                token:$token,
                                cabecera:$cabecera,
                                cuerpo:$cuerpo,
                                public:true,
                                idForm:$id
                            });

                            jQuery('#SAUP190122-btnGuardarFormulario-$id').click(function(){
                                SAUP190122formBuilder.enviaFormulario({
                                    cabecera:$cabecera,
                                    token:$token,
                                    id:$id
                                });
                            });                            
                        });
                    </script>

                    <div id='mainPublic-$id'></div>

                ";

            }else{

                $output = "<h5>[No existe el ID #$id]</h5>";

            }

            return ($output);

        }
    }
    
}







