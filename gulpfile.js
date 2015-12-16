/**
 * authors by 储涛 on 15/12/7.
 */

//引入插件
var gulp = require('gulp'),
    less = require('gulp-less'),//less编译插件
    htmlmin = require('gulp-htmlmin'),//html压缩插件
    uglify = require('gulp-uglify'),//压缩js插件
    concat = require('gulp-concat'),//文件合并插件
    minifyCss = require('gulp-minify-css'),//文件合并成一行
    autoprefixer = require('gulp-autoprefixer'),//根据设置浏览器版本自动处理浏览器前缀
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),//压缩添加.min
    copy = require('gulp-copy'),//copy文件
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),//图片压缩
    clean = require('gulp-clean'), //文件清理
    cdn = require('gulp-cdn-replace'),//cdn
    manifest = require('gulp-manifest'),//页面缓存
    useref = require('gulp-useref'),
    gulpif = require('gulp-if');

//默认配置
var config = {
    distPath: 'dist/',
    appPath: 'app/',
    default: '',
    cdn: 'http://images-menma-me.b0.upaiyun.com/yxh.realty.menma.me/microloushu/'
};


//离线缓存
gulp.task('manifest', function () {
    gulp.src([
            "*.ico",
            config.distPath + 'assets/**/*.*'
        ], {base: './'})
        .pipe(manifest({
            cache: ["http://res.wx.qq.com/open/js/jweixin-1.0.0.js"],
            hash: true,
            preferOnline: false,
            network: ['*'],
            verbose: true,
            timestamp: true,
            filename: 'appcache.manifest',
            exclude: 'appcache.manifest'
        }))
        .pipe(gulp.dest(config.distPath + '/'));
});


//cdn
gulp.task('cdn', function () {
    gulp.src(config.appPath + '/*.html')
        .pipe(cdn({
            dir: config.appPath + '/',
            root: {
                js: config.cdn,
                css: config.cdn
            }
        }))
        .pipe(gulp.dest(config.appPath + '/'));
});


//livereload浏览器同步刷新
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch([config.app + '*.html'], function (event) {
        livereload.changed(event.path);
    });
    gulp.watch(config.appPath + 'assets/less/*.less', ['less']);
});


//文件拷贝
gulp.task('copy', function () {   // copy files
    return gulp.src(config.appPath + 'libs/**')
        .pipe(gulp.dest(config.distPath + 'libs/'));
});

gulp.task('list', ['copy'], function () {
    //配置需要copy的文件
    return gulp.src([
            config.appPath+'/tongji.php',
            config.appPath+'/favicon.ico'
    ])
        .pipe(gulp.dest(config.distPath + '/'));
});


//图片压缩
gulp.task('images', function () {
    gulp.src(config.appPath + 'assets/images/**')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.distPath + '/assets/images/'));
});


//清空图片、样式、js
gulp.task('clean', function () {
    return gulp.src([config.distPath + '/'], {read: false})
        .pipe(clean({force: true}));
});


//Less编译
gulp.task('less', function () {
    gulp.src(config.appPath + 'assets/less/app.less') //该任务针对的文件
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest(config.appPath + 'assets/css'))
        .pipe(livereload())

        //根据设置浏览器版本自动处理浏览器前缀
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            remove: false //是否去掉不必要的前缀 默认：true
        }))

        .pipe(gulp.dest(config.appPath + 'assets/css'));
});


//文件合并压缩
gulp.task('js-css-merger', function () {

    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值
        removeEmptyAttributes: true,//删除所有空格作属性值
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: false,//压缩页面JS
        minifyCSS: false//压缩页面CSS
    };

    return gulp.src(config.appPath + '/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulpif('*.html', htmlmin(options)))
        .pipe(gulp.dest(config.distPath + '/'))
});

gulp.task('default', ['less', 'watch']); //定义默认任务


gulp.task('test-copy', ['copy', 'html']); //定义默认任务


gulp.task('dist-cdn', ['js-css-merger', 'cdn', 'copy', 'images', 'manifest']); //项目定义cdn压缩任务

gulp.task('dist', ['copy','list','js-css-merger','images', 'manifest']); //项目dist压缩任务