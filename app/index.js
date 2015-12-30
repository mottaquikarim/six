var Generator = require('./generator');
var program = require('commander');
var FileOps = require('./fileops');
var path = require('path');
var CONSTS = {
    'base': path.join( __dirname, '..' ),
    'config': 'config.json',
    'up': '..'
};
var Q = require('q');

program
  .version('0.0.1')
  .option('-t, --theme [themename]', 'choose a theme [default]', 'default')
  .option('-o, --output [output]', 'choose output path [output]', 'output')
  .parse(process.argv);

var config = path.join( CONSTS.base, CONSTS.config );
FileOps.openFile( config  )
.then(function(data) {
    data = JSON.parse( data );
    var themes = path.join( CONSTS.base, data.themeLookup );

    return FileOps.getDirectories( themes );
})
.then(function( data ) {
    var themes = data.dirs;
    var themePath = data.path;

    var filteredThemes = themes.filter(function(theme) {
        return theme === program.theme;
    });

    return Generator.run(path.join(
        themePath,
        filteredThemes[ 0 ]
    ), path.resolve(
        CONSTS.base,
        program.output
    ));
});


