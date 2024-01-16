var platforms;
var player;

// player variables
var playerSpeed = 500;
var playerRotateAngle = 20;
var playerRotateSpeed = 5;

var bulletSpeed = 1250;
var bulletRotate = 1500;

var enemySpeed = 100;

//var target;

function preload ()
{
    this.load.image('rat', 'sprites/rat3.png');
    this.load.image('trap', 'sprites/trap.png');
    this.load.image('ground', 'sprites/walls.jpg');
    this.load.image('cheese', 'sprites/cheese.png');

    this.load.image('ground2', 'platformpixel.png');
}

function create ()
{
    // platforms
    platforms = this.physics.add.staticGroup();

    //this.add.rectangle(0, 0, 800, 32, 0x6666ff).setOrigin(0, 0);

    /*
    platforms.create(0, 0, 'ground2').setScale(800, 50).setOrigin(0, 0).refreshBody();
    platforms.create(0, 0, 'ground2').setScale(50, 600).setOrigin(0, 0).refreshBody();
    platforms.create(0, 550, 'ground2').setScale(800, 50).setOrigin(0, 0).refreshBody();
    platforms.create(750, 0, 'ground2').setScale(60, 600).setOrigin(0, 0).refreshBody();
    */

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // player
    player = this.physics.add.sprite(100, 100, 'rat').setScale(0.75);
    player.body.setSize(75, 75);

    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // rotate the vermin to face the mouse
    this.input.on('pointermove', function(pointer) {
        target = Phaser.Math.Angle.BetweenPoints(player, pointer);
    });

    // cheese particle
    var emitter = this.add.particles(0, 0, 'cheese', {
        lifespan: 500,
        speed: { min: 200, max: 350 },
        scale: { start: 0.0625, end: 0 },
        rotate: { start: 0, end: 360 },
        gravityY: 200,
        emitting: false
    });

    // cheese group
    this.cheese = this.add.group();
    //this.physics.add.collider(trap, this.cheese);

    // enemy group
    
    this.traps = this.add.group();
    trap = this.physics.add.sprite(256, 256, 'trap').setScale(0.5);

    trap.setCollideWorldBounds(true);
    this.physics.add.collider(trap, platforms);
    this.traps.add(trap);
    
    trap.body.setVelocity(100, 100);

    //traps = this.physics.add.group();
    //this.physics.add.collider(traps, platforms);
    /*
    var bomb = traps.create(16, 16, 'trap');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);*/
    
    // shoot cheese
    this.input.on('pointerdown', (pointer) => {
        let cheeseBullet = this.physics.add.sprite(player.body.position.x, player.body.position.y, 'cheese').setScale(0.125);
        cheeseBullet.body.setSize(50, 50);
        cheeseBullet.angle = player.angle - 45;
        
        this.cheese.add(cheeseBullet);
        //this.physics.add.existing(cheeseBullet);
        //cheeseBullet.setCollideWorldBounds(true);

        let vector = new Phaser.Math.Vector2(pointer.x - player.x, pointer.y - player.y);
        vector.setLength(bulletSpeed);

        cheeseBullet.body.setVelocity(vector.x, vector.y);
        cheeseBullet.body.setAngularVelocity(bulletRotate);
    });

    // destroy cheese when hit borders
    this.physics.add.overlap(this.cheese, platforms, function (cheese) {
        emitter.emitParticleAt(cheese.body.position.x, cheese.body.position.y, 4);
        cheese.destroy();
    });

    this.physics.add.overlap(this.cheese, this.traps, function (cheese) {
        emitter.emitParticleAt(cheese.body.position.x, cheese.body.position.y, 4);
        console.log("enemy taking damage!")
        cheese.destroy();
    });
}

function updateAngle(game, view){
    const dx = game.input.activePointer.x - view.x;
    const dy = game.input.activePointer.y - view.y;
    const targetAngle = (360 / (2 * Math.PI)) * Math.atan2(dy, dx) - 90;

    view.angle = targetAngle;
}

function updateEnemyAngle(player, trap){
    const edx = player.body.position.x - trap.body.position.x;
    const edy = player.body.position.y - trap.body.position.y;
    const enemyTargetAngle = (360 / (2 * Math.PI)) * Math.atan2(edy, edx) - 90;

    //console.log(targetAngle);

    let vector = new Phaser.Math.Vector2(edx, edy);
    vector.setLength(enemySpeed);
    trap.body.setVelocity(vector.x, vector.y);
}

function update ()
{
    var keys = this.input.keyboard.addKeys("W,A,S,D");
    
    //var cursors = this.input.keyboard.createCursorKeys();

    // horizontal movement
    if (keys.A.isDown)
    {
        player.setVelocityX(-playerSpeed);
    }
    else if (keys.D.isDown)
    {
        player.setVelocityX(playerSpeed);
    }
    else
    {
        player.setVelocityX(0);
    }

    // vertical movement
    if (keys.W.isDown)
    {
        player.setVelocityY(-playerSpeed);
    }
    else if (keys.S.isDown)
    {
        player.setVelocityY(playerSpeed);
    }
    else{
        player.setVelocityY(0);
    }

    updateAngle(this.game, player);

    this.cheese.getChildren().forEach(cheeseBullet  => {
        if(cheeseBullet.x >= config.width + 5 || cheeseBullet.x <= 0 - 5 || cheeseBullet.y <= 0 - 5 || cheeseBullet.y >= config.height + 5){
            cheeseBullet.destroy();
        }
    })

    updateEnemyAngle(player, trap);

    /*
    if(game.input.activePointer.leftButton.isDown = true){
        console.log("pee")
    }*/
}