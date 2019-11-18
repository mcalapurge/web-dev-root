const UglifyJS = require('uglify-js');
const uglifycss = require('uglifycss');
const fs = require("fs");
const sass = require('node-sass');

const pkg = require("./package.json");

if (pkg.vars.type.wordpress){
    const themeName = pkg.vars.type.themeName;
    var path = `./public/wp-content/themes/${themeName}`;
} else {
    var path = pkg.vars.type.path;
}

pkg.vars.scriptFiles.forEach(function(single){
    
    let filename = single.replace(/[^]+\//, '').replace(/\..*/, '');
    single = './assets/' + single;

    let script = fs.readFileSync(single, 'utf8');
    let result = UglifyJS.minify(script);

    if (!fs.existsSync(path + '/js')){
        fs.mkdirSync(path + '/js');
    }
    fs.writeFileSync(`${path}/js/${filename}.min.js` , result.code);

});

pkg.vars.styleFiles.forEach(function(single){
    
    let filename = single.replace(/[^]+\//, '').replace(/\..*/, '');
    single = './assets/' + single;


    function uglifyOutput(content){
        return uglifycss.processString(
            content,
            { maxLineLen: 80, expandVars: true }
        );
    }
        
    let style = fs.readFileSync(single, 'utf8');
    
    sass.render({
        data: style
    }, function(err, result){
        if (err){
            console.log('ERROR  ' + err);
        } else {
            fs.writeFileSync(`${path}/${filename}.min.css` , uglifyOutput(result.css.toString('utf8')));
        }
    });
    
});
