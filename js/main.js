(function (global, $) {
    $(function () {
        var ReactionGame = global.ReactionGame = global.ReactionGame || {};
        var view = new ReactionGame.UI.GameView();
        var controller = new ReactionGame.App.GameController(view);

        controller.initialize();
    });
}(window, window.jQuery));