(function () {
    'use strict';

    var jetpack = require('fs-jetpack');
    var autoprefixer = require('autoprefixer');
    var postcss = require('postcss');
    var cleancss = require('clean-css');
    var zip = require('./bundle.js')

    function collect () {
        // get raw css files
        return jetpack.find('./src', { matching : '*.css' });
    }

    function process (file) {
        // get name for folder
        var name = jetpack.inspect(file).name.split('.')[0];
        var output = './' + name + '/theme.css';
        // get file data
        var css = jetpack.read(file, 'utf8');
        // autoprefix
        postcss([ autoprefixer ]).process(css, {
            from : file,
            to : output
        }).then(function (result) {
            result.warnings().forEach(function (warn) {
                // report errors
                console.warn(warn.toString());
            });
            // minify
            var ret = new cleancss().minify(result.css);
            // save
            jetpack.dir('./' + name);
            jetpack.write(output, ret.styles, { atomic : true });
            // zip for distribution
            zip(output, name);
        });
    }

    collect().forEach( function (file) {
        process(file);
    });
}());