module.exports = function(grunt) {
	require("load-grunt-tasks")(grunt);
	const sass = require("node-sass");

	// grun tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		config: {
			css: "httpdocs/css/build/edtesa.css",
			js: "httpdocs/javascript/build/edtesa.js",
			es5: "httpdocs/javascript/build/edtesa.es5.js",
			php: process.platform === "win32" ? "C:/Program Files/php/php.exe" : "/opt/plesk/php/7.3/bin/php"
		},
		sass: {
			options: {
				implementation: sass
			},
			dev: {
				options: {
					sourceMap: true
				},
				files: {
			    	"<%= config.css %>": "application/bootstrap.scss"
				}
			},
			live: {
				files: {
			    	"<%= config.css %>": "application/bootstrap.scss"
				}
			}
		},
		copy: {
			files: {
				expand: true,
				flatten: true,
				src: ["application/**/*.woff2", "application/**/*.woff"],
				dest: "httpdocs/css/"
			},
		},
		postcss: {
      		dev: {
				options: {
					processors: [
				        require("autoprefixer")() // add vendor prefixes
	      			],
	      			map: true
	      		},
      			src: "<%= config.css %>"
      		},
      		live: {
				options: {
					processors: [
				        require("autoprefixer")(), // add vendor prefixes
				        require("cssnano")() // minify the result
	      			]
	      		},
      			src: "<%= config.css %>"
      		}
		},
		eslint: {
    		options: { configFile: "application/swgfl/javascript/.eslintrc"},
			es6: {
				src: grunt.file.expand(['application/*.js'])
			}
		},
		rollup: {
			es6: {
				options: {
					format: "es",
					sourcemap: true
				},
				src: "application/bootstrap.js",
				dest: "<%= config.js %>"
			},
			es5: {
				options: {
					format: "umd",
					sourcemap: true
				},
				src: "application/bootstrap.es5.js",
				dest: "<%= config.es5 %>"
			}
		},
		babel: {
			es6: {
				files: {
					"<%= config.js %>": "<%= config.js %>"
				},
				options: {
					sourceMap: true,
					presets: [
						["minify", {mangle: {exclude: ["$"], topLevel: true}}]
					],
					comments: false
				}
			},
			es5: {
				files: {
					"<%= config.es5 %>": "<%= config.es5 %>"
				},
				options: {
					sourceMap: true,
					presets: [
						["@babel/env", {
							useBuiltIns: false,
							modules: false
						}]
					]
				}
			}
		},
		uglify: {
			options: {
				report: "gzip"
			},
			minified: {
				files: {
					"<%= config.es5 %>": "<%= config.es5 %>"
				}
			}
		},
		unzip: {
			ckeditor: {
				src: "application/swgfl/javascript/ckeditor.zip",
				dest: "httpdocs/javascript/"
			}
		},
		shell: {
			docs: {
				command: [
					"php \"<%= config.phpfolder %>apigen.phar\" generate -s application/swgfl -d docs/framework",
					"php \"<%= config.phpfolder %>phpDocumentor.phar\" -d application/swgfl -t docs/framework-phpdocs"
				].join('&&')
			}
		},
		phpunit: {
			classes: {
				dir: "application/"
			},
			options: {
				bin: "phpunit",
				bootstrap: "application/swgfl/tests/phpunit.php",
				testdox: true,
				colors: true,
				debug: false
			}
		},
		watch: {
			css: {
				files: ["application/**/*.scss", "config/_config.scss"],
				tasks: ["sass:dev", "postcss:dev"]
			},
			js: {
				files: ["application/**/*.js", "config/config.js", "../dabby/dist/dabby.es5.js"],
				tasks: ["eslint", "rollup:es6"]
			},
			icons: {
				files: ["application/swgfl/stylesheets/icons/*.*"],
				tasks: ["copy"]
			},
			gruntfile: {
				files: ["gruntfile.js", "package.json"],
				tasks: ["sass:dev", "postcss:dev", "eslint", "rollup:es6"]
			}
		}
	});

	grunt.registerTask("default", ["unzip", "copy", "sass:live", "postcss:live", "eslint", "rollup", "babel", "uglify"]);
	grunt.registerTask("css", ["sass:dev", "postcss:dev"]);
	grunt.registerTask("js", ["eslint", "rollup", "babel:es5"]);
	grunt.registerTask("docs", ["shell:docs"]);
	grunt.registerTask("test", ["phpunit"]);
	grunt.registerTask("ckeditor", ["unzip"]);
};
