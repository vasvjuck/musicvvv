let currentAudio: HTMLAudioElement | null = null;
let currentSetPlaying: ((playing: boolean) => void) | null = null;

export function registerAndToggle(
    audio: HTMLAudioElement,
    setPlaying: (playing: boolean) => void
) {
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentSetPlaying?.(false);
    }

    if (currentAudio === audio) {
        currentAudio = null;
        currentSetPlaying = null;
        setPlaying(false);
        return;
    }

    currentAudio = audio;
    currentSetPlaying = setPlaying;
    setPlaying(true);
}