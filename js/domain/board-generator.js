(function (global) {
    var ReactionGame = global.ReactionGame = global.ReactionGame || {};
    ReactionGame.Domain = ReactionGame.Domain || {};

    function createSequence(count) {
        var numbers = [];
        var index;

        for (index = 1; index <= count; index += 1) {
            numbers.push(index);
        }

        return numbers;
    }

    function shuffle(numbers) {
        var index;

        for (index = numbers.length - 1; index > 0; index -= 1) {
            var swapIndex = Math.floor(Math.random() * (index + 1));
            var currentValue = numbers[index];
            numbers[index] = numbers[swapIndex];
            numbers[swapIndex] = currentValue;
        }

        return numbers;
    }

    function buildCells(config, stylesByNumber) {
        var shuffledNumbers = shuffle(createSequence(config.cellCount));

        return shuffledNumbers.map(function (number, index) {
            return {
                number: number,
                row: Math.floor(index / config.sideSize),
                column: index % config.sideSize,
                style: stylesByNumber[number]
            };
        });
    }

    ReactionGame.Domain.BoardGenerator = {
        buildCells: buildCells
    };
}(window));