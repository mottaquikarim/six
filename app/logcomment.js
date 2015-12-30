var colors = require('colors');
var moment = require('moment');

module.exports = function LogComment( msg, level, timeStamp ) {
    var LEVELS = {
        'comment': 'magenta',
        'success': 'green',
        'failure': 'red',
        'process': 'cyan'
    };
    var codes = [
        'comment',
        'success',
        'failure',
        'process'
    ];

    var levelAsKey = codes[ level ];
    if ( typeof levelAsKey === "undefined" ) {
        levelAsKey = 'comment';
    }

    var lvlColor = LEVELS[ levelAsKey ];

    if ( timeStamp ) {
        msg += moment().format( timeStamp );
    }

    console.log( msg[ lvlColor ] );
} // LogComment
