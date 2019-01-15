(function () {
    'use strict';

    var fs = require('fs');
    var jetpack = require('fs-jetpack');
    var zip = require('node-zip')();

    function zipper (file, name) {
        zip
            .file('theme.css', jetpack.read(file, 'utf8'))
            .file('readme.md', jetpack.read('./readme.md', 'utf8'));
        var bin = zip.generate({ base64 : false, compression : 'DEFLATE' });
        fs.writeFileSync('./dist/' + name + '.zip', bin, 'binary');
    }

    module.exports = zipper;
}());