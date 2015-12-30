var DeferredFactory = require('./DeferredFactory');
var fs = require( 'fs-extra' );
var Q = require('q');

var __writeFile = DeferredFactory( fs.writeFile, fs );
var __openFile = DeferredFactory( fs.readFile, fs );
var __readDir = DeferredFactory( fs.readdir, fs );
var __stat = DeferredFactory( fs.stat, fs );
var __copy = DeferredFactory( fs.copy, fs );

var __ = {};
__.copyFile = __copy;
__.writeFile = __writeFile;
__.openFile = function() {
    var args = [].slice.call( arguments );
    args.push( 'utf-8' );
    return __openFile.apply( null, args );
}
__.getDirectories = function getDirectories( path ) {
    var d = Q.defer();

    var dirs = [];
    __readDir( path ).then(function(files) {
        return files.reduce(function(promise, file) {
            return promise.then(function() {
                var fpath = path + file;
                return __stat( fpath );
            })
            .then(function( obj ) {
                if ( obj.isDirectory() ) {
                    dirs.push( file );
                }

                return Q();
            });
        }, Q());
    })
    .then(function(data) {
        if ( dirs.length === 0 ) {
            d.reject();
        }
        else {
            d.resolve({
                dirs: dirs,
                path: path
            });
        }
    });

    return d.promise;
}

module.exports = __;
