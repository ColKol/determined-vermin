const config = {
    type: Phaser.AUTO,
    width: 800, //window.innerWidth
    height: 600,
    backgroundColor: "RGB(255,255,255)",
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },

    scene: [SceneTitle, SceneGameplay]
};

const game = new Phaser.Game(config);