class game {
    constructor() {
        thid.setupScene();
        this.setupEventListeners();
        this.gameState = 'start'; // start,playing,paused
        this.menuState = 'main'; //main,pause
        this.mouseControl = false;
        this.freeRideMode = false;
        this.radioPlaying = false;
        this.previewSpeed = 40; //constant speed for preview 
        this.currentStage = 1;
        this.currentLap = 1;
        this.maxLaps = 6;
        this.lapDistance = 1000; // Distance for each laps in meter
        this.lastLapDistance = 0;//track distance at last lap change

        //Initialize sound manager
        this.soundManager = new SoundManager();

        //Initialize radio
        this.radio = new radio();

        //scoring system 
        this.metersPerPoint = 50; //50 meters =1 point
        this.highScores = JSON.parse(localStorage.getItem('highscores') || '[]');

        //initialize game components
        this.aiTraffic = new AITrafficManager();
        this.aiTraffic = setScene(this.scene);//set the scene for ai traffic
        this.obstacles = new ObstacleManager();
        this.obstacles.setScene(this.scene);//set the scene for obstacles

        //start the game loop 
        this.lastUpdateTime = performance.now();
        this.animate();


        this.baseSpeed = 30; //base speed of the car
        this.currentSpeed = this.baseSpeed;
        this.speedEffects = []; //array to track active speed effects 

    }
}
