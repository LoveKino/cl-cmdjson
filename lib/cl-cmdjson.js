'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/**
 * grammer
 *
 * ["$[command]", ...args]
 *
 * ["$[add]"]
 * 
 */

module.exports = function (opts) {
    opts = merge({
        cmdNameReg: /^\$\[(.*)\]$/
    }, opts);

    var cmdNameReg = opts.cmdNameReg;

    var cmdJson = function cmdJson(cmdMap) {
        checkCmdMap(cmdMap);

        var getValue = function getValue(jsonCmd) {
            var res = parseJsonCmd(jsonCmd);
            if (res === false) {
                return jsonCmd;
            } else {
                var cmdName = res.cmdName;
                var args = res.args;

                var fun = cmdMap[cmdName];
                if (!fun) throw new Error('Missing function definition for cmd ' + cmdName);
                for (var i = 0; i < args.length; i++) {
                    args[i] = getValue(args[i]);
                }
                return fun.apply(undefined, args);
            }
        };

        return getValue;
    };

    var parseJsonCmd = function parseJsonCmd(jsonCmd) {
        if (!isJsonCmd(jsonCmd)) return false;

        var cmdName = jsonCmd[0];
        var arr = cmdNameReg.exec(cmdName);

        return {
            cmdName: arr[1],
            args: jsonCmd.slice(1)
        };
    };

    var isJsonCmd = function isJsonCmd(jsonCmd) {
        if (!isArray(jsonCmd)) return false;

        var cmdName = jsonCmd[0];
        if (typeof cmdName !== "string") return false;

        var arr = cmdNameReg.exec(cmdName);

        if (!arr) return false;

        return true;
    };

    // export two
    cmdJson.isJsonCmd = isJsonCmd;
    cmdJson.parseJsonCmd = parseJsonCmd;

    return cmdJson;
};

var checkCmdMap = function checkCmdMap(cmdMap) {
    if (!cmdMap || (typeof cmdMap === 'undefined' ? 'undefined' : _typeof(cmdMap)) !== 'object') throw new Error('Expect object for cmdMap. ' + cmdMap);
    for (var name in cmdMap) {
        var v = cmdMap[name];
        if (typeof v !== 'function') throw new Error('Expect function type for cmdMap\'s attribute ' + name + '.');
    }
};

var isArray = function isArray(v) {
    return v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && typeof v.length === 'number';
};

var merge = function merge(def) {
    var map = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    for (var name in map) {
        def[name] = map[name];
    }
    return def;
};