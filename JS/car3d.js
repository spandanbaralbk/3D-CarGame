class Car3D{
    constructor(){
        this.mesh = new THREE.Group();
        this.speed = 0;
        this.distance = 0;
        this.steerRight = false;
        this.brake = false;
        this.accelerate = false;
    }
    update(){}
    setMouseSteering(){}
}