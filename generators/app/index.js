'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');


var OnepageGenerator = yeoman.generators.Base.extend({
  constructor: function () {
    var testLocal;

    yeoman.Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skipts the message after the installation of dependencies',
      type: Boolean
    });
  },

  initializing: function () {
    this.pkg = require('../../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box i include jQuery, Sass and a gulpfile to build your site.'));
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What would you like?',
      choices: [{
        name: 'Sass',
        value: 'includeSass',
        checked: true
      }, {
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: true
      }, {
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }]
    }];

  this.prompt(prompts, function (answers) {
    var features = answers.features;

    function hasFeature(feat) {
      return features && features.indexOf(feat) !== -1;
    };

    // manually deal with the response, get back and store the results.
    this.includeSass = hasFeature('includeSass');
    this.includeBootstrap = hasFeature('includeBootstrap');
    this.includeModernizr = hasFeature('includeModernizr');
    done();
  }.bind(this));
  },
  writing: {
    gulpfile: function () {
      this.fs.copyTpl(
        this.templatePath('gulpfile.babel.js'),
        this.destinationPath('gulpfile.babel.js'),
        {
          date: (new Date).toISOString().split('T')[0],
          name: this.pkg.name,
          version: this.pkg.version,
          includeSass: this.includeSass,
          includeBootstrap: this.includeBootstrap
        }
      );
    },

    packageJSON: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          includeSass: this.includeSass
        }
      );
    },

    git: function () {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore'));

      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes'));
    },

    bower: function () {
      var bowerJson = {
        name: _s.slugify(this.appname),
        private: true,
        dependencies: {}
      };

      if(this.includeModernizr) {
        bowerJson.dependencies['modernizr'] = '~3.2.0';
      }
      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },

    editorConfig: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    h5bp: function () {
      this.fs.copy(
        this.templatePath('favicon.ico'),
        this.destinationPath('app/favicon.ico')
      );

      this.fs.copy(
        this.templatePath('apple-touch-icon.png'),
        this.destinationPath('app/apple-touch-icon.png')
      );
    },

    styles: function () {
      var css = 'styles.css';

      if (this.includeSass) {
        var modules = 'modules';
        var variables = 'variables';
        var scss = 'styles.scss';
        this.fs.copyTpl(
          this.templatePath(modules),
          this.destinationPath('app/assets/sass/' + modules)
          );
        this.fs.copyTpl(
          this.templatePath(variables),
          this.destinationPath('app/assets/sass/' + variables)
          );
        this.fs.copyTpl(
          this.templatePath(scss),
          this.destinationPath('app/assets/sass/' + scss)
        );
        this.fs.copyTpl(
          this.templatePath(css),
          this.destinationPath('app/styles/' + css)
        );
      } else {
        this.fs.copyTpl(
        this.templatePath(css),
        this.destinationPath('app/styles/' + css)
        );
      }
    },

    scripts: function () {
      this.fs.copy(
        this.templatePath('scripts.js'),
        this.destinationPath('app/scripts/scripts.js')
      );
    },

    html: function() {
      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('app/index.html'),
        {
          appname: this.appname,
          includeSass: this.includeSass,
          includeModernizr: this.includeModernizr,
          includeJQuery: this.includeJQuery
        }
      );
    },

    misc: function() {
      mkdirp('app/images');
      mkdirp('app/fonts');
    }
  },

  install: function () {
    this.installDependencies({
      skippMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });
  },
  end: function () {
    var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
    var howToInstall =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', inject your' +
      '\nfront end dependencies by running ' +
      chalk.yellow.bold('gulp wiredep') +
      '.';

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }
    // wire Bower packages to .html
    wiredep({
      bowerJson: bowerJson,
      directory: 'bower_components',
      exclude: ['bootstrap-sass', 'bootstrap.js'],
      ignorePath: /^(\.\.\/)*\.\./,
      src: 'app/index.html'
    });

    if (this.includeSass) {
      // wire Bower packages to .scss
      wiredep({
        bowerJson: bowerJson,
        directory: 'bower_components',
        ignorePath: /^(\.\.\/)+/,
        src: 'app/styles/*.scss'
      });
    }
  }
});
module.exports = OnepageGenerator;
