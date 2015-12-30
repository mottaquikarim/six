var DeferredFactory = require('./DeferredFactory');
var fs = require( 'fs-extra' );
var Q = require('q');

/*
 *  promisified file ops
 */
var __writeFile = DeferredFactory( fs.writeFile, fs );
var __openFile = DeferredFactory( fs.readFile, fs );
var __readDir = DeferredFactory( fs.readdir, fs );
var __stat = DeferredFactory( fs.stat, fs );
var __copy = DeferredFactory( fs.copy, fs );

var __ = {};

// public alias for promisified copy
__.copyFile = __copy;

// public alias for promisified write
__.writeFile = __writeFile;

// read file with utf-8 encoding by default
__.openFile = function() {
    var args = [].slice.call( arguments );
    args.push( 'utf-8' );
    return __openFile.apply( null, args );
}

// grab list of directories within a dir -- ONE LEVEL only
__.getDirectories = function getDirectories( path ) {
    // build path and stat
    function statPath( path, file ) {
        function __() {
            var fpath = path + file;
            return __stat( fpath );
        }

        return __;
    } // statPath

    // expects stat obj, if dir, push to dirs array
    function updateDirs( dirs, file ) {
        function __( obj ) {
            if ( obj.isDirectory() ) {
                dirs.push( file );
            }

            return Q();
        }

        return __;
    } // updateDirs

    // resolve promise
    function resolveDirs( dirs, path ) {
        function __( data ) {
            if ( dirs.length === 0 ) {
                d.reject();
                return;
            }

            d.resolve({
                dirs: dirs,
                path: path
            });
        }

        return __;
    } // resolveDirs

    var d = Q.defer();
    var dirs = [];

    // read dir
    __readDir( path )
    // grab all files
    .then(function(files) {
        // reduce the array of files
        return files.reduce(function(promise, file) {
            // first stat the file to see if dir
            return promise.then(statPath( path, file ))
            // and based on stat, push to dirs array
            .then(updateDirs( dirs, file ));
        }, Q())
        // once all files have been stat'd, resolve promise
        .then(resolveDirs( dirs, path ));
    });

    return d.promise;
}

module.exports = __;
