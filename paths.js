// Exports application directory paths

var path = require('path');
var paths = { };

paths.root                  = __dirname;

paths.app                   = path.join( paths.root, 'app' );
// paths.build                 = path.join( paths.root, 'build' );
// paths.common                = path.join( paths.root, 'app-common' );
// paths.nodeModules           = path.join( paths.root, 'node_modules' );
// paths.server                = path.join( paths.root, 'server' );

// paths.builtTiles            = path.join( paths.build, 'apps.json');

module.exports = paths;
