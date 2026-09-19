            class Environment{
    constructor(scene){
        this.scene=scene;
        this.clouds=[];
        this.hills=[];
        this.decorations=[];
        this.buildings=[]; 
        this.magicGardenElements=[];
        this.currentStage=1;
        this.skyMaterial=null;

        this.createSky();
        this.createHills();
        this.createBuildings(); 
        this.createDecorations(); 
        this.createForestClusters();
        this.createMagicGarden();
    }
    //for before the review
   update(){}
   updateStage(){}

    createBuildings(){
       
    }

    createMagicGarden(){
        
    }
     
    createSky(){
       
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
                vec4 worldPosition=modelMatrix * vec4(position,1.0);
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
            side: THREE.BackSide

        });
        const sky = new THREE.Mesh(skyGeometry,this.skyMaterial);
        this.scene.add(sky);

        //create more visible clouds 
        for(let i=0;i<25;i++){ //increase number of clouds
          this.createCloud(
            Math.random() * 300-150,
            Math.random() * 30+130,  
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

         //create denser clouds

         for(let i=0;i<8;i++){ //more pieces per cloud
           const cloudPiece = new THREE.Mesh(cloudGeometry,cloudMaterial);
           cloudPiece.position.set(
            Math.random() * 10 -5,
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

    
     terrainFormula(x,z){
        const baseHeight=
        Math.sin(x * 0.02)* 12 + Math.sin(z*0.02)*10 + Math.sin(x*0.05+z*0.05)*8;

        //add smaller grasses
        const detail =
        Math.sin(x*0.1)*2*Math.sin(z*0.1)+ //small bumps
        Math.cos(x*0.08-z*0.08)*3;  //medium

        const distanceFromRoad =Math.abs(x);
        let heightMultiplier=1.0;

        if(distanceFromRoad>30){
           heightMultiplier = 1.0 +(distanceFromRoad - 30)*0.03;
        }

        let h=(baseHeight+detail)* heightMultiplier;

     
        if(distanceFromRoad<10){
           h*=(distanceFromRoad-5)/5;
           if(distanceFromRoad<5) h=0;
        }
        return h;
     }

  
     getHeightAt(x,z){
        const i = Math.min(2,Math.max(0,Math.floor((z+1000)/1000))); 
        const centerZ = i*1000 - 500;
        return -2 - (i*0.2) + this.terrainFormula(x, z - centerZ);
     }
     
     createHills(){
        const hillGeometry = new THREE.PlaneGeometry(1000,1000,150,150);
        const vertices = hillGeometry.attributes.position.array;

        //create rolling hills
        for(let i=0;i<vertices.length;i+=3){
            const x=vertices[i]; 
            const z = -vertices[i+1]; 

          
            vertices[i+2]=this.terrainFormula(x,z);
        }

        hillGeometry.computeVertexNormals();  

    

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
            flatShading: true
           })
        ];    


   
            
        for(let i=0;i<3;i++){
            const grassland = new THREE.Mesh(hillGeometry,grassMaterials[i%3]);
            grassland.rotation.x = -Math.PI / 2;
            grassland.position.z = i*1000 - 500;
            grassland.position.y = -2 - (i*0.2);
           

            this.scene.add(grassland);
            this.hills.push(grassland);
        }

      

        const groundGeometry = new THREE.PlaneGeometry(1000,1000);
        const groundMaterial = new THREE.MeshPhongMaterial({
         color: 0x2f3b1c,
         shininess:5,
         flatShading:true
        });

        const darkGround = new THREE.Mesh(groundGeometry,groundMaterial);
           darkGround.rotation.x = -Math.PI /2;
           darkGround.position.y = -2.1; 
           this.scene.add(darkGround);

          

           const distantHillsGeometry = new THREE.PlaneGeometry(2000,1000,50,50);
           const hillVertices = distantHillsGeometry.attributes.position.array;

             for(let i=0;i<hillVertices.length;i+=3){

              const x =hillVertices[i];
              const z =-hillVertices[i+1];  

             
              hillVertices[i+2]= 
              Math.sin(x*0.01)*30+
              Math.sin(z*0.01)*25+
              Math.sin(x*0.02+z*0.02)* 20;
             }    
            distantHillsGeometry.computeVertexNormals(); 

            //create distant hills 
                
             const distantHillsMaterial = new THREE.MeshPhongMaterial({
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

             //Add grass details
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

               patch.position.set(x,this.getHeightAt(x,z)+0.1,z); //FIX: follow terrain height instead of fixed 0.1
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
               (Math.random()>0.5?1:-1)*1.01, 
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
            const baseGeometry = new THREE.IcosahedronGeometry(size,1);

           
            for( let i=0;i<density*5;i++){
              const leaf = new THREE.Mesh(
                baseGeometry,
                [treeMaterials.lightGreen,treeMaterials.mediumGreen,treeMaterials.darkGreen][Math.floor(Math.random()*3)]
              );

        
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

            function createTreeTrunk(height,baseRadius,topRadius){
              const trunkGroup = new THREE.Group();

              //main trunk
              const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(topRadius,baseRadius,height,8),
                treeMaterials.trunk
              );

               trunk.position.y = height/2;
               trunkGroup.add(trunk);

               
               for(let i=0;i<8;i++){
                const barkPiece = new THREE.Mesh(
                  new THREE.BoxGeometry(0.2,height*0.3,0.1),
                  treeMaterials.bark
                );
                barkPiece.position.y = height * (0.3 +Math.random()*0.4);
                barkPiece.rotation.y= (Math.PI * 2 / 8)*i;
                barkPiece.position.x = Math.sin(barkPiece.rotation.y)*(baseRadius*0.9);
                barkPiece.position.z = Math.cos(barkPiece.rotation.y)*(baseRadius*0.9);
                trunkGroup.add(barkPiece);
               }

               return trunkGroup;
            }

            function createDetailedTree(type,scale=1){
              const tree = new THREE.Group();
              let trunkHeight, baseRadius, topRadius;

              switch(type){
                case 'pine':
                  trunkHeight = 8 * scale;
                  baseRadius = 0.4 *scale;
                  topRadius = 0.2 * scale;
              
                 
                   tree.add(createTreeTrunk(trunkHeight,baseRadius, topRadius));

                
                 for(let i=0;i<5;i++){
                  const layer = createLeafGroup (3* scale*(1-i*0.15),1.2);
                  layer.position.y = trunkHeight * (0.5 +i*0.15);
                  layer.scale.y = 1.5;
                  tree.add(layer);
                 }
                 break;

                 case 'oak':
                  trunkHeight = 6 * scale;
                  baseRadius = 0.5 * scale;
                  topRadius = 0.3 * scale;

                  //add trunk
                  tree.add(createTreeTrunk(trunkHeight,baseRadius,topRadius));

                  const crown = createLeafGroup(4*scale,1.5);
                  crown.position.y= trunkHeight + (2*scale);
                  tree.add(crown);

                  for(let i=0;i<3;i++){
                    const subCrown = createLeafGroup(3 * scale,1.2);
                    subCrown.position.y = trunkHeight + (1.5 * scale);
                    subCrown.position.x = (Math.random()-0.5)*2*scale;
                    subCrown.position.z = (Math.random()-0.5)*2*scale;
                    tree.add(subCrown);
                  }
                  break;

                  case 'birch':
                    trunkHeight = 10 * scale;
                    baseRadius = 0.3 * scale;
                    topRadius = 0.15 * scale;

                    tree.add(createTreeTrunk(trunkHeight,baseRadius,topRadius));

                    const birchCrown = createLeafGroup(2.5*scale,1);
                    birchCrown.position.y = trunkHeight *0.8;
                    birchCrown.scale.y = 2;
                    tree.add(birchCrown);

                  
                    for(let i=0;i<4;i++){
                      const subCrown = createLeafGroup(2*scale,0.8);
                      subCrown.position.y = trunkHeight* (0.6 +Math.random()*0.3);
                      subCrown.position.x = (Math.random()-0.5)*3*scale;
                      subCrown.position.z = (Math.random()-0.5)*3*scale;
                      tree.add(subCrown);
                    }
                    break;
                }
                return tree; 
            }

          
            this.createDetailedTree = createDetailedTree;
          }

          createForestClusters() {
            const forestClusters = [
              { x: -40, z: 0, radius: 20 }, 
              { x: 40, z: 200, radius: 25 },
              { x: -35, z: 400, radius: 20 },
              { x: 45, z: 600, radius: 35 },
              { x: -45, z: 800, radius: 30 }
            ];

            forestClusters.forEach(cluster => {
              const numTrees = Math.floor(cluster.radius * 0.8);
              for (let i = 0; i < numTrees; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * cluster.radius;
                const x = cluster.x + Math.cos(angle) * radius;
                const z = cluster.z + Math.sin(angle) * radius;

                const treeType = ['pine', 'oak', 'birch'][Math.floor(Math.random() * 3)];
                const scale = 0.8 + Math.random() * 0.4;
                const tree = this.createDetailedTree(treeType, scale);

                tree.rotation.y = Math.random() * Math.PI * 2;

                const tx = x + (Math.random() - 0.5) * 2;
                const tz = z + (Math.random() - 0.5) * 0.2;
                tree.position.set(
                  tx,
                  this.getHeightAt(tx, tz), //FIX: sit on the terrain instead of y = 0
                  tz
                );

                this.scene.add(tree);
                this.decorations.push(tree);
              }
            });

            for(let i=0;i<30;i++){
              const side= Math.random()>0.5?1:-1;
              const x = side * (Math.random()*15+25);
              const z = Math.random()*1000-500;

              const treeType = ['pine','oak','birch'][Math.floor(Math.random()*3)];
              const scale = 0.8 +Math.random()*0.4;
              const tree = this.createDetailedTree(treeType,scale); //FIX: was "Tree" but used as "tree"

              tree.rotation.y=Math.random()*Math.PI*2;
              tree.position.set(x,this.getHeightAt(x,z),z);

              this.scene.add(tree);
              this.decorations.push(tree);
            }
            const additionalCusters=[
              {x: -50,z: 300,radius: 15},
              {x:60, z:500,radius:20},
              {x:-40,z:700,radius:25}
            ];
            additionalCusters.forEach(cluster =>{
              const numTrees = Math.floor(cluster.radius*0.7);
              for (let i=0;i<numTrees;i++){
                const angle = Math.random()*Math.PI*2;
                const radius = Math.random()*cluster.radius;
                const x = cluster.x +Math.cos(angle)*radius;
                const z = cluster.z +Math.sin(angle)*radius;

                const treeType = ['pine','oak','birch'][Math.floor(Math.random()*3)];
                const scale = 0.6 + Math.random()*0.4;
                const tree= this.createDetailedTree(treeType,scale);

                tree.rotation.y = Math.random()* Math.PI*2;
                tree.position.set(x,this.getHeightAt(x,z),z);

                this.scene.add(tree);
                this.decorations.push(tree);
              }
            });
          } 
} 

  

      






