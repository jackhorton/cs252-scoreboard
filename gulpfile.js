/* eslint strict: [0, "global"] */
'use strict';

// node still doesnt have built-in support for `import` :(
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const forever = require('forever-monitor');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babelify = require('babelify');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const path = require('path');

const serverGlobs = ['server/**/*.js', 'client/index.js', 'server.js', 'gulpfile.js'];
const clientGlobs = ['client/**/*.jsx'];
const lessGlobs = ['client/**/*.less'];
const server = new forever.Monitor('./index.js');
let isRunning = false;

process.env.NODE_ENV = 'development';
process.env.PGSSLMODE = 'require';

server.on('start', () => {
    console.log(`DEV: starting server at ${Date.now()}`);
});
server.on('exit', () => {
    console.log(`DEV: exiting server at ${Date.now()}`);
});

gulp.task('lint:server', () => {
    return gulp.src(serverGlobs)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint:jsx', () => {
    return gulp.src(clientGlobs)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint:server', 'lint:jsx']);

gulp.task('less', () => {
    gulp.src('client/app.less')
        .pipe(less({
            paths: [path.join(__dirname, 'client', 'styles')]
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch:less', ['less'], () => {
    gulp.watch(lessGlobs, ['less']);
});

gulp.task('jsx', ['lint:jsx'], () => {
    return browserify('client/app.jsx', {
        extensions: ['.jsx'],
        debug: true
    }).transform(babelify, {presets: ['es2015', 'react']})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch:jsx', ['jsx'], () => {
    gulp.watch(clientGlobs, ['jsx']);
});

gulp.task('client', ['jsx', 'less']);

gulp.task('watch:client', ['watch:jsx', 'watch:less']);

gulp.task('server', ['lint:server'], () => {
    if (isRunning) {
        server.stop();

        // setTimeout is necessary here because server.stop, for whatever reason,
        // is async without providing a callback for completion. 100ms should generally
        // be enough time to let the server stop before trying to start it again
        setTimeout(() => {
            server.start();
        }, 100);
    } else {
        server.start();
        isRunning = true;
    }
});

gulp.task('watch:server', ['server'], () => {
    gulp.watch(serverGlobs, ['server']);
});

gulp.task('watch', ['watch:server', 'watch:client']);

gulp.task('default', ['server', 'client']);
