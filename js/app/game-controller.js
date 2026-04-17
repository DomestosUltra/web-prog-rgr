(function (global) {
    var ReactionGame = global.ReactionGame = global.ReactionGame || {};
    ReactionGame.App = ReactionGame.App || {};

    function GameController(view) {
        this.view = view;
        this.session = null;
        this.timerId = null;
        this.lastRenderedSecond = null;
    }

    GameController.prototype.initialize = function () {
        var self = this;

        this.view.bind({
            onStart: function () {
                self.startGame();
            },
            onRestart: function () {
                self.resetGame();
            },
            onCellClick: function (selectedNumber) {
                self.handleCellClick(selectedNumber);
            }
        });

        this.view.renderInitialState();
    };

    GameController.prototype.startGame = function () {
        var Domain = ReactionGame.Domain;
        var config = Domain.GameRules.createConfig(this.view.getBoardSize());
        var stylesByNumber = Domain.StyleGenerator.buildStyles(config.cellCount);
        var cells = Domain.BoardGenerator.buildCells(config, stylesByNumber);

        this.stopTimer();

        this.session = new Domain.GameSession(config, cells);
        this.session.start(Date.now());
        this.lastRenderedSecond = null;

        this.view.renderGame(this.session);
        this.view.showStatus("Игра началась. Сначала найдите число 1.", "info");
        this.view.setControlsState(true);

        this.syncTime();
        this.timerId = global.setInterval(this.onTimerTick.bind(this), 200);
    };

    GameController.prototype.resetGame = function () {
        this.stopTimer();
        this.session = null;
        this.lastRenderedSecond = null;
        this.view.renderInitialState();
    };

    GameController.prototype.handleCellClick = function (selectedNumber) {
        var Domain = ReactionGame.Domain;
        var timeState;
        var result;

        if (!this.session) {
            return;
        }

        timeState = this.syncTime();

        if (timeState && timeState.type === "lost") {
            this.handleLoss();
            return;
        }

        result = Domain.GameRules.evaluateSelection(this.session, selectedNumber);

        if (result.type === "ignored" || result.type === "already-clicked") {
            return;
        }

        if (result.type === "wrong") {
            this.view.flashWrongCell(result.selectedNumber);
            this.view.updateStats(this.session);
            this.view.showStatus("Ошибка. Сейчас нужно нажать число " + this.session.expectedNumber + ".", "warning");
            return;
        }

        this.view.markCellCorrect(result.selectedNumber);
        this.view.updateStats(this.session);

        if (result.type === "won") {
            this.handleWin();
            return;
        }

        this.view.showStatus("Верно. Следующее число: " + this.session.expectedNumber + ".", "success");
    };

    GameController.prototype.onTimerTick = function () {
        var timeState = this.syncTime();

        if (!timeState) {
            this.stopTimer();
            return;
        }

        if (timeState.type === "lost") {
            this.handleLoss();
        }
    };

    GameController.prototype.syncTime = function () {
        var Domain = ReactionGame.Domain;
        var remainingMs;
        var remainingSeconds;
        var timeState;

        if (!this.session || this.session.isFinished()) {
            return null;
        }

        remainingMs = this.session.deadlineAt - Date.now();
        remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
        timeState = Domain.GameRules.syncTime(this.session, remainingSeconds);

        if (remainingSeconds !== this.lastRenderedSecond) {
            this.lastRenderedSecond = remainingSeconds;
            this.view.updateTimer(remainingSeconds);
        }

        return timeState;
    };

    GameController.prototype.handleWin = function () {
        this.stopTimer();
        this.view.showResult(this.session);
        this.view.setControlsState(false);
    };

    GameController.prototype.handleLoss = function () {
        this.stopTimer();
        this.view.showResult(this.session);
        this.view.setControlsState(false);
    };

    GameController.prototype.stopTimer = function () {
        if (this.timerId !== null) {
            global.clearInterval(this.timerId);
            this.timerId = null;
        }
    };

    ReactionGame.App.GameController = GameController;
}(window));