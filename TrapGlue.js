class TrapGlue extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y){
        super(scene, x, y, "trapGlue")

        scene.traps.add(this);
        scene.add.existing(this).setScale(enemySize/256);
        
        scene.physics.world.enableBody(this)

        this.body.setCollideWorldBounds(true);

        //const enemyguy = this.group.create(this.key)
        this.health = 2;
        //this.squirtRate = Math.random() * (1500 - 1000) + 1000;

        glueBullets = scene.physics;
        glueTime = scene.time;

        glueClass = scene;
    }

    preload(){
        this.canSquirt = true;
    }

    update(){
        const edx = player.body.position.x - this.body.position.x;
        const edy = player.body.position.y - this.body.position.y;
        //const enemyTargetAngle = (360 / (2 * Math.PI)) * Math.atan2(edy, edx) - 90;
    
        //console.log(targetAngle);
    
        let vector = new Phaser.Math.Vector2(edx, edy);
        vector.setLength(trapGlueSpeed);
        this.body.setVelocity(vector.x, vector.y);

        // glue bullet?

        if (this.canSquirt == false) {
            return;
        }

        let glueBullet = glueBullets.add.sprite(this.body.position.x, this.body.position.y, 'glue').setScale(0.25);
        glueBullet.body.setSize(50, 50);
        glueBullet.angle = player.angle - 45;

        glueClass.enemyBullet.add(glueBullet);

        //this.glueParticle.emitParticleAt(glueBullet.body.position.x, glueBullet.body.position.y, 4);
        
        //this.cheese.add(glueBullet);
        //this.physics.add.existing(cheeseBullet);
        //cheeseBullet.setCollideWorldBounds(true);

        let vectorProjectile = vector.setLength(bulletSpeed);
        //vector.setLength(bulletSpeed);

        glueBullet.body.setVelocity(vectorProjectile.x, vectorProjectile.y);
        glueBullet.body.setAngularVelocity(0);

        this.canSquirt = false;
        this.timedEvent = glueTime.delayedCall(Math.random() * (1000 - 100) + 100, this.reloadGlue, [], this);
    }

    reloadGlue ()
    {
        this.canSquirt = true;
    }
}

var glueBullets;
var glueClass;
var glueTime;
var squirtRate = 1000;
//console.log(squirtRate)