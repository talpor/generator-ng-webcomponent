'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var humps = require('humps');
var path = require('path');
var angularUtils = require('../util.js');

module.exports = Generator.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the bee\'s knees ' + chalk.red('Smart Component') + ' generator!'
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
        type: 'input',
        name: 'routeState',
        message: 'Component Router State? (i.e: "app.home")',
        default: 'app.home'
      }
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
    var itemName = name + 'Item';
    var itemClasName = name + '-item';

    var basePath = this.config.get('fullPath') + 'views/' + dirName;
    var templatePath = this.config.get('templatePath') + 'views/' + dirName;
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
        className: className},
      {src: 'partials/componentItem.html',
        dest: basePath + name + '/partials/' + itemName + '.html',
        name: itemName,
        className: itemClasName},
      {src: 'partials/componentItem.js',
        dest: basePath + name + '/partials/' + itemName + '.js',
        templateUrl: templatePath + name + '/partials/' + itemName + '.html',
        name: itemName,
        className: itemClasName},
      {src: 'partials/componentItem.scss',
        dest: basePath + name + '/partials/' + itemName + '.scss',
        name: itemName,
        className: itemClasName}
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

    // this.uri = this.name;
    // if (this.options.uri) {
    //   this.uri = this.options.uri;
    // }

    var route = humps.decamelize(this.props.routeState.split('.').pop(), {separator: '-'});
    var config = {
      file: this.config.get('routeFile'),
      // file: path.join(
      //   this.env.options.appPath,
      //   'scripts/app.' + (coffee ? 'coffee' : typescript ? 'ts': 'js')
      //   ),
      needle: '.otherwise',
      state: this.props.routeState,
      splicable: [
        '  component: \'' + name + '\',',
        '  url: \'/' + route + '\''
      ]
    };

    config.splicable.unshift('.state(\'' + this.props.routeState + '\', {');
    config.splicable.push('})');

    angularUtils.rewriteFile(config);
  },

  install: function () {
    // this.installDependencies();
  }
});
