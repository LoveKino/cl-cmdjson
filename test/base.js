import assert from "assert";
import CmdJson from "../index";

describe("base", () => {
    it("base", () => {
        let cmdJson = CmdJson({
            add: (x, y) => x + y
        });

        assert.equal(cmdJson(["$[add]", 1, 2]), 3);
    });

    it("compose", () => {
        let cmdJson = CmdJson({
            add: (x, y) => x + y,
            sub: (x, y) => x - y,
        });

        assert.equal(cmdJson(["$[add]", ["$[sub]", 9, 2], 1]), 8);
    });

    it("normal", () => {
        let cmdJson = CmdJson({
            add: (x, y) => x + y
        });

        assert.equal(cmdJson(12), 12);
        assert.equal(cmdJson("ok"), "ok");
        assert.equal(cmdJson({
            v: 1
        }).v, 1);
    });
});