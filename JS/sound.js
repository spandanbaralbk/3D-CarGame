class SoundManager{
    constructor(){
        this.musicVolume =0.5;
        this.sfxVolume = 0.5;
        this.currentMusic = null;
        this.isPlaying = false;

        this.sounds = {
            engine:[1,0,440,.01,.1,4,0,0],
            crash:[2,0,160,.01,.3,.9,4,.1],
            brake:[1,.1,270,.05,.08,.09,1,1.5,.1],
            horn:[1,.05,220,.05,.2,.2,2,2,.2],
            point:[1,.05,900,.04,.02,0,0,2.1,.25],
            menu:[.5,.05,900,.04,.02,0,0,2.1,.25]
         };

         //background music definition using ZzFXM
         this.bachgroundMusic = {
            instruments:[
                [2,0,100,.05,.4,.3,2,0,0],
                [1.5,0,220,.05,.03,.15,0,.5,0],
                [1,.1,440,.05,.15,.1,1,1,0]
            ],
            patterns:[
                [//pattern 0 - intro
                    [0,1,36,0,1,0,0,1,43],
                    [1,.8,60,1,.8,64,1,.8,67],
                    [2,.5,48,2,.5,55,2,.5,52]
                ],
                [
                    //pattern 1- main
                    [0,1,38,0,1,0,0,1,45],
                    [1,.8,62,1,.8,65,1,.8,69],
                    [2,.5,50,2,.5,57,2,.5,54]
                ]
            ],
            sequence: [0,1,0,1]
         };
         this.initVolumeControls();
    }
       
    initVolumeControls(){
        const musicSlicer = document.getElementById('musicVolume');
        const sfxSlider = document.getElementById('sfxVolume');

        if(musicSlider){
            musicSlider.value = this.musicVolume * 100;
            musicSlicer.addEventListener('input',(e)=>{
                this.musicVolume = e.target.value / 100;
                if (this.currentMusic){
                    this.currentMusic.gain.value = this.musicVolume;
                }
            });
        }
        if(sfxSlider){
            sfxSlider.value = this.sfxVolume *100;
            sfxSlider.addEventListener('input',(e)=>{
                this.sfxVolume = e.target.value / 100;
            });
        }
    }

    async playSound(soundName){
        if(this.sounds[soundname]){
            const params = [...this.sounds[soundname]];
            params[0]*=this.sfxVolume;
            try{
                await zzfx(...params);
            }catch(error){
                console.error(`Failed to play sound ${soundname}:`,error);

            }
        }
    }
       async playMusic(){
        if(!this.isPlaying){
            try{
                const audioContext = getAudioContext();
                if (!audioContext) return;

                //ensure context is running 
                if (audioContext.state ==='suspend'){
                    await audioContext.resume();
                }
                 //generate the music
                 const musicData = zzfxm(...Object.values(this.backgroundMusic));

                 //create audio buffer
                 const buffer = audioContext.createBuffer(2,musicData[0].length,44100);

                 //set the audio data for both channels
                 buffer.getChannelData(0).set(musicData[0]);
                 buffer.getChannelData(1).set(musicData[1]);

                 //create and configure source node

                 const source = audioContext.createBufferSource();
                 const gainNode = audioContext.createGain();

                 source.buffer = buffer;
                 source.loop = true;

                 //connects nodes
                 source.connect(gainNode);
                 gainNode.connect(audioContext.destination);

                 //set volume
                 gainNode.gain.value = this.musicVolume;

                 //start playback
                 source.start();
                 this.currentMusic = gainNode;
                 this.isPlaying= true;
            } catch(error){
                console.error('failed to play music:',error);

            }
        }
       }

       stopMusic(){
        if(this.isPlaying && this.currentMusic){
            this.currentMusic.disconnect();
            this.currentMusic = null;
            this.isPlaying = false;
        }
       }

       toggleMusic(){
        if(this.isPlaying){
            this.stopMusic();
        } else {
            this.playMusic();
        }
       }

       //engine sound with pitch based on speed

       async playEngineSound(speed){
        
       }


    

    playSound(){}
    stopMusic(){}
    playCrashSound(){}
    playEngineSound(){}
}