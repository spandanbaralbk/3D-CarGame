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

        const darkGround = new THREE.Mesh(groundGeometry,groundMaterial);
           darkGround.rotation.x = -Math.PI /2;
           darkGround.position.y = -2.1;  //slightly below grass
           this.scene.add(darkGround);

           // Create distant hills with grass

           const distantHillsGeometry = new THREE.PlaneGeometry(2000,1000,50,50);
           const hillVertices = distantHillsGeometry.attributes.position.array;

             for(let i=0;i<hillVertices.length;i+=3){

              const x =hillVertices[i];
              const z =hillVertices[i+2];  

              //Create larger , smoother hills 
              hillVertices[i+1]=
              Math.sin(x*0.01)*30+
              Math.sin(z*0.01)*25+
              Math.sin(x*0.02+z*0.02)* 20;
             }    
            distantHillsGeometry.computeVertexNormals(); 

            //create distant hills with slightly darker grass
                
             const distantHillsMaterial = new THree.MeshPhongMaterial({
              color:0x1b4f2f,
              shininess:8,
              flatShading:true,
              opacity:0.9,
              transparent:true
             });

             const distantHills = new THREE.Mesh(distantHillsGeometry,distantHillsMaterial);
             distantHills.rotation.x= -Math.PI /2;
             distantHills.position.z = -500;
             distantHills.position.y = -10;
             this.scene.add(distantHills);
             this.hills.push(distantHills);

             //Add grass detail patches
             const grassPatchGeometry = new THREE.PlaneGeometry(2,2);
             const grassPatchMaterial = new THREE.MeshPhongMaterial({
               color:0x8bc34a,
               shininess:5,
               transparent:true,
               opacity:0.9,
               side: THREE.DoubleSide
             });

             for(let i=0;i<500;i++){
               const patch = new THREE.Mesh(grassPatchGeometry,grassPatchMaterial);
               const x = (Math.random()-0.5)*1000;
               const z = Math.random() * 1000 - 500;


               //skip patches too close to the road
               if(Math.abs(x)<8) continue;

               patch.position.set(x,0.1,z);
               patch.rotation.x=-Math.PI/2;
               patch.rotation.z= Math.random() * Math.PI;
               patch.scale.set(
                
                  0.5+Math.random() * 1.5,
                  0.5 + Math.random()*1.5,
                  1

               );

               this.scene.add(patch);
               this.decorations.push(patch);
             }
        }


        createCow(){
         const cow = new THREE.Group();
         
         //body
         const bodyGeometry = new THREE.BoxGeometry(2,1.2,3);
         const bodyMaterial = new THREE.MeshPhongMaterial({color:0x4a4a4a}); //dark grey yall
      
          const body = new THREE.Mesh(bodyGeometry,bodyMaterial);

          body.position.y=1.5;
          cow.add(body);

          //Head
          const headGeometry = new THREE.BoxGeometry(0.8,0.8,1.2);
          const head = new THREE.Mesh(headGeometry,bodyMaterial);
          head.position.set(0,2.1,1.8);
          cow.add(head);

          //legs
          const legGeometry = new THREE.BoxGeometry(0.4,1.2,0.4);
          const legMaterial = new THREE.MeshPhongMaterial({color:0x333333}); 

          const positions =[
             [-0.7,0.6,1],
             [0.7,0.6,1],
             [-0.7,0.6,-1],
             [0.7,0.6,-1]
          ];

          positions.forEach(pos=>{
            const leg = new THREE.Mesh(legGeometry,legMaterial);
            leg.position.set(...pos);
            cow.add(leg);
          });

          const spotGeometry = new THREE.CircleGeometry(0.3,8);
          const spotMaterial = new THREE.MeshPhongMaterial({
            color:0x8b4513,
            side: THREE.DoubleSide
          });

          for (let i=0;i<5;i++){
            const spot = new THREE.Mesh(spotGeometry,spotMaterial);
            spot.rotation.y = Math.PI/2;
            spot.position.set(
               (Math.random()-0.5)*1.5,
               1.5 + (Math.random()-0.5)*0.5,
               (Math.random()-0.5)*2
            );
            cow.add(spot);
          }
           
          //tail
          const tailGeometry = new THREE.CylinderGeometry(0.1,0.05,1);
          const tail = new THREE.Mesh(tailGeometry,bodyMaterial);
            tail.position.set(0,2,-1.7);
            tail.rotation.x = Math.PI/4;
            cow.add(tail);

            return cow;
      }

          createDecorations(){
            const treeMaterials = {
                
              lightGreen : new THREE.MeshStandardMaterial({
                color:0x68c242,
                roughness:0.8,
                metalness:0.1
              }),
              mediumGreen: new THREE.MeshStandardMaterial({
                color: 0x2d5a27,
                roughness:0.8,
                metalness:0.1
              }),
              darkGreen: new THREE.MeshStandardMaterial({
                color:0x1a3409,
                roughness:0.8,
                metalness:0.1
              }),
              trunk: new THREE.MeshStandardMaterial({
                color: 0x3b2616,
                roughness: 0.9,
                metalness: 0.0
              }),
              bark: new THREE.MeshStandardMaterial({
                color:0x4a3728,
                roughness:1.0,
                metalness: 0.0
              })
  };
           function createLeafGroup(size,density){
            const group = new THREE.Group();
            const baseGeometry = new THREE.IsosahedronGeometry(size,1);

            //create multiple overlapping leaf sections
            for( let i=0;i<density*5;i++){
              const leaf = new THREE.Mesh(
                baseGeometry,
                [treeMaterials.lightGreen,treeMaterials.mediumGreen,treeMaterials.darkGreen][Math.floor(Math.random()*3)]
              );

               //random positioning within the group
               leaf.position.x = (Math.random()-0.5)* size;
               leaf.position.y = (Math.random()-0.5)*size*0.5;
               leaf.position.z = (Math.random()-0.5)* size;

               const scale = 0.5 + Math.random()*0.5;
               leaf.scale.set(scale,scale,scale);

               leaf.rotation.x = Math.random()*Math.PI;
               leaf.rotation.y = Math.random()* Math.PI;
               leaf.rotation.z = Math.random()* Math.PI;

               group.add(leaf);
            }
            return group;
             }


Create detailed tree components and foliage




          }






     }


