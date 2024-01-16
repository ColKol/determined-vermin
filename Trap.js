class Trap extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y){
        super(scene, x, y, "trap")

        scene.traps.add(this);
        scene.add.existing(this);
        
        scene.physics.world.enableBody(this)
        //this.body.setGravityY(660);
        this.body.setCollideWorldBounds(true);

        this.body.setVelocity(50, 50);

        //const enemyguy = this.group.create(this.key)
        this.health = 5;
    }
}