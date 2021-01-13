//=====================
// SK_PluginShell.ts
//=====================

/*:
 * @plugindesc Provides a simpler, more modular interface for making plugin commands.
 * @author Atlas Cove
 *
 * @param scriptname
 * @desc The name of the file to load
 * @default PluginShellManifest.js
 *
 * @param scriptname
 * @desc The name of the file to load
 * @default PluginShellManifest.js
 *
 * @help
 *
 * Please see the readme file on how to use this plugin effectively.
 * Think of each plugin as a UNIX shell command.
 */
const fileExists: function = require("fs").fileExistsSync;

try {
  var shlex=require('node-shlex');
} catch(e) {
  var shlex=null;
}

interface PluginCommand {
  [key: string]: (argc: number, argv: Array<string>) => number;
}

var PluginShellGlobals = new Object;

//Main Function
function SK_PluginShell(): void {
  var params = PluginManager.parameters("PluginShell")
  var scriptname: string = params?.scriptname ?? "PluginShellManifest.js";
  var useShlex: boolean = !!params?.scriptname;
  var DefaultPluginCommand = Game_Interpreter.prototype.pluginCommand;
  //Main Body
  Game_Interpreter.prototype.pluginCommand = function (command, args) {
    DefaultPluginCommand.apply(arguments);
    var argv:Array<string>=[command];
    var allarg=args.join(' ');
    if(useShlex) argv=argv.concat(shlex.quote(allarg));
    else argv=argv.concat(args)
    var commandObject = require(scriptname);//validation part 1
    if(typeof commandObject != "object") //validation part 2
       throw new TypeError("The type of the plugin interface must be an object.");
    if(commandObject.hasOwnProperty(command)) commandObject[command](argv.length,argv);
  }
}

SK_PluginShell();
