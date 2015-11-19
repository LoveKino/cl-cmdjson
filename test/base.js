import assert from "assert";
import CmdJson from "../index";

describe("base", () => {
    it("base", () => {
        let cmdJson = CmdJson()({
            add: (x, y) => x + y
        });

        assert.equal(cmdJson(["$[add]", 1, 2]), 3);
    });

    it("isJsonCmd", () => {
        assert.equal(CmdJson().isJsonCmd(["$[add]", 1, 2]), true);
        assert.equal(CmdJson().isJsonCmd(["a$[add]", 1, 2]), false);
        assert.equal(CmdJson().isJsonCmd(1), false);
        assert.equal(CmdJson().isJsonCmd(""), false);
    });

    it("parseJsonCmd", () => {
        let res = CmdJson().parseJsonCmd(["$[add]", 1, 2]);
        assert.equal(res.cmdName, "add");
        assert.equal(res.args[0], 1);
        assert.equal(res.args[1], 2);
    });

    it("compose", () => {
        let cmdJson = CmdJson()({
            add: (x, y) => x + y,
            sub: (x, y) => x - y,
        });

        assert.equal(cmdJson(["$[add]", ["$[sub]", 9, 2], 1]), 8);
    });

    it("normal", () => {
        let cmdJson = CmdJson()({
            add: (x, y) => x + y
        });

        assert.equal(cmdJson(12), 12);
        assert.equal(cmdJson("ok"), "ok");
        assert.equal(cmdJson({
            v: 1
        }).v, 1);
    });

    it("bad0", (done) => {
        try {
            let cmdJson = CmdJson()({
                add: 123
            });
        } catch (err) {
            done();
        }
    });

    it("bad1", (done) => {
        try {
            let cmdJson = CmdJson()({
                add: (x, y) => x + y
            });
            cmdJson(["$[sub]", 1, 2])
        } catch (err) {
            done();
        }
    });
});