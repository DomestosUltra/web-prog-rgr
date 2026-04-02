(function (global) {
    var ReactionGame = global.ReactionGame = global.ReactionGame || {};
    ReactionGame.Domain = ReactionGame.Domain || {};

    function GameSession(config, cells) {
        this.config = config;
        this.cells = cells;
        this.expectedNumber = 1;
        this.mistakes = 0;
        this.remainingSeconds = config.timeLimitSeconds;
        this.status = "ready";
        this.startedAt = null;
        this.deadlineAt = null;
        this.clickedNumbers = {};
    }

    GameSession.prototype.start = function (startedAt) {
        this.status = "playing";
        this.startedAt = startedAt;
        this.deadlineAt = startedAt + (this.config.timeLimitSeconds * 1000);
    };

    GameSession.prototype.finish = function (status) {
        this.status = status;
    };

    GameSession.prototype.isFinished = function () {
        return this.status === "won" || this.status === "lost";
    };

    GameSession.prototype.getCompletedCount = function () {
        return this.expectedNumber - 1;
    };

    GameSession.prototype.getTotalAttempts = function () {
        return this.getCompletedCount() + this.mistakes;
    };

    GameSession.prototype.getAccuracy = function () {
        var totalAttempts = this.getTotalAttempts();

        if (totalAttempts === 0) {
            return 100;
        }

        return Math.round((this.getCompletedCount() / totalAttempts) * 100);
    };

    ReactionGame.Domain.GameSession = GameSession;
}(window));