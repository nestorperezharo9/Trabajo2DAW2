<?php

/**
 * Registrar todas las acciones y filtros para el complemento
 *
 * @link       http://salesup.com
 * @since      1.0.0
 *
 * @package    salesup-forms
 * @subpackage salesup-forms/includes
 */

/**
 * Registrar todas las acciones y filtros para el plugin
 * 
 * Mantener una lista de todos los ganchos que están registrados
 * en todo el plugin, y registrarlos con la API de WordPress. 
 * Llame a la función run para ejecutar la lista de acciones y filtros.
 *
 * @since      1.0.0
 * @package    salesup-forms
 * @subpackage salesup-forms/includes
 * @author     SalesUp! http://salesup.com
 * 
 * @property array $actions
 * @property array $filters
 */
class SAUP190122_Cargador {
    
    /**
	 * El array de acciones registradas en WordPress.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      array    $actions    Las acciones registradas en WordPress para ejecutar cuando se carga el plugin.
	 */
    protected $actions;
    
    /**
	 * El array de filtros registrados en WordPress.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      array    $actions    Las filtros registrados en WordPress para ejecutar cuando se carga el plugin.
	 */
    protected $filters;

    /**
	 * El array de shortcodes registrados en WordPress.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      array    $shortcodes    Los shortcodes registrados en WordPress para ejecutar cuando se carga el plugin.
	 */
    protected $shortcodes;
    
    /**
     * Constructor
     * 
	 * Inicializar las propiedades utilizadas para mantener las acciones y los filtros.
	 *
	 * @since    1.0.0
	 */
    public function __construct() {
        
        $this->actions   = [];
        $this->filters   = [];
        $this->shortcodes = [];
    }
    
    /**
	 * Añade una acción nueva al array ($this->actions) a iterar para registrarla en WordPress.
	 *
	 * @since    1.0.0
     * @access   public
     * 
	 * @param    string    $hook             El nombre de la acción de WordPress que se está registrando.
	 * @param    object    $component        Una referencia a la instancia del objeto en el que se define la acción.
	 * @param    string    $callback         El nombre de la definición del método/función en el $component.
	 * @param    int       $priority         Opcional. La prioridad en la que se debe ejecutar la función callback. El valor predeterminado es 10.
	 * @param    int       $accepted_args    Opcional. El número de argumentos que se deben pasar en el $callback. El valor predeterminado es 1.
	 */
    public function add_action( $hook, $component, $callback, $priority = 10, $accepted_args = 1 ) {
        
        $this->actions = $this->add( $this->actions, $hook, $component, $callback, $priority, $accepted_args );
        
    }
    
    /**
	 * Añade un filtro nueva al array ($this->filter) a iterar para registrarla en WordPress.
	 *
	 * @since    1.0.0
     * @access   public
     * 
	 * @param    string    $hook             El nombre del filtro de WordPress que se está registrando.
	 * @param    object    $component        Una referencia a la instancia del objeto en el que se define el filtro.
	 * @param    string    $callback         El nombre de la definición del método/función en el $component.
	 * @param    int       $priority         Opcional. La prioridad en la que se debe ejecutar la función callback. El valor predeterminado es 10.
	 * @param    int       $accepted_args    Opcional. El número de argumentos que se deben pasar en el $callback. El valor predeterminado es 1.
	 */
    public function add_filter( $hook, $component, $callback, $priority = 10, $accepted_args = 1 ) {
        
        $this->filters = $this->add( $this->filters, $hook, $component, $callback, $priority, $accepted_args );
        
    }
    
    /**
	 * Función de utilidad que se utiliza para registrar las acciones y los ganchos en una sola iterada.
	 *
	 * @since    1.0.0
	 * @access   private
     * 
	 * @param    array     $hooks            La colección de ganchos que se está registrando (es decir, acciones o filtros).
	 * @param    string    $hook             El nombre del filtro de WordPress que se está registrando.
	 * @param    object    $component        Una referencia a la instancia del objeto en el que se define el filtro.
	 * @param    string    $callback         El nombre de la definición del método/función en el $component.
	 * @param    int       $priority         La prioridad en la que se debe ejecutar la función.
	 * @param    int       $accepted_args    El número de argumentos que se deben pasar en el $callback.
     * 
	 * @return   array                       La colección de acciones y filtros registrados en WordPress para proceder a iterar.
	 */
    private function add( $hooks, $hook, $component, $callback, $priority, $accepted_args ) {
        
        $hooks[] = [
            'hook'          => $hook,
            'component'     => $component,
            'callback'      => $callback,
            'priority'      => $priority,
            'accepted_args' => $accepted_args
        ];
        
        return $hooks;
        
    }




     /**
	 * Añade un shortcode nuevo al array ($this->filter) a iterar para registrarla en WordPress.
	 *
	 * @since    1.0.0
     * @access   public
     * 
	 * @param    string    $tag             El nombre del shoertcode de WordPress que se está registrando.
	 * @param    object    $component        Una referencia a la instancia del objeto en el que se define el filtro.
	 * @param    string    $callback         El nombre de la definición del método/función en el $component.
	 */
    public function add_shortcode( $tag, $component, $callback ) {
        
        $this->shortcodes = $this->add_s( $this->shortcodes, $tag, $component, $callback );
        
    }
    
    /**
	 * Función de utilidad que se utiliza para registrar las acciones y los ganchos en una sola iterada.
	 *
	 * @since    1.0.0
	 * @access   private
     * 
	 * @param    array     $hooks            La colección de ganchos que se está registrando (es decir, acciones o filtros).
	 * @param    string    $hook             El nombre del filtro de WordPress que se está registrando.
	 * @param    object    $component        Una referencia a la instancia del objeto en el que se define el filtro.
	 * @param    string    $callback         El nombre de la definición del método/función en el $component.
	 * @param    int       $priority         La prioridad en la que se debe ejecutar la función.
	 * @param    int       $accepted_args    El número de argumentos que se deben pasar en el $callback.
     * 
	 * @return   array                       La colección de acciones y filtros registrados en WordPress para proceder a iterar.
	 */
    private function add_s( $shortcodes, $tag, $component, $callback ) {
        
        $shortcodes[] = [
            'tag'          => $tag,
            'component'     => $component,
            'callback'      => $callback
        ];
        
        return $shortcodes ;
        
    }



    
    /**
	 * Registre los filtros y acciones con WordPress.
	 *
	 * @since    1.0.0
     * @access   public
	 */
    public function run() {
        
        foreach( $this->actions as $hook_u ) {
            
            extract( $hook_u, EXTR_OVERWRITE );
            
            add_action( $hook, [ $component, $callback ], $priority, $accepted_args );
            
        }
        
        foreach( $this->filters as $hook_u ) {
            
            extract( $hook_u, EXTR_OVERWRITE );
            
            add_filter( $hook, [ $component, $callback ], $priority, $accepted_args );
            
        }

        foreach( $this->shortcodes as $shortcode ) {
            
            extract( $shortcode, EXTR_OVERWRITE );

            add_shortcode( $tag, [ $component, $callback ] );
            
        }
        
    }
    
}









