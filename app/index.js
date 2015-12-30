var LogComment = require('./logcomment');
var Generator = require('./generator');
var program = require('commander');
var FileOps = require('./fileops');
var path = require('path');
var Q = require('q');
var CONSTS = {
    'base': path.join( __dirname, '..' ),
    'config': 'config.json',
    'up': '..'
};

program
  .version('0.0.1')
  .option('-t, --theme [themename]', 'choose a theme [default]', 'default')
  .option('-o, --output [output]', 'choose output path [output]', 'output')
  .parse(process.argv);

var config = path.join( CONSTS.base, CONSTS.config );

// START: log to terminal
LogComment( 'Starting process at ', 1, "dddd, MMMM Do YYYY, h:mm:ss a" );
LogComment( 'Opening config file...', 0 );
// END: log to terminal

FileOps.openFile( config  )
.then(function(data) {
    data = JSON.parse( data );
    var themes = path.join( CONSTS.base, data.themeLookup );

    // START: log to terminal
    LogComment( 'Complete', 1 );
    LogComment( 'Reading theme directories...', 0 );
    // END: log to terminal

    return FileOps.getDirectories( themes );
})
.then(function( data ) {

    // START: log to terminal
    LogComment( 'Complete', 1 );
    LogComment( 'Matching chosen theme...'.magenta );
    // END: log to terminal

    var themes = data.dirs;
    var themePath = data.path;

    var filteredThemes = themes.filter(function(theme) {
        return theme === program.theme;
    });

    // START: log to terminal
    LogComment( 'Complete', 1 );
    LogComment( 'Starting generator...'.magenta );
    // END: log to terminal

    return Generator.run(path.join(
        themePath,
        filteredThemes[ 0 ]
    ), path.resolve(
        CONSTS.base,
        program.output
    ));
})
.then(function() {
    // START: log to terminal
    LogComment( 'Completed transforming all files!', 1 );
    LogComment('Process Completed'.green);
    // END: log to terminal
});


