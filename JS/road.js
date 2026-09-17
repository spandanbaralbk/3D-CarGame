class Road{
    constructor(scene){
        this.scene = scene;
        this.roadLines = [];
        this.zebraCrossings=[];
        this.signs = [];// array to store sighn object
        this.createRoad();
        this.createSigns();
    }

    createRoad(){
        //road 
        const roadGeometry = new THREE.PlaneGeometry(10,1000,20,200);
        const roadMaterial = new THREE.MeshPhongMaterial({
            color : 0x8B8B8B , //Lighter gray for the road
            side: THREE.DoubleSide
        });

        this.road = new THREE.Mesh(roadGeometry , roadMaterial);
        this.road.rotation.x = -Math.PI / 2;
        this.road.position.z =0 ;
        this.scene.add (this.road);

        // create second road section for continuous scrolling
        this.road2 = new THREE.Mesh(roadGeometry , roadMaterial);
        this.road2.rotation.x = -Math.PI / 2
        this.road2.position.z = 1000;
        this.scene.add(this.road2);

        //create road lines
        this.createRoadLines();

        //add zebra crossings at regular intervals 
        this.createZebraCrossing(100) ; //first zebra crossing - moved closer to start
        this.createZebraCrossimg(600);  //second zebra crossing

        //add side barriers 
           const barrierGeometry = new THREE.BoxGeometry(0.5 , 1, 1000);
           const barrierMaterial = new THREE.MeshPhongMaterial ({ color : 0xE0E0E0 });  // Light gray barriers

           //first section barriers 
           this.leftBarrier = new THRE.Mesh(barrierGeometry , barrierMaterial);
           this.leftBarrier.position.set(-5.25, 0.5 , 0);
           this.scene.add(this.leftBarrier);

           this.rightBarrier= new THREE.Mesh (barrierGeometry ,  barrierMaterial);
           this.rightBarrier.position.set(5.25,0.5,0);
           this.scene.add(this.rightBarrier);

           // second section barriers 
           this.leftBarrier2= new THREE(barrierGeometry , barrierMaterial);
           this.leftBarrier2.position.set(-5.25 , 0.5 , 1000);
            this.scene.add(this.leftBarrier2);

            this.rightBarrier2=new THREE.Mesh(barrierGeometry, barrierMaterial);
            this.rightBarrier2.position.set( 5.25 , 0.5 , 1000);
            this.scene.add(this.rightBarrier2);

    }
        createRoadLines(){
            //create solid side lines 
              this.createSolidLine(-4.5, 0);      // Left solid line
        this.createSolidLine(4.5, 0);       // Right solid line
               this.createSolidLine(-4.5, 1000);// left solid line for second section
               this.createSolidLine(4.5,1000); //right solid line for second section

               // create dashed center lines
               this.createDashedLines(0,0) ; // first section
               this.createDashedLines(0,1000); // second section

        }

        createSolidLine(xOffset,zOffset){
            const lineGeometry = new THREE.PlaneGeometry(0.2,1000);
            const lineMaterial = new THREE.MeshPhongMaterial({
                color: 0xFFFFFF  ,
                side : THREE.DoubleSide
            });

            const line = new THREE.Mesh(lineGeometry , lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(xOffset , 0.01 , zOffset);
            this.scene.add(Line);
            this.roadLines.push(line);
        }
          createDashedLine(xOffset , zOffset) {
            const dashLength = 5; // longer dashes
            const gapLength = 3 ; //shorter gaps
            const totalLength = 1000; 
            const totalDashes = Math.floor(totalLength / (dashLength + gapLength));

            for ( let i = 0 ; i<totalDashes ; i++){
                const lineGeometry = new THREE.PlaneGeometry(0.2 , dashLength);
                const lineMaterial = new THREE.MeshPhongMaterial({
                    color : 0xFFFFFF,
                    side: THREE.DoubleSide
                });
                const dash = new THREE.Mesh (lineGeometry , lineMateial);
                dash.rotation.x = -Math.PI / 2 ;
                dash.position.set (
                    xOffset ,
                    0.01,
                    i * (dashLength + gapLength ) - totalLength / 2 + zOffset
                );
                this.scene.add(dash);
                this.roadLines.push(dash);
            }
          }
}
