// @ts-check
const gulp = require("gulp");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const { spawn } = require("child_process");

const proj = ts.createProject("./tsconfig.json");

const clean = () => del([
    "index.js",
    "index.js.map",
    "index.d.ts",
    "index.d.ts.map",
]);
const build = () => gulp.src("*.ts")
    .pipe(sourcemaps.init())
    .pipe(proj())
    .pipe(sourcemaps.write(".", { includeContent: false, destPath: "." }))
    .pipe(gulp.dest("."));
const test = () => spawn('node', [require.resolve("jest/bin/jest")], { stdio: "inherit" });
const watch = () => spawn('node', [require.resolve("jest/bin/jest"), "--watch"], { stdio: "inherit" });

const ci = gulp.series(clean, build);
gulp.task("clean", clean);
gulp.task("build", build);
gulp.task("ci", ci);
gulp.task("test", gulp.series(clean, test));
gulp.task("watch", gulp.series(clean, watch));
gulp.task("default", build);