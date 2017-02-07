'use strict';

const del = require('del');
const gulp = require('gulp');
const pug = require('gulp-pug2');
const sass = require('gulp-sass');
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const connect = require('gulp-connect');
const plumber = require('gulp-plumber');
const merge = require('gulp-merge-json');
const cleanCSS = require('gulp-clean-css');
const spritesmith = require('gulp.spritesmith');
const webpackStream = require('webpack-stream');
const autoprefixer = require('gulp-autoprefixer');

const webpack = webpackStream.webpack;
const development = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


gulp.task('connect', () => connect.server(
    {
        root: 'app',
        livereload: true
    }
));


gulp.task('sprites', () => {
    gulp.src('build/images/sprites/*.png')
    .pipe(plumber())
    .pipe(spritesmith(
        {
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            cssFormat: 'scss',
            imgPath: '../images/sprite.png',
            algorithm: 'binary-tree'
        }
    ))
    .pipe(
        gulpIf('*.png', 
            gulpIf(
                development,
                gulp.dest('app/images'),
                gulp.dest('production/images')
            )
        )
    )
    .pipe(
        gulpIf('*.scss', gulp.dest('build/styles'))
    );
});


gulp.task('images', () => {
    gulp.src('build/images/*.{jpg,png}')
    .pipe(plumber())
    .pipe(
        gulpIf(
            development,
            gulp.dest('app/images'),
            gulp.dest('production/images')
        )
    );
});


gulp.task('fonts', () => {
    gulp.src('build/fonts/*.{woff,woff2,ttf,eot}')
    .pipe(
        gulpIf(
            development,
            gulp.dest('app/fonts'),
            gulp.dest('production/fonts')
        )
    );
});


gulp.task('json', () => {
    return gulp.src('build/tpl/data/*.json')
    .pipe(merge('data.json'))
    .pipe(gulp.dest('build/tpl'));
});


gulp.task('html', ['json'] , () => {
    const data = require('./build/tpl/data.json');    
    return gulp.src('build/tpl/*.pug')
    .pipe(plumber())
    .pipe(pug(
        { data: data }
    ))
    .pipe(
        gulpIf(
            development, 
            gulp.dest('app'), 
            gulp.dest('production')
        )
    )
    .pipe(connect.reload());
});


gulp.task('css', () => {
    gulp.src('build/styles/*.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(
        {
            browsers: ['last 3 versions'],
            cascade: false
        }
    ))
    .pipe(cleanCSS())
    .pipe(
        gulpIf(
            development, 
            gulp.dest('app/css'), 
            gulp.dest('production/css')
        )
    )
    .pipe(connect.reload());
});


gulp.task('js', () => { 
    const options = {
        entry: {
            app: './build/scripts/app.js'
        },
        output: {
            path: __dirname + '/app',
            library: '[name]',
            filename: '[name].js',
        },
        watch: development,
        watchOptions: development ? { aggregateTimeout: 100 } : null,
        devtool: development ? 'cheap-module-inline-source-map' : null,
        plugins: [
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.CommonsChunkPlugin(
                {
                    name: 'common' 
                }
            )
        ],
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /\/node_modules\//,
                    query: {
                        cacheDirectory: true,
                        presets: ['es2015', 'stage-2']
                    }
                }
            ]
        },
        noParse: /\/node_modules\/(jquery|jquery-placeholder|lodash)/,
    };

    gulp.src('build/scripts/**/*.js')
    .pipe(plumber({
        errorHandler: notify.onError(err => (
            {
                title:   'Webpack',
                message: err.message
            }
        ))
    }))
    .pipe(webpackStream(options))
    .pipe(
        gulpIf(!development, uglify())
    )
    .pipe(
        gulpIf(
            development, 
            gulp.dest('app/scripts'), 
            gulp.dest('production/scripts')
        )
    )
    .pipe(connect.reload());
});


gulp.task('watch', () => {
    gulp.watch('build/styles/**/*.scss', ['css']);
    gulp.watch('build/scripts/**/*.js', ['js']);
    gulp.watch('build/tpl/**/*.pug', ['html']);
});


gulp.task('delProduction', () => {
    del(['production/css','production/scripts', 'production']);
});


gulp.task('default', gulpIf(
    development,
    ['connect', 'images', 'sprites', 'fonts', 'json', 'html', 'js', 'css', 'watch'],
    ['delProduction', 'images', 'sprites', 'fonts', 'json', 'html', 'js', 'css', 'watch']
));



