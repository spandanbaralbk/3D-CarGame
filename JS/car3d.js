class Car3D{
    constructor(){
        this.mesh = new THREE.Group();

        // add wheel references
        this.wheelFL = null ; // front left wheel
        this.wheelFR = null ; // front right wheel 
        this.maxWheelTurn = Math.PI / 4 ; // 45 degrees maximum wheel turn for visible steering 
        this.wheelReturnSpeed = 0.15 ; // speed for wheel return 
        this.currentWheelAngle = 0 ; // track wheel angle seperately from steering 

        // add turn signal timing 
        this.turnSignalTimer = 0 ;
        this.turnSignalOn= false;
        this.lastTurnSignalUpdate = 0 ;
        this.turnSignalInterval = 500 ; //500ms blink intervel

        this.createCar();

        // initialize movement properties 
        this.speed=0;
        this.maxSpeed = 220 ; // increased max speed
        this.minSpeed = 0 ;

        // acceleration properties 
        this.acceleration = 0.3 ; // increased base acceleration 
        this.accelerationCurve = [// improved acceleration curve
            {maxSpeed : 60 , multiplier : 1.2 }, // 0 - 60 : enhanced acceleration 
            {maxSpeed : 120 , multiplier : 0.9}, // 60 - 120 strong acceleration
            {maxSpeed : 180 , multiplier : 0.6 }, // 120 - 180 : moderate acceleration
            {maxSpeed : 220 ,multiplier: 0.3  } // 180 -220 : light acceleration
                    ];

                    // braking properties 
                    this.baseBrakeForce = 0.5 ; // increased base brake force for better control
                    this.brakeCurve= [
                        {minSpeed : 180 , multiplier : 1.8},// above 180 : very strong brakes
                        {minSpeed : 120 , multiplier : 1.4},// 120 - 180 : strong brakes 
                        {minSpeed : 60  , multiplier : 1.1},// 60 - 120 : normal brakes
                        {minSpeed : 0   , multiplier : 0.9} // 0 - 60  : light brakes 

                    ];
                    this.brakeDeceleration = 0 ;
                    this.brakeTransitionTime = 150 ; // faster brake response 
                            this.brakeStartTime = 0;
        
        // Natural deceleration (air resistance simulation)
        this.deceleration = 0.08;  // Reduced base deceleration
        this.decelerationCurve = [  // Improved deceleration curve
            { minSpeed: 180, multiplier: 1.6 },  // Above 180: High resistance
            { minSpeed: 120, multiplier: 1.2 },  // 120-180: Moderate resistance
            { minSpeed: 60, multiplier: 0.8 },   // 60-120: Light resistance
            { minSpeed: 0, multiplier: 0.4 }     // 0-60: Very light resistance
        ];

        // Other properties
        this.distance = 0;
        this.steerLeft = false;
        this.steerRight = false;
        this.brake = false;
        this.accelerate = false;
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = 0;
        this.steerAngle = 0;
        this.maxSteerAngle = 5; // Adjusted for new lane width
        this.steerSpeed = 0.22; // Adjusted for smoother lane changes
        this.rotationFactor = 0.025; // Adjusted for better turning feel
        this.currentX = 0;
        this.laneWidth = 3.5; // Match AI vehicle lane width
        this.maxLaneDeviation = 4.5; // Maximum deviation from center (slightly more than one lane)

        // Set initial position
        this.mesh.position.set(0, 0, 0);

    }
    
}
