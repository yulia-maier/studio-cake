import gulp from "gulp";
import fileInclude from "gulp-file-include";
import { deleteAsync } from "del";
import browserSync from "browser-sync";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import groupMedia from "gulp-group-css-media-queries";
import uglify from "gulp-uglify";

const sass = gulpSass(dartSass);
const srcFolder = "src";
const buildFolder = "dist";

const paths = {
    html: {
        src: `${srcFolder}/index.html`,
        watch: `${srcFolder}/**/*.html`,
        dest: `${buildFolder}/`,
    },
    styles: {
        src: `${srcFolder}/main.scss`,
        watch: `${srcFolder}/**/*.scss`,
        dest: `${buildFolder}/css/`,
    },
    scripts: {
        src: `${srcFolder}/main.js`,
        watch: `${srcFolder}/**/*.js`,
        dest: `${buildFolder}/js/`,
    },
    fonts: {
        src: `${srcFolder}/fonts/**/*.{woff,woff2,ttf}`,
        dest: `${buildFolder}/fonts/`,
    },
    images: {
        src: `${srcFolder}/images/**/*.{jpg,jpeg,png,svg,gif,webp}`,
        dest: `${buildFolder}/images/`,
    },
};

function html() {
    return gulp
        .src(paths.html.src)
        .pipe(fileInclude())
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(groupMedia())
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp
        .src(paths.scripts.src)
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream());
}

function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
        .pipe(browserSync.stream());
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream());
}

function clean() {
    return deleteAsync([buildFolder]);
}

function watcher() {
    browserSync.init({
        server: { baseDir: buildFolder },
        notify: false,
    });
    gulp.watch(paths.html.watch, html);
    gulp.watch(paths.styles.watch, styles);
    gulp.watch(paths.scripts.watch, scripts);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.images.src, images);
}

const build = gulp.series(clean, gulp.parallel(html, styles, scripts, fonts, images));
const dev = gulp.series(build, watcher);

export { build, dev };
export default dev;
