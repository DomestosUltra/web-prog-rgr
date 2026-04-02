(function (global, $) {
    var ReactionGame = global.ReactionGame = global.ReactionGame || {};
    ReactionGame.UI = ReactionGame.UI || {};

    function GameView() {
        this.$boardSize = $("#board-size");
        this.$startButton = $("#start-button");
        this.$restartButton = $("#restart-button");
        this.$targetNumber = $("#target-number");
        this.$completedCount = $("#completed-count");
        this.$mistakeCount = $("#mistake-count");
        this.$timeRemaining = $("#time-remaining");
        this.$statusMessage = $("#status-message");
        this.$gameBoard = $("#game-board");
    }

    GameView.prototype.bind = function (handlers) {
        var self = this;

        this.$startButton.off("click.reactionGame").on("click.reactionGame", function () {
            handlers.onStart();
        });

        this.$restartButton.off("click.reactionGame").on("click.reactionGame", function () {
            handlers.onRestart();
        });

        this.$gameBoard.off("click.reactionGame").on("click.reactionGame", ".game-cell", function () {
            var selectedNumber = Number($(this).attr("data-number"));
            handlers.onCellClick(selectedNumber);
        });

        $(global).off("keydown.reactionGame").on("keydown.reactionGame", function (event) {
            if ((event.key === "Enter" || event.key === " ") && self.$startButton.is(":focus") && !self.$startButton.prop("disabled")) {
                handlers.onStart();
            }
        });
    };

    GameView.prototype.getBoardSize = function () {
        return Number(this.$boardSize.val());
    };

    GameView.prototype.renderInitialState = function () {
        this.$gameBoard
            .addClass("is-empty")
            .css("--grid-size", 4)
            .html('<div class="board-placeholder">Нажмите &laquo;Старт&raquo;, чтобы сгенерировать игровое поле.</div>');

        this.$targetNumber.text("-");
        this.$completedCount.text("0");
        this.$mistakeCount.text("0");
        this.updateTimer(0);
        this.showStatus("Выберите размер таблицы и начните новую игру.", "info");
        this.setControlsState(false);
    };

    GameView.prototype.renderGame = function (session) {
        var self = this;

        this.$gameBoard.empty().removeClass("is-empty").css("--grid-size", session.config.sideSize);

        session.cells.forEach(function (cell) {
            var $cell = $("<button>", {
                type: "button",
                "class": "game-cell",
                "data-number": cell.number,
                "aria-label": "Число " + cell.number,
                text: cell.number
            });

            $cell.css({
                color: cell.style.color,
                fontSize: cell.style.fontSize,
                fontWeight: 700
            });

            self.$gameBoard.append($cell);
        });

        this.updateStats(session);
        this.updateTimer(session.remainingSeconds);
    };

    GameView.prototype.updateStats = function (session) {
        var nextValue = session.isFinished() ? "-" : session.expectedNumber;

        this.$targetNumber.text(nextValue);
        this.$completedCount.text(session.getCompletedCount() + " / " + session.config.cellCount);
        this.$mistakeCount.text(String(session.mistakes));
    };

    GameView.prototype.updateTimer = function (remainingSeconds) {
        this.$timeRemaining.text(remainingSeconds + " сек");
    };

    GameView.prototype.markCellCorrect = function (selectedNumber) {
        this.getCellElement(selectedNumber)
            .addClass("is-correct")
            .prop("disabled", true);
    };

    GameView.prototype.flashWrongCell = function (selectedNumber) {
        var $cell = this.getCellElement(selectedNumber);

        $cell.removeClass("is-wrong");

        if ($cell.length > 0) {
            void $cell.get(0).offsetWidth;
            $cell.addClass("is-wrong");

            global.setTimeout(function () {
                $cell.removeClass("is-wrong");
            }, 320);
        }
    };

    GameView.prototype.showStatus = function (message, type) {
        this.$statusMessage
            .removeClass("status--info status--success status--warning status--error")
            .addClass("status--" + type)
            .text(message);
    };

    GameView.prototype.showResult = function (session) {
        var message;
        var type;

        if (session.status === "won") {
            message = "Победа. Вы нашли все числа без нарушения последовательности. Точность: " + session.getAccuracy() + "%. Осталось времени: " + session.remainingSeconds + " сек.";
            type = "success";
        } else {
            message = "Время вышло. Вы успели найти " + session.getCompletedCount() + " из " + session.config.cellCount + " чисел. Ошибок: " + session.mistakes + ".";
            type = "error";
        }

        this.updateStats(session);
        this.updateTimer(session.remainingSeconds);
        this.showStatus(message, type);
    };

    GameView.prototype.setControlsState = function (isPlaying) {
        this.$boardSize.prop("disabled", isPlaying);
        this.$startButton.prop("disabled", isPlaying);
        this.$restartButton.prop("disabled", !isPlaying);
    };

    GameView.prototype.getCellElement = function (selectedNumber) {
        return this.$gameBoard.find('.game-cell[data-number="' + selectedNumber + '"]');
    };

    ReactionGame.UI.GameView = GameView;
}(window, window.jQuery));