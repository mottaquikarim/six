var colors = require('colors');
var program = require('commander');

program
  .version('0.0.1')
  .option('-d, --directory [directory]', 'directory to watch')
  .option('-t, --theme [themename]', 'choose a theme [default]', 'default')
  .option('-o, --output [output]', 'choose output path [output]', 'output')
  .parse(process.argv);

if ( typeof program.directory === "undefined" ) {
    console.log("Error: must specify a directory to watch".red);
    return;
}


var util = require('util'),
    spawn = require('child_process').spawn,
    watch = spawn('./node_modules/.bin/watch', ['node app/index.js', program.directory]),
    exec = require('child_process').exec;

console.log( ('Watching your ' + program.directory + ' directory').green );
console.log( 'Press Ctrl+C to exit'.green );

watch.stdout.on('data', function (data) {
  process.stdout.write((""+data));
  // hack...
  if ( data && typeof (""+data) === "string" && (""+data).indexOf( 'Process Completed' ) !== -1 ) {
    exec("osascript -e 'display notification \"Site generated successfully\" with title \"Six\" sound name \"Tink\"'");
  }
});

watch.stderr.on('data', function (data) {
  process.stdout.write((""+data));
});

watch.on('exit', function (code) {
  console.log(('child process exited with code ' + code).pink);
});
