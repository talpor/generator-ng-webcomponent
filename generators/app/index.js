'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = Generator.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the bee\'s knees ' + chalk.red('generator-ng-webcomponent') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'module',
      message: 'Component Name? (i.e. "app.core")',
      default: 'app.core'
    },
    {
      type: 'input',
      name: 'fullPath',
      message: 'Path for your components? (default: "app/scripts/components/")',
      default: 'app/scripts/components/'
    },
    {
      type: 'input',
      name: 'templatePath',
      message: 'Relative path for your templates? (default: "scripts/components/")',
      default: 'scripts/components/'
    },
    {
      type: 'input',
      name: 'routeFile',
      message: 'Path for your Routes? (default: "app/scripts/routes.js")',
      default: 'app/scripts/routes.js'
    }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    this.config.set({
      module: this.props.module,
      fullPath: this.props.fullPath,
      templatePath: this.props.templatePath,
      routeFile: this.props.routeFile
    });
    this.log('\n\nYour Component Generator is ready, now you can use:\n\tyo ng-webcomponent:smart <component name> or\n\tyo ng-webcomponent:dumb <component name>');
  },

  install: function () {
    // this.installDependencies();
  }
});
