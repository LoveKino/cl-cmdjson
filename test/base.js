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

    it("bad0", (done) => {
        try {
            let cmdJson = CmdJson({
                add: 123
            });
        } catch (err) {
            done();
        }
    });

    it("bad1", (done) => {
        try {
            let cmdJson = CmdJson({
                add: (x, y) => x + y
            });
            cmdJson(["$[sub]", 1, 2])
        } catch (err) {
            done();
        }
    });
});