'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var humps = require('humps');

module.exports = Generator.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    // this.log(yosay(
    //   'Welcome to the bee\'s knees ' + chalk.red('generator-ng-webcomponent') + ' generator!'
    // ));
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Component Name? (use camelCase)',
      default: this.appname
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function () {
    var name = humps.camelize(this.props.name);
    var className = humps.decamelize(name, {separator: '-'});
    this.fs.copyTpl(
      this.templatePath('component.js'),
      this.destinationPath('app/scripts/components/ui/' + name + '/' + name + '.js'),
      {
        name: name,
        className: className
      }
    );

    this.fs.copyTpl(
      this.templatePath('component.html'),
      this.destinationPath('app/scripts/components/ui/' + name + '/' + name + '.html'),
      {
        name: name,
        className: className
      }
    );

    this.fs.copyTpl(
      this.templatePath('component.scss'),
      this.destinationPath('app/scripts/components/ui/' + name + '/' + name + '.scss'),
      {
        name: name,
        className: className
      }
    );
  },

  install: function () {
    this.installDependencies();
  }
});
