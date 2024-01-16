class TrapSpring extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y){
        super(scene, x, y, "trapSpring")

        scene.traps.add(this);
        scene.add.existing(this).setScale(enemySize/256);
        
        scene.physics.world.enableBody(this)

        this.body.setCollideWorldBounds(true);

        //const enemyguy = this.group.create(this.key)
        this.health = 1;
    }

    update(){
        const edx = player.body.position.x - this.body.position.x;
        const edy = player.body.position.y - this.body.position.y;
        const enemyTargetAngle = (360 / (2 * Math.PI)) * Math.atan2(edy, edx) - 90;
    
        //console.log(targetAngle);
    
        let vector = new Phaser.Math.Vector2(edx, edy);
        vector.setLength(trapSpringSpeed);
        this.body.setVelocity(vector.x, vector.y);
    }
}