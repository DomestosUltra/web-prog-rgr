(function (global) {
    var ReactionGame = global.ReactionGame = global.ReactionGame || {};
    ReactionGame.Domain = ReactionGame.Domain || {};

    function getFontSizeRange(cellCount) {
        if (cellCount <= 9) {
            return { min: 1.1, max: 2.55 };
        }

        if (cellCount <= 25) {
            return { min: 0.95, max: 2.2 };
        }

        return { min: 0.85, max: 1.9 };
    }

    function buildStyles(cellCount) {
        var stylesByNumber = {};
        var fontRange = getFontSizeRange(cellCount);
        var step = cellCount > 1 ? (fontRange.max - fontRange.min) / (cellCount - 1) : 0;
        var number;

        for (number = 1; number <= cellCount; number += 1) {
            var hue = Math.round(((number - 1) * 360) / cellCount);
            var saturation = 66 + ((number * 7) % 12);
            var lightness = 32 + ((number * 11) % 16);

            stylesByNumber[number] = {
                color: "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)",
                fontSize: (fontRange.min + (step * (number - 1))).toFixed(3) + "rem"
            };
        }

        return stylesByNumber;
    }

    ReactionGame.Domain.StyleGenerator = {
        buildStyles: buildStyles
    };
}(window));