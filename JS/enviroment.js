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
     
         const cloudGroup = new THREE.Group();

         //create denser cloud formations

         for(let i=0;i<8;i++){ //more pieces per cloud
           const cloudPiece = new THREE.Mesh(cloudGeometry,cloudMaterial);
           cloudPiece.position.set(
            MediaSourceHandle.random() * 10 -5,
            Math.random() *4 -2,
            Math.random() * 10 - 5
           );
     
            cloudPiece.scale.set(
              Math.random()*1.5 +1.0, //larger scale
              Math.random() *0.8 +0.6,
              Math.random()* 1.5 +1.0
            );

            cloudGroup.add(cloudPiece);           
         }
         
          cloudGroup.position.set(x,y,z);
          this.scene.add(cloudGroup);
          this.clouds.push(cloudGroup);
    }
     
     createHills(){
        const hillGeometry = new THREE.PlaneGeometry(1000,1000,150,150);
        const vertices = hillGeometry.attributes.position.array;

        //create rolling hills
        for(let i=0;i<vertices.length;i+=3){
            const x=vertices[i];
            const z = vertices[i+2];
         
            const baseHeight=
            Math.sin(x * 0.02)* 12 + Math.sin(z*0.02)*10 + Math.sin(x*0.05+z*0.05)*8;

             //add smaller grass mound details

             const detail =
             Math.sin(x*0.1)*2*Math.sin(z*0.1)+ //small bumps
             Math.cos(x*0.08-z*0.08)*3;  //medium

             const distanceFromRoad =Math.abs(x);
             let heightMultiplier=1.0;

             if(distanceFromRoad>30){
                heightMultiplier = 1.0 +(distanceFromRoad - 30)*0.03;

             }

             vertices[i+1]=(baseheight+detail)* heightMultiplier;

             //flatten area near the road
             if(distanceFromRoad<10){
                vertices[i+1]*=(distanceFromRoad-5)/5;
                if(distanceFromRoad<5) vertices[i+1]=0;
             }
        }

        hillGeometry.computeVertexNormals();

        //create grass materials with different shades

        const grassMaterials=[
           new THREE.MeshPhongMaterial({
            color:0x7cb342,
             shininess: 8,
             flatShading:true
           }),
           new THREE.MeshPhongMaterial({
            color:0x558b2f,
            shininess: 8,
            flatShading: true
           }),
           new THREE.MeshPhongMaterial({
            color:0x33691e,
            shininess:8,
            flatShading:true
           })
        ];


        //create grass sections
            
        for(let i=0;i<3;i++){
            const grassland = new THREE.Mesh(hillGeometry,grassMaterials[i%3]);
            grassland.rotation.x = -Math.PI / 2;
            grassland.position.z = i*1000 - 500;
            grassland.position.y = -2 - (i*0.2);
            grassland.position.z = (Math.random()-0.5)*0.1;

            this.scene.add(grassland);
            this.hills.push(grassland);
        }

        //Add darker base ground underneath

        const groundGeometry = new THREE.PlaneGeometry(1000,1000);
        const groundMaterial = new Three.MeshPhongMaterial({
         color: 0x2f3b1c,
         shininess:5,
         flatShading:true
        });







        }

     }


}