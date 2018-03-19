// Dependencias do gulp
var gulp = require("gulp"),
	imagemin = require("gulp-imagemin"),
	clean = require("gulp-clean"),
	concat = require("gulp-concat"),
	htmlReplace = require("gulp-html-replace"),
	cssmin = require("gulp-cssmin"),
	browserSync = require("browser-sync"),
	jshint = require("gulp-jshint"),
	jshintStylish = require("jshint-stylish"),
	csslint = require("gulp-csslint")


//Limpa e copia a pasta src para a dist
gulp.task("copy", ["clean"],() => {
	return gulp.src("src/**/*")
		       .pipe(gulp.dest('dist'));	
});

gulp.task("clean", () => {
	return gulp.src("dist")
			   .pipe(clean());	
});

//Após a limpeza e copia da pasta src e iniciado a automação de arquivos
gulp.task("default", ["copy"],() => {
	
	gulp.start("build-img", "build-js", "build-css", "build-html")
	
})

//Diminui o tamnho das imagens
gulp.task("build-img", () => {
	
	gulp.src("dist/imagens/**/*")
		.pipe(imagemin())
		.pipe(gulp.dest("dist/imagens/"))
	
});

//Concatena os arquivo .js
gulp.task("build-js", () => {
	
	gulp.src(["dist/js/vue.min.js", "dist/js/vue-resource.min.js", "dist/js/index.js"])
		.pipe(concat("all.js"))
		.pipe(gulp.dest("dist/js/"))
	
});

//concatena e mimifica os arquivos .css
gulp.task("build-css", ["build-js"],() => {
	
	gulp.src("dist/css/**/*.css")
		.pipe(concat("all.css"))
		.pipe(cssmin())
		.pipe(gulp.dest("dist/css/"))
	
});

//Renomeia as requisições nas páginas html para solicitarem os arquivos concatenados e mimificados
gulp.task("build-html", function(){
	
	gulp.src("dist/**/*.html")
		.pipe(htmlReplace({
			js: 'js/all.js',
			css: 'css/all.css'
		}))
		.pipe(gulp.dest("dist/"))
	
});

//Servidor para LiveReload
gulp.task("server", () => {
	browserSync.init({
		server:{
			baseDir: 'src'
		}
	})

	//Cria um visualizador de alteração de arquivo js e tras hints de código para refinamento 
	gulp.watch("src/js/*.js").on("change", event => {
		gulp.src(event.path)
			.pipe(jshint())
			.pipe(jshint.reporter(jshintStylish));
	});

	//Cria um visualizador de alteração de arquivo css e tras hints de código para refinamento 
	gulp.watch("src/css/*.css").on("change", event => {
		gulp.src(event.path)
			.pipe(csslint())
			.pipe(csslint.formatter());
	});	

	//Se algum arquivo for alterado o arquivo browser atualiza automaticamente
	gulp.watch("src/**/*").on("change", browserSync.reload);
})

