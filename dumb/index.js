'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var humps = require('humps');
var path = require('path');

module.exports = Generator.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the bee\'s knees ' + chalk.red('Dumb Component') + ' generator!'
    ));
    var done = this.async();

    var prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Component Name? (use camelCase)',
        default: this.appname
      },
      {
        type: 'list',
        name: 'folder',
        message: 'Place your component in folder?',
        choices: [
          {
            name: 'views',
            value: 'views/'
          },
          {
            name: 'ui',
            value: 'ui/'
          }
        ],
        default: 'views'
      }
      // ,
      // {
      //   type: 'input',
      //   name: 'routeState',
      //   message: 'Component Router State? (i.e: "app.home")',
      //   default: 'app.home'
      // }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function () {
    var dirName = path.dirname(this.props.name) === undefined ? '' : path.dirname(this.props.name) + '/';
    var name = humps.camelize(path.basename(this.props.name));
    var className = humps.decamelize(name, {separator: '-'});

    var basePath = this.config.get('fullPath') + this.props.folder + dirName;
    var templatePath = this.config.get('templatePath') + this.props.folder + dirName;
    var moduleName = this.config.get('module');
    var files = [
      {src: 'component.html',
        dest: basePath + name + '/' + name + '.html',
        name: name,
        className: className},
      {src: 'component.js',
        dest: basePath + name + '/' + name + '.js',
        templateUrl: templatePath + name + '/' + name + '.html',
        name: name,
        className: className},
      {src: 'component.scss',
        dest: basePath + name + '/' + name + '.scss',
        name: name,
        className: className}
    ];

    var self = this;
    files.forEach(function (file) {
      self.fs.copyTpl(
        self.templatePath(file.src),
        self.destinationPath(file.dest),
        {
          name: file.name,
          className: file.className,
          templateUrl: file.templateUrl,
          moduleName: moduleName
        }
      );
    });
  },

  install: function () {
    // this.installDependencies();
  }
});
