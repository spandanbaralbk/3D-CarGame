// ZzFXM (v2.0.3) - Zuper Zmall Zound Zynth Music Generator
// MIT License - Copyright 2019 Frank Force
// https://github.com/KilledByAPixel/ZzFX

'use strict';

const zzfxM = (instruments, patterns, sequence, BPM = 125) => {
    let instrumentParameters;
    let i;
    let j;
    let note;
    let sample;
    let patternChannel;
    let instrument;
    let attenuation;
    let outSampleOffset;
    let nextSampleOffset;
    let leftChannelBuffer = [];
    let rightChannelBuffer = [];
    let sampleCache = {};
    const beatLength = Math.round(125 / BPM * 44100);
    const channelCount = Math.max(0, ...patterns.map(pattern => pattern.length));

    for (let channelIndex = 0; channelIndex < channelCount; channelIndex++) {
        outSampleOffset = 0;
        const panning = channelCount === 1 ? 0.5 : channelIndex / (channelCount - 1);

        sequence.forEach((patternIndex, sequenceIndex) => {
            // get pattern for current channel, use empty 1 note pattern if none found
            patternChannel = patterns[patternIndex][channelIndex] || [0, 0, 0];

            // pattern length
            const patternLength = patternChannel.length;
            if (patternLength < 3) return;

            const nextPattern = patterns[sequence[sequenceIndex + 1]]
                ? patterns[sequence[sequenceIndex + 1]][channelIndex] || patternChannel
                : patternChannel;
            nextSampleOffset = Math.round(beatLength * (nextPattern.length || patternLength) / patternLength);

            for (i = 0; i + 2 < patternLength; i += 3) {
                // get instrument and volume
                instrument = patternChannel[i];
                attenuation = patternChannel[i + 1];

                // get note
                note = patternChannel[i + 2];
                if(note) {
                    // get cached sample
                    let sampleKey = note + ',' + instrument + ',' + attenuation;
                    if(!sampleCache[sampleKey]) {
                        instrumentParameters = [...instruments[instrument]];
                        instrumentParameters[2] *= 2 ** ((note - 12) / 12);
                        sampleCache[sampleKey] = zzfxG(...instrumentParameters);
                    }
                    sample = sampleCache[sampleKey];

                    // add sample to buffer
                    for(j = 0; j < sample.length; j++) {
                        leftChannelBuffer[outSampleOffset + j] = (leftChannelBuffer[outSampleOffset + j] || 0) + sample[j] * attenuation * (1 - panning);
                        rightChannelBuffer[outSampleOffset + j] = (rightChannelBuffer[outSampleOffset + j] || 0) + sample[j] * attenuation * panning;
                    }
                }

                // update position
                outSampleOffset += nextSampleOffset;
            }
        });
    }

    // return stereo buffer
    return [leftChannelBuffer, rightChannelBuffer];
}; 