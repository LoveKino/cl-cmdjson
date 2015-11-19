/**
 * grammer
 *
 * ["$[command]", ...args]
 *
 * ["$[add]"]
 * 
 */

module.exports = (opts) => {
    opts = merge({
        cmdNameReg: /^\$\[(.*)\]$/
    }, opts);

    let  cmdNameReg = opts.cmdNameReg;
    
    let cmdJson = (cmdMap) => {
        checkCmdMap(cmdMap);

        let getValue = (jsonCmd) => {
            let res = parseJsonCmd(jsonCmd);
            if (res === false) {
                return jsonCmd;
            } else {
                let {
                    cmdName, args
                } = res;
                let fun = cmdMap[cmdName];
                if (!fun)
                    throw new Error(`Missing function definition for cmd ${cmdName}`);
                for (let i = 0; i < args.length; i++) {
                    args[i] = getValue(args[i]);
                }
                return fun.apply(undefined, args);
            }
        }

        return getValue;
    }

    let parseJsonCmd = (jsonCmd) => {
        if (!isJsonCmd(jsonCmd))
            return false;

        let cmdName = jsonCmd[0];
        let arr = cmdNameReg.exec(cmdName);

        return {
            cmdName: arr[1],
            args: jsonCmd.slice(1)
        };
    }

    let isJsonCmd = (jsonCmd) => {
        if (!isArray(jsonCmd))
            return false;

        let cmdName = jsonCmd[0];
        if (typeof cmdName !== "string")
            return false;

        let arr = cmdNameReg.exec(cmdName);

        if (!arr)
            return false;

        return true;
    }

    // export two
    cmdJson.isJsonCmd = isJsonCmd;
    cmdJson.parseJsonCmd = parseJsonCmd;

    return cmdJson;
}

let checkCmdMap = (cmdMap) => {
    if (!cmdMap || typeof cmdMap !== 'object')
        throw new Error(`Expect object for cmdMap. ` + cmdMap);
    for (let name in cmdMap) {
        let v = cmdMap[name];
        if (typeof v !== 'function')
            throw new Error(`Expect function type for cmdMap's attribute ${name}.`);
    }
}

let isArray = v => v && typeof v === 'object' && typeof v.length === 'number';

let merge = (def, map = {}) => {
    for (let name in map) {
        def[name] = map[name];
    }
    return def;
}