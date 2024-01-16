class SceneTitle extends Phaser.Scene{
    constructor(){
        super("bootGame")
    }

    preload() {
        this.load.image('ratFront', 'sprites/ratFront.jpg');
    }

    create(){
        var image = this.add.image(game.config.width / 2, game.config.height / 2, 'ratFront');
        //this.cameras.main.setBackgroundColor("#FFFFFF");

        this.add.text(game.config.width / 2, game.config.height / 2, "Determined Vermin", {font: "25px Arial", fill: "black"}).setOrigin(0.5)
        this.add.text(game.config.width / 2, game.config.height / 2 + 25, "Click to Play", {font: "12.5px Arial", fill: "black"}).setOrigin(0.5)

        this.input.on('pointerdown', () => {
            this.scene.start("playGame");
        });
    }
}