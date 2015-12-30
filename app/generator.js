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
    FileOps.openFile( configPath ).then(function(data) {
        data = JSON.parse( data );
        return __.readFiles( basePath, data, outputPath );
    })
    .then(function(files) {

    });
}

__.readFiles = function( basePath, data, outputPath ) {
    var d = Q.defer();

    var files = data.data;
    var staticPath = path.join( basePath, data.staticBase );

    var transformedData = {};
    Object.keys( files ).reduce(function( promise, file ) {
        return promise.then(function() {
            var fileData = files[ file ];
            console.log( file, fileData );
            return Object.keys( fileData ).reduce(function( fileDataPromise, fileDataItem ) {
                return fileDataPromise.then(function() {
                    return FileOps.openFile( path.join( basePath, fileData[ fileDataItem ] ) )
                    .then(function(fileDataItemData) {
                        if ( typeof transformedData[ path.join( outputPath, file ) ] === "undefined" ) {
                            transformedData[ path.join( outputPath, file ) ] = {};
                        }

                        transformedData[ path.join( outputPath, file ) ][ fileDataItem ] = marked( fileDataItemData );
                    });
                });
            }, Q());
        });
    }, Q())
    .then(function() {
        console.log('$$$');
        console.log( staticPath, outputPath );
        return FileOps.copyFile( staticPath, outputPath );
    })
    .then(function( err ) {
        console.log( '-------' );
        console.log( transformedData );
        console.log( '-------' );

        Object.keys( transformedData ).reduce(function( tProm, dataItem ) {
            return tProm.then(function() {
                return FileOps.openFile( dataItem );
            })
            .then(function( data ) {
                console.log( dataItem, transformedData[ dataItem ] );
                var compiled = _.template( data );
                var transformed = compiled( transformedData[ dataItem ] );
                console.log( transformed );
                return FileOps.writeFile( dataItem, transformed );
            });
        }, Q())
        .then(function() {
            console.log('done!!!');
        });
    });
    console.log( files, staticPath, outputPath );

    return d.promise;
}

module.exports = __;
