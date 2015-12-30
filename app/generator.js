var LogComment = require('./logcomment');
var FileOps = require('./fileops');
var marked = require('marked');
var path = require('path');
var _ = require('underscore');
var Q = require('q');

var CONSTS = {
    'config': 'config.json'
};

var __ = {};

__.run = function run( basePath, outputPath ) {
    var configPath = path.join( basePath, CONSTS.config );
    return FileOps.openFile( configPath ).then(function(data) {
        data = JSON.parse( data );
        return __.readFiles( basePath, data, outputPath );
    });
}

__.readFiles = function( basePath, data, outputPath ) {
    var d = Q.defer();

    var files = data.data;
    var staticPath = path.join( basePath, data.staticBase );
    var transformedData = {};

    // grab all files
    Object.keys( files )
    // and begin looping
    .reduce(function( promise, file ) {
        // for each file item
        return promise.then(function() {
            // grab the data bits
            var fileData = files[ file ];

            // grab all data bit keys 
            return Object.keys( fileData )
            // loop through each one
            .reduce(function( fileDataPromise, fileDataItem ) {
                // for each data bit item
                return fileDataPromise
                // open the file to read
                .then(function() {

                    // START: log to terminal
                    LogComment( 'Opening ' + fileData[ fileDataItem ], 3 );
                    // END: log to terminal

                    return FileOps.openFile(path.join(
                        basePath,
                        fileData[ fileDataItem ]
                    ));
                })
                // then, populate a new object with the data from each data bit item file
                .then(function(fileDataItemData) {
                    var outputFilePath = path.join( outputPath, file );
                    var isUndefined = typeof transformedData[ outputFilePath ] === "undefined";
                    var markedData;
                    if ( fileData[ fileDataItem ].split('.').pop() === 'md' ) {
                        markedData = marked( fileDataItemData );
                     }
                     else {
                        markedData = fileDataItemData.replace(/\n$/, "");
                     }

                    if ( isUndefined ) {
                        transformedData[ outputFilePath ] = {};
                    }

                    // START: log to terminal
                    LogComment( 'Completed reading' + file + '[' + fileDataItem + ']', 1 );
                    // END: log to terminal

                    transformedData[ outputFilePath ][ fileDataItem ] = markedData;
                });
            }, Q());
        });
    }, Q())
    // once the new object has been assembled, copy over the static files to output target
    .then(function() {

        // START: log to terminal
        LogComment( 'Copying ' + staticPath + ' to ' + outputPath, 0 );
        // END: log to terminal

        return FileOps.copyFile( staticPath, outputPath );
    })
    // now last step: populating the output target files with markdown data...
    .then(function( err ) {

        // START: log to terminal
        LogComment( 'Copying completed', 1 );
        // END: log to terminal

        // grab each file in transformed, new object
        return Object.keys( transformedData )
        // and loop...
        .reduce(function( tProm, dataItem ) {
            // for each file...
            return tProm.then(function() {

                // START: log to terminal
                LogComment( 'Opening ' + dataItem, 3 );
                // END: log to terminal

                // read the contents of that file (which should point to output target)
                return FileOps.openFile( dataItem );
            })
            // once read, apply underscore template
            .then(function( data ) {

                // START: log to terminal
                LogComment( 'Opened ' + dataItem, 1 );
                LogComment( 'Transforming ' + dataItem + ' for write operation', 3 );
                // END: log to terminal

                var compiled = _.template( data );
                var transformed = compiled( transformedData[ dataItem ] );
                return FileOps.writeFile( dataItem, transformed )
                .then(function() {
                    // START: log to terminal
                    LogComment( 'Wrote ' + dataItem, 1 );
                    // END: log to terminal
                });
            });
        }, Q());
    })
    // done!
    .then(function() {
        // resolve and laugh all the way to the bank...
        d.resolve();
    });

    return d.promise;
}

module.exports = __;
