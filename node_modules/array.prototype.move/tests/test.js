var chai = require("chai");
var expect = chai.expect;

require("../src/array-prototype-move.js");

var simpleArray = ["Han Solo", "Luke Skywalker", "Obi-Wan Kenobi", "Darth Vader", "Chewbacca", "C3P0", "R2D2"];


describe("Simple array tests", function() {
    it("should move the robots to the front of the array", function() {
        simpleArray.move(5, 0);
        simpleArray.move(6, 1);
        expect(simpleArray[0] === "C3P0" && simpleArray[1] === "R2D2").to.be.true;
    });

    it("should move Han to the end, via a negative number", function() {
        simpleArray.move(2, -1);
        expect(simpleArray[6] === "Han Solo").to.be.true;
    });
});


var objectArray = [{ name: "Han Solo", weapon: "blaster" }, { name: "Luke Skywalker", weapon: "lightsabre" }, { name: "Obi-Wan Kenobi", weapon: "lightsabre" }, { name: "Darth Vader", weapon: "lightsabre" }, { name: "Chewbacca", weapon: "bowcaster" }, { name: "C3P0" }, { name: "R2D2" }];


describe("Object array tests", function() {
    it("should move the robots to the front of the array", function() {
        objectArray.move(5, 0);
        objectArray.move(6, 1);
        expect(objectArray[0].name === "C3P0" && objectArray[1].name === "R2D2").to.be.true;
    });

    it("should move Han to the end, still with his blaster, via a negative number", function() {
        objectArray.move(2, -1);
        expect(objectArray[6].name === "Han Solo" && objectArray[6].weapon === "blaster").to.be.true;
    });
});

