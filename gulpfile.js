'use strict';

const gulp = require('gulp');
const gls = require('gulp-live-server');
const browserSync = require('browser-sync');
//compiling handlebars templates
const handlebars = require('gulp-handlebars');
const wrap = require('gulp-wrap');
const declare = require('gulp-declare');
const concat = require('gulp-concat');
const path = require('path');
//minifying JS
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
//start express server & app
gulp.task('startExp', () => {
    const server = gls.new('app.js');
    server.start();
});

gulp.task('templates', () => {
  gulp.src('source/templates/*.hbs')
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'MyApp.templates',
      noRedeclare: true, // Avoid duplicate declarations 
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('source/templates/layouts/js/'));
});

gulp.task('partials', () => {
	gulp.src(['source/templates/partials/_*.hbs'])
	  .pipe(handlebars({
	      handlebars: require('handlebars')
	    }))
	  .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
	    imports: {
	      processPartialName: (fileName) => {
	        // Strip the extension and the underscore 
	        // Escape the output with JSON.stringify 
	        return JSON.stringify(path.basename(fileName, '.js').substr(1));
	      }
	    }
	  }))
	  .pipe(concat('partials.js'))
	  .pipe(gulp.dest('source/templates/layouts/js/'));
});

//combine all the js and output updated main.html with minified js bundle.min.js tag
gulp.task('smash', () => {
	return gulp.src('source/templates/layouts/main.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.js', gulp.dest('public')))
		.pipe(gulpif('*.html', gulp.dest('views/layouts')));
});

gulp.task('watch', ['browser-sync', 'templates', 'partials', 'smash'], () => {
	gulp.watch('source/templates/partials/_*.hbs', ['partials']);
	gulp.watch('source/templates/*.hbs', ['templates']);
	gulp.watch('source/templates/layouts/*.html', ['templates']);
	gulp.watch('source/templates/layouts/js/*.js', ['smash']);
});

//run everything
gulp.task('default', ['startExp', 'smash', 'browser-sync', 'watch'], () => {
});

gulp.task('browser-sync', () => {
	browserSync.init(null, {
		proxy: "http://localhost:5000",
        files: [
	        				"views/**/*.handlebars", 
	        				"views/*.handlebars",
	        				"public/js/*.js",
	        				"public/css/*.css"
      					],
        browser: "google chrome",
        notify: false,
        port: 7022,
	});
});
