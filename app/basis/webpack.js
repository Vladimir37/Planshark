var webpack = require('webpack');
var path = require('path');

var config = {
    context: path.join(__dirname, "../../client/source/js"),
    entry: [
        "jquery", "./libs/toastr.js","./libs/jquery-ui.min.js", "./libs/colorpicker.min.js", "./submitting", "./toaster",
        "./models/account_m", "./models/tasks_m", "./models/t_groups_m", "./models/u_groups_m", "./models/users_m", "./models/templates",
        "react", "react-dom"
    ],
    output: {
        path: path.join(__dirname, "../../client/source/js/bundle")
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};

var compiler = webpack(config);

function start() {
    compiler.run(function (err, stats) {
        if (err) {
            console.log('ERROR');
            console.log(err);
        }
        else {
            console.log('JS-bundle created.');
            //console.log(stats.toJson());
        }
    });
}

module.exports = start;

