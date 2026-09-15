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
             vertexShader: `
    varying vec3 vWorldPosition;
             void main(){
                vec4 worldPosition=modelMatrix * vec4(Position,1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
             }
          `,
            fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            varying vec3 vWorldPosition;
            void main(){
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor,topColor,max(pow(max(h,0.0),exponent),0.0)),1.0);
            }
            `,
            side: THREE.Backside

        });
        const sky = new THREE.Mesh(skyGeometry,this.skyMaterial);
        this.scene.add(sky);

        //create more visible clouds at higher altitude
        for(let i=0;i<25;i++){ //increased number of clouds
          this.createCloud(
            Math.random() * 300-150,
            Math.random() * 30+130,  //height between 130-160
            Math.random() *800-400
          );
        }
    }
  
     createCloud(x,y,z){
        const cloudGeometry = new THREE.SphereGeometry(5,8,8);
        const cloudMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.9 //increased opacity
        });
     }


}