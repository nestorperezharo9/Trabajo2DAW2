<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wp' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '}UGo{O4=;tW5q^1;@qzpOoty(/nP(GQGVP!g~Rfz%A*DT.-EH7Bj:F2IsQlPOq*a' );
define( 'SECURE_AUTH_KEY',  'mr#0{bw9i|82_RT%%47`?cs{bJ(VD}I,`#.i8n{4i(#d{l;USCh=&@A9/IP5J.Y?' );
define( 'LOGGED_IN_KEY',    ',lRrY9_tM{.IBGpB~yDD=u40%# CfEhdz81HIh$:4*.jFw;smUDb9nfLMU_z@tnT' );
define( 'NONCE_KEY',        '6/xWptZETWu3<W~s{+,%udl?^@64)yzBB)o!^Z5Tvp*YVE;zi0B7 n9Zci5DZ- e' );
define( 'AUTH_SALT',        '[:bW@$.QnHr(Y3P)PcL,|{0Gv rx$*41z ,I=1KfoRr&5={vd?9f_(XbEF;4Qim ' );
define( 'SECURE_AUTH_SALT', 'U/),f,jaC,XB*|Iv%h,UtJrw%7FGiu2nkV-0w@&8jKiZ9Z_Eh-?CWMu09o(s&TlQ' );
define( 'LOGGED_IN_SALT',   'i*sJO6o/>d$n|0{.CuluiCUO0Ma=|jK@N(mf2r8<-d$tI:>MSOi]l:tK3^Q-:NZH' );
define( 'NONCE_SALT',       'L92{{`#~04/TUgi.u:Tl_mM`hss5:1m:n(TZd4AE6MJ7aX;b$djAxiLNqzjN{h.1' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
