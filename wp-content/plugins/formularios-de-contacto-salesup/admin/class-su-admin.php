<?php
/**
 * La funcionalidad específica de administración del plugin.
 *
 * @link       http://salesup.com
 * @since      1.0.0
 *
 * @package    salesup-forms
 * @subpackage salesup-forms/admin
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
class SAUP190122_Admin {
    
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
	 * Versión actual del plugin
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      object    $build_menupage  instalacion del menu
	 */
    private $build_menupage;
    
    /**
     * @param string $plugin_name nombre o identificador único de éste plugin.
     * @param string $version La versión actual del plugin.
     */
    public function __construct( $plugin_name, $version ) {
        
        $this->plugin_name = $plugin_name;
        $this->version = '1.0.14';     
        $this->build_menupage = new SAUP190122_Build_Menupage();
        global $wpdb;
        $this->db = $wpdb;
        
    }
    
    /**
	 * Registra los archivos de hojas de estilos del área de administración
	 *
	 * @since    1.0.0
     * @access   public
	 */
    public function enqueue_styles($hook) {
        
        /**
         * Una instancia de esta clase debe pasar a la función run()
         * definido en SAUP190122_Cargador como todos los ganchos se definen
         * en esa clase particular.
         *
         * El SAUP190122_Cargador creará la relación
         * entre los ganchos definidos y las funciones definidas en este
         * clase.
		 */

        /* estilos salesup general */
        wp_enqueue_style( 'su_salesup_css', SAUP190122_PLUGIN_DIR_URL . 'admin/css/su-salesup.css', array(), $this->version, 'all' );

        if($hook != 'toplevel_page_salesup'){
            return;
        }

        /* font-awesome */
        wp_enqueue_style( 'su_font_awesome_css', SAUP190122_PLUGIN_DIR_URL . 'helpers/font-awesome-4.7.0/css/font-awesome.min.css', array(), $this->version, 'all' );

        /* Bootstrap 4 css */
        wp_enqueue_style( 'su_bootstrap_admin_css', SAUP190122_PLUGIN_DIR_URL . 'helpers/bootstrap/css/bootstrap.min.css', array(), $this->version, 'all' );

        /*iziToast.min*/
        wp_enqueue_style( 'su_izitoast_css', SAUP190122_PLUGIN_DIR_URL . 'helpers/izitoast/css/iziToast.min.css', array(), $this->version, 'all' );
        
         /* jQuery ui */ 
         wp_enqueue_style( 'su_jquery_ui_css', SAUP190122_PLUGIN_DIR_URL . 'helpers/jquery-ui-1.12.1/jquery-ui.min.css', array(), $this->version, 'all' );

        /* estilos salesup admin */
        wp_enqueue_style( $this->plugin_name, SAUP190122_PLUGIN_DIR_URL . 'admin/css/su-admin.css', array(), $this->version, 'all' );
        
    }
    
    /**
	 * Registra los archivos Javascript del área de administración
	 *
	 * @since    1.0.0
     * @access   public
	 */
    public function enqueue_scripts($hook) {
        
        /**
         * Una instancia de esta clase debe pasar a la función run()
         * definido en SAUP190122_Cargador como todos los ganchos se definen
         * en esa clase particular.
         *
         * El SAUP190122_Cargador creará la relación
         * entre los ganchos definidos y las funciones definidas en este
         * clase.
		 */

         /*
         *Condicion para cargar solo los archivos cuando sea la pagina del plugin
         */
        if($hook != 'toplevel_page_salesup'){
            return;
        }

         /*jquery*/ 
         wp_enqueue_script( 'jquery' );
         wp_enqueue_script( 'jquery-ui-sortable' );
         wp_enqueue_script( 'jquery-ui-datepicker' );
        
        /*popper*/
        wp_enqueue_script( 'su_popper_js', SAUP190122_PLUGIN_DIR_URL . 'helpers/bootstrap/popper.min.js', ['jquery'], $this->version, true );
        
        /*bootstrap_admin */
        wp_enqueue_script( 'su_bootstrap_admin_js', SAUP190122_PLUGIN_DIR_URL . 'helpers/bootstrap/js/bootstrap.min.js', ['jquery'], $this->version, true );

        /*izitoast*/
        wp_enqueue_script( 'su_izitoast_js', SAUP190122_PLUGIN_DIR_URL . 'helpers/izitoast/js/iziToast.min.js', ['jquery'], $this->version, true );

        /*underscore*/
        wp_enqueue_script( 'su_underscore_js', SAUP190122_PLUGIN_DIR_URL . 'helpers/underscore/underscore.js', ['jquery'], $this->version, true );

        /*su-guarda-token.js*/
        wp_enqueue_script( 'su_funciones', SAUP190122_PLUGIN_DIR_URL . 'admin/js/su-funciones.js', ['jquery'], $this->version, true );        
        
        /*su-template.js*/
        wp_enqueue_script( 'su_template', SAUP190122_PLUGIN_DIR_URL . 'admin/js/su-template.js', ['jquery'], $this->version, true );

        /*su-form-builder.js*/
        wp_enqueue_script( 'su_form_builder', SAUP190122_PLUGIN_DIR_URL . 'admin/js/su-form-builder.js', ['jquery'], $this->version, true );

        /*su-procesa-token.js*/
        wp_enqueue_script( 'su_procesa_token', SAUP190122_PLUGIN_DIR_URL . 'admin/js/su-procesa-token.js', ['jquery'], $this->version, true );

        /*su_inicia_menu.js*/
        wp_enqueue_script( 'su_inicia_menu', SAUP190122_PLUGIN_DIR_URL . 'admin/js/su-inicio.js', ['jquery'], $this->version, true );

        /*admin js*/
        wp_enqueue_script( $this->plugin_name, SAUP190122_PLUGIN_DIR_URL . 'admin/js/su-admin.js', ['jquery'], $this->version, true );
       
        /**
         * interacion con petecion ajax
        */

        wp_localize_script(
            $this->plugin_name, 
            'salesup',
            [
                'url' => admin_url('admin-ajax.php'),
                'seguridad' => wp_create_nonce('salesup_seg'),

            ]
        );   
    }

    /**
	 * Agrega el menu 
	 *
	 * @since    1.0.0
     * @access   public
	 */
    public function add_menu(){
        $this->build_menupage->add_menu_page(
             __('SalesUp!','salesup'),
             __('SalesUp!','salesup'),
             'manage_options',
             'salesup',
             [$this, 'controlador_display_menu'],
             plugin_dir_url(__FILE__) . 'img/LogoSU.png',
             22
        );
        
        $this->build_menupage->run();
    }

    /**
     * Sanitiza data
     */

    function sanitizeDataConfig($conf){
        $decodeConfiguracion = base64_decode($conf);                
        $dataValidation = json_decode(utf8_encode($decodeConfiguracion),true);

        foreach ($dataValidation as $key => $value) {
            if($key == 'configuracionEstilos'){
                $dataEstilos = json_decode(($value),true);
                foreach ($dataEstilos as $key2 => $value2) {
                    foreach($value2 as $key3 => $value3){
                        $value2[$key3] = sanitize_text_field(($value3));
                        }
                }
            }else if($key == 'configuracionCampos'){
                $dataCampos = json_decode(($value),true);
                foreach ($dataCampos as $key4 => $value4) {
                    foreach($value4 as $key5 => $value5){
                        $value4[$key5] = sanitize_text_field(($value5));
                        }
                }
            }else{
                $dataValidation[$key] = sanitize_text_field(($dataValidation[$key]));
                }
        }

        $conf = base64_encode(wp_json_encode($dataValidation));

        return $conf;
    }

    public function controlador_display_menu(){
        $sql_verifica   = "SELECT id FROM " . SAUP190122_TABLE_TOKEN_INTEGRACION;
        $result         = $this->db->get_results($sql_verifica);
        $count          = 0;

        foreach($result as $k => $v){
            if(isset($v->id)){
                $count++;
            }
        }

        if( $count > 0 ){
            require_once SAUP190122_PLUGIN_DIR_PATH.'admin/partials/su-home-display.php';
        }else{
            require_once SAUP190122_PLUGIN_DIR_PATH.'admin/partials/su-admin-display.php';
        }  
    }

    /**
     * Preparamos el insertado del token
     */

    public function ajax_crud_post(){
        check_ajax_referer('salesup_seg', 'nonce');
        if(current_user_can('manage_options')){
            
            extract($_POST, EXTR_OVERWRITE);
            
            if($tipo == 'add'){
                $columns = [
                    'token'=> sanitize_text_field($token),
                    'status' => sanitize_text_field($status),
                    'sesion' => sanitize_text_field($sesion)
                ];

                $result = $this->db->insert(SAUP190122_TABLE_TOKEN_INTEGRACION, $columns); 

                $json = wp_json_encode([
                    'result' => $result,
                    'token'=> $token,
                    'status' => $status,
                    'sesion' => $sesion
                ]);   
                echo wp_send_json($json);            
            }else if($tipo == 'add_form'){   
                $countFail = 0;  
                $configuracion = $this->sanitizeDataConfig($configuracion);
                
                $columns = [
                    'nombre_formulario'=> sanitize_text_field($nombreFormulario),
                    'tk_origen' => sanitize_text_field($origenData),
                    'tk_etiqueta1' => sanitize_text_field($etiqueta1),
                    'tk_etiqueta2' => sanitize_text_field($etiqueta2),
                    'tk_etiqueta3' => sanitize_text_field($etiqueta3),
                    'configuracion' => $configuracion,
                    'status' => 1
                ];
               
                $result = $this->db->insert(SAUP190122_TABLES_FORMULARIOS, $columns);
                $ultimo_id = $this->db->insert_id;
                if($result != 1 ){
                    $countFail++;
                }

                for($x = 0; $x < count($formulario); $x++){
                   /*$decodeData = base64_decode($formulario[$x]);
                    $dataSanitize = json_decode(utf8_encode($decodeData),true);
                    foreach ($dataSanitize as $key => $value) {
                        if(gettype($dataSanitize[$key])!="array"){
                            $dataSanitize[$key] =  sanitize_text_field( $dataSanitize[$key] );
                        }
                    }
                   
                   $formulario[$x] = base64_encode(wp_json_encode($dataSanitize));*/
        
                    $columnsCampos = [
                        'id_formulario' => $ultimo_id,
                        'orden'         => $x+1,
                        'campo'         => $formulario[$x]
                    ];
                    
                    $resultCampos = $this->db->insert(SAUP190122_TABLE_CAMPOS, $columnsCampos);
                    
                    if($resultCampos != 1){
                        $countFail++;
                    }
                }

                if($countFail == 0){
                    echo 1;
                }else{
                    echo 'error';
                }
            }
            wp_die();
        }        
    }

    public function ajax_crud_get(){
        check_ajax_referer('salesup_seg', 'nonce');
        if(current_user_can('manage_options')){

            extract($_GET, EXTR_OVERWRITE);
            
            if($tipo == 'get'){
                $sql_verifica   = "SELECT * FROM " . SAUP190122_TABLE_TOKEN_INTEGRACION;
                $result         = $this->db->get_results($sql_verifica);
                $json = wp_json_encode($result);   

                echo $json;
            }else if($tipo == 'get_lista_forms'){
                $sql_lista_forms   = "SELECT * FROM " . SAUP190122_TABLES_FORMULARIOS;
                $result         = $this->db->get_results($sql_lista_forms);
                $json = wp_json_encode($result);   

                echo $json;
            }else if($tipo == 'get_form'){
                if($id_formulario != ""){        
                    $sql = $this->db->prepare("SELECT * FROM " . SAUP190122_TABLES_FORMULARIOS . " WHERE id_formulario = %d ", intval(sanitize_text_field($id_formulario)) );
                    $resultado = $this->db->get_results( $sql );
        
                    if( $resultado[0]->id_formulario != '' ){
                       
                        $sql_campos = $this->db->prepare("SELECT * FROM " . SAUP190122_TABLE_CAMPOS . " WHERE id_formulario = %d ORDER BY orden", intval($resultado[0]->id_formulario) );
                        
                        $resultadoCampos = $this->db->get_results( $sql_campos );

                        if($resultadoCampos!=""){
                            $cabecera  = wp_json_encode($resultado);
                            $cuerpo = wp_json_encode($resultadoCampos);

                            $json = [
                                'cuerpo' => $cuerpo,
                                'cabecera' => $cabecera 
                            ];

                            echo wp_json_encode($json);

                        }else{
                            echo 'erroCampos';
                        }                        
                    }else{
                        echo 'errorIdForm';
                    }
                }else{
                    echo 'errorIdForm';
                }             
            }
            wp_die();
        }
    }

    public function ajax_crud_put(){
        check_ajax_referer('salesup_seg', 'nonce');
        if(current_user_can('manage_options')){
            extract($_POST, EXTR_OVERWRITE);
            
            $countFail = 0;
            
            if($tipo == 'update_sesion'){
                $result = $this->db->query( 
                    $this->db->prepare('UPDATE ' .SAUP190122_TABLE_TOKEN_INTEGRACION . ' SET sesion = %s WHERE id = %d', 
                    sanitize_text_field($sesion), 
                    sanitize_text_field($id) 
                    ) 
                );
            }else if($tipo == 'update'){
                $result = $this->db->query($this->db->prepare('UPDATE ' .SAUP190122_TABLE_TOKEN_INTEGRACION . ' SET token = %s, sesion = %s, status = %d WHERE id = %d', 
                sanitize_text_field($token), 
                sanitize_text_field($sesion), 
                sanitize_text_field($status), 
                sanitize_text_field($id) 
                    ) 
                );
            }else if($tipo == 'update_form'){
                
                $configuracion = $this->sanitizeDataConfig($configuracion);
                
                $result = $this->db->query($this->db->prepare('UPDATE ' .SAUP190122_TABLES_FORMULARIOS . ' SET nombre_formulario = %s,tk_origen = %s,  tk_etiqueta1 = %s, tk_etiqueta2 = %s,tk_etiqueta3 = %s, configuracion = %s WHERE id_formulario = %d', 
                sanitize_text_field($nombreFormulario), 
                sanitize_text_field($origenData), 
                sanitize_text_field($etiqueta1), 
                sanitize_text_field($etiqueta2), 
                sanitize_text_field($etiqueta3), 
                $configuracion, 
                sanitize_text_field($id_formulario)));

                $resultDelete = $this->db->delete( SAUP190122_TABLE_CAMPOS, array( 'id_formulario' => sanitize_text_field($id_formulario) ) );
                
                for($x = 0; $x < count($formulario); $x++){
                    $decodeData = base64_decode($formulario[$x]);
                    $dataSanitize = json_decode(utf8_encode($decodeData),true);
                    foreach ($dataSanitize as $key => $value) {
                        $dataSanitize[$key] =  sanitize_text_field( $dataSanitize[$key] );
                    }
                   
                   $formulario[$x] = base64_encode(wp_json_encode($dataSanitize));

                    $columnsCampos = [
                        'id_formulario' => sanitize_text_field($id_formulario),
                        'orden'         => $x+1,
                        'campo'         => $formulario[$x]
                    ];
                    
                    $resultCampos = $this->db->insert(SAUP190122_TABLE_CAMPOS, $columnsCampos);
                    
                    if($resultCampos != 1){
                        $countFail++;
                    }
                }
            }
            
            if($countFail == 0){
                echo 1;
            }else{
                echo 'error';
            }

            wp_die();
        }
    }

    public function ajax_crud_delete(){
        
        check_ajax_referer('salesup_seg', 'nonce');
        
        if(current_user_can('manage_options')){
            
            extract($_POST, EXTR_OVERWRITE);
        
            if($tipo=='delete_form'){
                $resultDeleteForm = $this->db->delete( SAUP190122_TABLES_FORMULARIOS, array( 'id_formulario' => intval(sanitize_text_field($id_formulario)) ) );
                $resultDeleteCampos = $this->db->delete( SAUP190122_TABLE_CAMPOS, array( 'id_formulario' => intval(sanitize_text_field($id_formulario)) ) );
            } 
            echo $resultDeleteForm;
            wp_die();
        }
    }
}







