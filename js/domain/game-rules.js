(function (global) {
    var ReactionGame = global.ReactionGame = global.ReactionGame || {};
    ReactionGame.Domain = ReactionGame.Domain || {};

    function createConfig(sideSize) {
        var normalizedSide = parseInt(sideSize, 10);

        if (!normalizedSide || normalizedSide < 1) {
            normalizedSide = 4;
        }

        if (normalizedSide > 8) {
            normalizedSide = 8;
        }

        return {
            sideSize: normalizedSide,
            cellCount: normalizedSide * normalizedSide,
            timeLimitSeconds: Math.max(8, (normalizedSide * normalizedSide) * 2)
        };
    }

    function evaluateSelection(session, selectedNumber) {
        if (!session || session.status !== "playing") {
            return { type: "ignored" };
        }

        if (session.clickedNumbers[selectedNumber]) {
            return {
                type: "already-clicked",
                selectedNumber: selectedNumber,
                expectedNumber: session.expectedNumber
            };
        }

        if (selectedNumber !== session.expectedNumber) {
            session.mistakes += 1;

            return {
                type: "wrong",
                selectedNumber: selectedNumber,
                expectedNumber: session.expectedNumber
            };
        }

        session.clickedNumbers[selectedNumber] = true;
        session.expectedNumber += 1;

        if (selectedNumber === session.config.cellCount) {
            session.finish("won");

            return {
                type: "won",
                selectedNumber: selectedNumber,
                expectedNumber: session.expectedNumber
            };
        }

        return {
            type: "correct",
            selectedNumber: selectedNumber,
            expectedNumber: session.expectedNumber
        };
    }

    function syncTime(session, remainingSeconds) {
        if (!session || session.isFinished()) {
            return { type: "ignored" };
        }

        session.remainingSeconds = remainingSeconds;

        if (remainingSeconds <= 0) {
            session.finish("lost");

            return {
                type: "lost",
                remainingSeconds: 0
            };
        }

        return {
            type: "tick",
            remainingSeconds: remainingSeconds
        };
    }

    ReactionGame.Domain.GameRules = {
        createConfig: createConfig,
        evaluateSelection: evaluateSelection,
        syncTime: syncTime
    };
}(window));