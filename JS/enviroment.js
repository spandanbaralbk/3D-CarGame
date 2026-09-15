class Enviroment{
    constructor(scene){
        this.scene=scene;
        this.clouds=[];
        this.hills=[];
        this.decorations=[];
        this.buildings=[];  //array to store building objects
        this.magicGardenElements=[];
        this.currentStage=1;
        this.skyMaterial=null; //store sky material reference

        this.createSky();
        this.createHills();
        this.createBuildings(); //add building creations
        this.createDecorations();
        this.createMagicGarden();
    }
    
    createSky(){
        //create a large sphere for the sky
        const skyGeometry = new THREE.SphereGeometry(500,32,32);
        this.skyMaterial = new THREE.ShaderMaterial({
             uniforms:{
                topColor: {value: new THREE.Color(0x0077ff)},
                bottomColor: {value: new THREE.Color(0x87CEEB) },
                offset:{value:33},
                exponent: {value:0.6}
             },
             vertexShader:
             varying vec3 vWorldPosition;
             void main(){
                vec4 worldPosition=modelMatrix * vec4(CaretPosition,1.0);
                vWorldPosition = worldPosition.xyz;

             }




        })
    }



}