
class Game {

    constructor() {

        this.setupScene();

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

        this.lastLapDistance = 0; //track distance at last lap change

        //Initialize sound manager
        this.soundManager = new SoundManager();

        //Initialize radio
        this.radio = new radio();

        //scoring system 

        this.metersPerPoint = 50; //50 meters =1 point

        this.highScores = JSON.parse(localStorage.getItem('highscores') || '[]');

        //initialize game components

        this.aiTraffic = new AITrafficManager();

        this.aiTraffic.setScene(this.scene);

        this.obstacles = new ObstacleManager();

        this.obstacles.setScene(this.scene); //set the scene for obstacles

        //start the game loop 

        this.lastUpdateTime = performance.now();

        this.baseSpeed = 30; //base speed of the car

        this.currentSpeed = this.baseSpeed;

        this.speedEffects = []; //array to track active speed effects 

        this.animate();

    }

    setupScene() {

        //three.js setup

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({

            antialias: true,

            powerPreference: "high-performance"

        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.getElementById('gameCanvas').appendChild(this.renderer.domElement);

        //add better lighting  for obstacles

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);

        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

        directionalLight.position.set(0, 10, 5);

        this.scene.add(directionalLight);

        //Add spotlight for better obstacle visibility

        const spotlight = new THREE.SpotLight(0xffffff, 0.5);

        spotlight.position.set(0, 10, 0);

        spotlight.target.position.set(0, 0, 10);

        spotlight.angle = Math.PI / 3;

        spotlight.penumbra = 0.5;

        spotlight.decay = 1;

        spotlight.distance = 50;

        this.scene.add(spotlight);

        this.scene.add(spotlight.target);

        //initialize game components

        this.enviroment = new Enviroment(this.scene);

        this.road = new Road(this.scene);

        this.car = new Car3D();

        this.scene.add(this.car.mesh);

        //set up camera position -higher  and further back for obstacle visibility

        this.camera.position.set(0, 4, -8);

        this.camera.lookAt(0, 1, 15); //look a bit up for a better perspective

    }

    setupEventListeners() {

        // Start screen listener for click

        document.getElementById('start-screen').addEventListener('click', () => {

            this.startGameIfReady();

        });

        //start screen listener for spacebar

        document.addEventListener('keydown', (e) => {

            if (e.code === 'Space' && this.gameState === 'start') {

                this.startGameIfReady();

            }

        });

        //mouse movement for steering 

        document.addEventListener('mousemove', (e) => {

            if (this.gameState === 'playing' && this.mouseControl) {

                const centerX = window.innerWidth / 2;

                const mouseX = e.clientX;

                const normalizedX = (mouseX - centerX) / (window.innerWidth / 4);

                this.car.setMouseSteering(normalizedX);

            }

        });

        //game controls

        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Menu buttons

        document.getElementById('startBtn')?.addEventListener('click', () => this.startGame());

        document.getElementById('resumeBtn')?.addEventListener('click', () => this.resumeGame());

        document.getElementById('settingsBtn')?.addEventListener('click', () => this.showSettings());

        document.getElementById('scoresBtn')?.addEventListener('click', () => this.showScores());

        document.getElementById('helpBtn')?.addEventListener('click', () => this.showHelp());

        document.getElementById('exitBtn')?.addEventListener('click', () => this.exitGame());

        document.getElementById('exitToMenuBtn')?.addEventListener('click', () => this.exitToMenu());

        document.getElementById('backToMenu')?.addEventListener('click', () => this.hideSettings());

        document.getElementById('backToMenuFromScores')?.addEventListener('click', () => this.hideScores());

        //responsive design 

        window.addEventListener('resize', () => {

            this.camera.aspect = window.innerWidth / window.innerHeight;

            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);

        });

        // Settings controls

        document.getElementById('mouseControl')?.addEventListener('change', (e) => {

            this.mouseControl = e.target.checked;

            // Reset steering when switching control modes

            this.car.steerLeft = false;

            this.car.steerRight = false;

            this.car.currentX = 0;

            this.car.mesh.position.x = 0;

            this.car.mesh.rotation.y = 0;

        });

        // Volume controls

        document.getElementById('musicVolume')?.addEventListener('input', (e) => {

            const volume = e.target.value / 100;

            // Implement music volume control

        });

        document.getElementById('sfxVolume')?.addEventListener('input', (e) => {

            const volume = e.target.value / 100;

            // Implement sound effects volume control

        });

    }

    handleKeyDown(e) {

        if (this.gameState === 'countdown') return; // Prevent controls during countdown

        if (this.gameState !== 'playing' && e.key.toLowerCase() !== 'r') return;

        switch (e.key.toLowerCase()) {//convert to lowercase to handle both cases

            case 'arrowleft':

            case 'a':

                if (!this.mouseControl) {

                    this.car.steerLeft = true;

                    this.car.steerRight = false; // Prevent simultaneous left/right steering

                }

                break;

            case 'arrowright':

            case 'd':

                if (!this.mouseControl) {

                    this.car.steerRight = true;

                    this.car.steerLeft = false; // Prevent simultaneous left/right steering

                }

                break;

            case 'arrowup':

            case 'w':

                this.car.accelerate = true;

                break;

            case 'arrowdown':

            case 's':

            case ' ': // Space

                this.car.brake = true;

                this.soundManager.playSound('brake');

                break;

            case 'r': // Restart game

                this.restartGame();

                break;

            case 'f':

                this.toggleFreeRide();

                break;

            case 'escape':

                if (this.gameState === 'playing') {

                    this.pauseGame();

                } else if (this.gameState === 'paused') {

                    this.resumeGame();

                }

                break;

        }

    }

    

    handleKeyUp(e) {
        if (this.gameState !== 'playing') return;

        switch(e.key.toLowerCase()) { // Convert to lowercase to handle both cases
            case 'arrowleft':
            case 'a':
                if (!this.mouseControl) {
                    this.car.steerLeft = false;
                }
                break;
            case 'arrowright':
            case 'd':
                if (!this.mouseControl) {
                    this.car.steerRight = false;
                }
                break;
            case 'arrowup':
            case 'w':
                this.car.accelerate = false;
                break;
            case 'arrowdown':
            case 's':
            case ' ': // Space
                this.car.brake = false;
                break;
        }
    }
        
      toggleFreeRide(){
        this.freeRideMode = !this.freeRideMode;
        if (this.freeRideMode){
            this.car.maxspeed=Infinity;
            document.getElementById('stage').textContent = 'Free Ride Mode';

        } else{
            this.car.maxspeed=200;
            const stageConfig= this.aiTraffic.stages[this.currentStage];
            document.getElementById('stage').textContent= `Stage ${this.currentStage}: ${stageConfig.name}`;
        }
      }
    

}

window.addEventListener('load', () => {

    new Game();

});

