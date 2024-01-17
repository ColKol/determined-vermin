class SceneGameplay extends Phaser.Scene{
    constructor(){
        super("playGame")
    }

    preload ()
    {
        this.load.image('rat', 'sprites/rat3.png');
        this.load.image('ground', 'sprites/walls.jpg');
        this.load.image('cheese', 'sprites/cheese.png');
        this.load.image('spring', 'sprites/spring.jpg');
        this.load.image('dust', 'sprites/dust.png');

        this.load.image('trapSpring', 'sprites/trapSpring.png');
        this.load.image('trapGlue', 'sprites/trapGlue.jpg');

        this.load.image('ground2', 'platformpixel.png');

        this.load.image('glue', 'sprites/glue.png');

        this.canShoot = true;
    }

    create(){
        // platforms
        platforms = this.physics.add.staticGroup();

        //this.add.rectangle(0, 0, 800, 32, 0x6666ff).setOrigin(0, 0);
        
        platforms.create(0, 0, 'ground2').setScale(800, 32).setOrigin(0, 0).refreshBody();
        platforms.create(0, 0, 'ground2').setScale(32, 600).setOrigin(0, 0).refreshBody();
        platforms.create(0, 568, 'ground2').setScale(800, 32).setOrigin(0, 0).refreshBody();
        platforms.create(768, 0, 'ground2').setScale(32, 600).setOrigin(0, 0).refreshBody();
        

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        // player
        player = this.physics.add.sprite(100, 100, 'rat').setScale(playerSize/256);
        //player.body.setSize(playerSize, playerSize);

        player.setCollideWorldBounds(true);
        this.physics.add.collider(player, platforms);

        // rotate the vermin to face the mouse
        this.input.on('pointermove', function(pointer) {
            let target = Phaser.Math.Angle.BetweenPoints(player, pointer);
        });

        // cheese particle
        var cheeseParticle = this.add.particles(0, 0, 'cheese', {
            lifespan: 500,
            speed: { min: 200, max: 350 },
            scale: { start: 0.0625, end: 0 },
            rotate: { start: 0, end: 360 },
            gravityY: 200,
            emitting: false
        });

        var trapParticle = this.add.particles(0, 0, 'trapSpring', {
            lifespan: 500,
            speed: { min: 200, max: 350 },
            scale: { start: 0.0625, end: 0 },
            rotate: { start: 0, end: 360 },
            gravityY: 200,
            emitting: false
        });

        var ratParticle = this.add.particles(0, 0, 'rat', {
            lifespan: 500,
            speed: { min: 200, max: 350 },
            scale: { start: 0.1, end: 0 },
            rotate: { start: 0, end: 360 },
            gravityY: 200,
            emitting: false
        });

        var glueParticle = this.add.particles(0, 0, 'glue', {
            lifespan: 500,
            speed: { min: 200, max: 350 },
            scale: { start: 0.2, end: 0 },
            rotate: { start: 0, end: 360 },
            gravityY: 200,
            angle: { min: -100, max: -80 },
            emitting: false
        });

        // cheese group
        this.cheese = this.add.group();

        this.enemyBullet = this.add.group();

        // enemy groups
        this.traps = this.physics.add.group({
            classType: TrapSpring,
            classType: TrapGlue
        });

        /*
        this.trapGlue = this.physics.add.group({
            classType: TrapGlue
        });*/

        //this.physics.add.collider(player, this.traps);

        this.physics.add.collider(platforms, this.traps);
        this.physics.add.collider(this.traps, this.traps);

        new TrapSpring(this, 400, 250);
        new TrapSpring(this, 600, 400);

        new TrapGlue(this, 500, 600);
        new TrapGlue(this, 600, 600);

        //trap.body.setVelocity(100, 100);
        /*
        let trap = this.physics.add.sprite(256, 256, 'trap').setScale(0.5);

        trap.setCollideWorldBounds(true);
        this.physics.add.collider(trap, platforms);
        this.traps.add(trap);
        
        trap.body.setVelocity(100, 100);*/

        // destroy cheese when hit borders
        this.physics.add.overlap(this.cheese, platforms, function (cheese) {
            cheeseParticle.emitParticleAt(cheese.body.position.x, cheese.body.position.y, 4);
            cheese.destroy();
        });

        // cheese hits trap
        this.physics.add.overlap(this.cheese, this.traps, function (cheese, traps) {
            cheeseParticle.emitParticleAt(cheese.body.position.x, cheese.body.position.y, 4);
            cheese.destroy();

            traps.health -= 1;

            if (traps.health <= 0){
                trapParticle.emitParticleAt(traps.body.position.x, traps.body.position.y, 16);
                traps.destroy();
            }
        });

        // player touches mousetrap
        this.physics.add.overlap(player, this.traps, function (player, traps) {
            ratParticle.emitParticleAt(player.body.position.x, player.body.position.y, 16);
            playerDead = true;
            player.disableBody(true, true);
        });

        // glue hits wall
        this.physics.add.overlap(this.enemyBullet, platforms, function (bullet) {
            glueParticle.emitParticleAt(bullet.body.position.x, bullet.body.position.y, 4);
            bullet.destroy();
        });

        // glue hits player
        this.physics.add.overlap(this.enemyBullet, player, function (bullet) {
            glueParticle.emitParticleAt(bullet.body.position.x, bullet.body.position.y, 4);
            bullet.destroy();

            ratParticle.emitParticleAt(player.body.position.x, player.body.position.y, 16);
            playerDead = true;
            player.disableBody(true, true);
        });
    }

    update ()
    {
        const pointer = this.input.activePointer;
        const keys = this.input.keyboard.addKeys("W,A,S,D");

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

        // shoot cheese
        if (pointer.isDown && this.canShoot == true && playerDead == false){
            let cheeseBullet = this.physics.add.sprite(player.body.position.x + playerSize/2, player.body.position.y + playerSize/2, 'cheese').setScale(0.125);
            cheeseBullet.body.setSize(50, 50);
            cheeseBullet.angle = player.angle - 45;
            
            this.cheese.add(cheeseBullet);
            //this.physics.add.existing(cheeseBullet);
            //cheeseBullet.setCollideWorldBounds(true);

            let vector = new Phaser.Math.Vector2(pointer.x - player.x, pointer.y - player.y);
            vector.setLength(bulletSpeed);

            cheeseBullet.body.setVelocity(vector.x, vector.y);
            cheeseBullet.body.setAngularVelocity(bulletRotate);

            // set timer for shooting
            this.timedEvent = this.time.delayedCall(reloadTime, this.reloadCheese, [], this);
            this.canShoot = false;
        }

        this.cheese.getChildren().forEach(cheeseBullet  => {
            if(cheeseBullet.x >= config.width + 5 || cheeseBullet.x <= 0 - 5 || cheeseBullet.y <= 0 - 5 || cheeseBullet.y >= config.height + 5){
                cheeseBullet.destroy();
            }
        })

        //updateEnemyAngle(player, trap);

        for (var i =0; i < this.traps.getChildren().length; i++){
            var beams = this.traps.getChildren()[i];
            beams.update();
        }
    }

    reloadCheese ()
    {
        this.canShoot = true;
    }

    killPlayer(){
        ratParticle.emitParticleAt(player.body.position.x, player.body.position.y, 16);
        playerDead = true;
        player.disableBody(true, true);
    }
}

function updateAngle(game, view){
    const dx = game.input.activePointer.x - view.x;
    const dy = game.input.activePointer.y - view.y;
    const targetAngle = (360 / (2 * Math.PI)) * Math.atan2(dy, dx) - 90;

    view.angle = targetAngle;
}

// this is already implemented in the trap.js file
/*
function updateEnemyAngle(player, trap){
    const edx = player.body.position.x - trap.body.position.x;
    const edy = player.body.position.y - trap.body.position.y;
    const enemyTargetAngle = (360 / (2 * Math.PI)) * Math.atan2(edy, edx) - 90;

    //console.log(targetAngle);

    let vector = new Phaser.Math.Vector2(edx, edy);
    vector.setLength(enemySpeed);
    trap.body.setVelocity(vector.x, vector.y);
}*/

var platforms;
var player;

// sizes
const playerSize = 64;
const enemySize = 100;

// player variables
var playerSpeed = 500;
var playerRotateAngle = 20;
var playerRotateSpeed = 5;

var playerDead = false;

// bullet
var bulletSpeed = 1250;
var bulletRotate = 1500;
const reloadTime = 250;

// enemies
const trapSpringSpeed = 200;
const trapGlueSpeed = 64;
