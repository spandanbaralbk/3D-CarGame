




'use strict';

//global audio context
const getAudioContext = () =>{
    if(!zzfxX){
        try{
            zzfxX = new (window.AudioContext || webkitAudioContext)();

        } catch(error){
            console.error('Failed to create AudioContext:',error);
            return null;
        }
    }
    return zzfxX;
}

//play sound
const zzfx = async (...z)=>{
    const audioContext = getAudioContext();
    if(!audioContext) return null;

    //ensure context is running
    if(audioContext.state ==='suspend'){
        try{
            await audioContext.resume();
        }catch(error){
            console.error('failed to resume AudioContext:',error);
            return null;
        }
    }

    return zzfxP(aafxG(...z));
};
// Play samples
const zzfxP = (...samples) => {
    const audioContext = getAudioContext();
    if (!audioContext) return null;

    try {
        const buffer = samples.length > 1 ? 
            _ => { samples = samples.concat(...samples.splice(1)), samples[0] = samples[0] || [] } :
            _ => 0;

        const node = audioContext.createBufferSource();
        const buffer2 = audioContext.createBuffer(samples.length, samples[0].length, 44100);
        
        samples.map((d,i) => buffer2.getChannelData(i).set(d));
        node.buffer = buffer2;
        node.connect(audioContext.destination);
        node.start();
        return node;
    } catch (error) {
        console.error('Failed to play audio:', error);
        return null;
    }
};

// Generate samples
const zzfxG = (
    // parameters
    volume = 1, randomness = .05, frequency = 220, attack = 0, sustain = 0,
    release = .1, shape = 0, shapeCurve = 1, slide = 0, deltaSlide = 0,
    pitchJump = 0, pitchJumpTime = 0, repeatTime = 0, noise = 0, modulation = 0,
    bitCrush = 0, delay = 0, sustainVolume = 1, decay = 0, tremolo = 0
) => {
    // init parameters
    let PI2 = Math.PI*2,
    sign = v => v>0?1:-1,
    startSlide = slide *= 500 * PI2 / 44100 / 44100,
    startFrequency = frequency *= (1 + randomness*2*Math.random() - randomness) * PI2 / 44100,
    b=[], t=0, tm=0, i=0, j=1, r=0, c=0, s=0, f, length;

  //scale by sample rate
  attack = attack*44100 +9;
  decay*=44100;
  sustain*=44100;
  release*=44100;
  delay*=44100;

  length = attack + decay + sustain +release +delay | 0; 
  
  try{
    //generate waveform
    for(;i< length;b[i++]=s){
        if(pitchJump && ++tm >=pitchJumpTime){
            frequency*=pitchJump;
            pitchJump=0;
        }
    }
  }     