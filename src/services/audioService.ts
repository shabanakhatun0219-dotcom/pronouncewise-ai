/**
 * Audio synthesis and recording service for PronounceAI
 */

export function speakText(
  text: string,
  accent: 'US' | 'UK' | 'AU' | 'HI' = 'US',
  rate: number = 1.0,
  onEnd?: () => void,
  langOverride?: string
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  window.speechSynthesis.cancel(); // Stop any active speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  let targetLang = langOverride || (accent === 'UK' ? 'en-GB' : accent === 'HI' ? 'hi-IN' : 'en-US');

  const matchedVoice = voices.find(v => v.lang.includes(targetLang) || v.lang.startsWith(targetLang.slice(0, 2)));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }
  utterance.lang = targetLang;

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export interface AudioRecorderState {
  isRecording: boolean;
  audioUrl?: string;
  analyserNode?: AnalyserNode;
  audioContext?: AudioContext;
  stopRecording: () => Promise<{ blob: Blob; url: string }>;
}

export async function startAudioRecording(
  onDataAvailable?: (analyser: AnalyserNode) => void
): Promise<AudioRecorderState> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const source = audioContext.createMediaStreamSource(stream);
  const analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 64;
  source.connect(analyserNode);

  if (onDataAvailable) {
    onDataAvailable(analyserNode);
  }

  const mediaRecorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  mediaRecorder.start(100);

  return {
    isRecording: true,
    analyserNode,
    audioContext,
    stopRecording: () => {
      return new Promise((resolve) => {
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          stream.getTracks().forEach(track => track.stop());
          if (audioContext.state !== 'closed') {
            audioContext.close();
          }
          resolve({ blob, url });
        };
        mediaRecorder.stop();
      });
    }
  };
}

// Speech recognition helper
export class SpeechRecognizer {
  private recognition: any = null;
  public isSupported: boolean = false;

  constructor(lang: string = 'en-US') {
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = lang;
        this.isSupported = true;
      }
    }
  }

  setLanguage(lang: string) {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  start(onResult: (transcript: string, isFinal: boolean) => void, onError?: (err: any) => void) {
    if (!this.recognition) {
      if (onError) onError('Speech recognition not supported in this browser environment');
      return;
    }

    this.recognition.onresult = (event: any) => {
      let transcript = '';
      let isFinal = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      onResult(transcript, isFinal);
    };

    this.recognition.onerror = (event: any) => {
      if (onError) onError(event.error);
    };

    try {
      this.recognition.start();
    } catch {
      // Already running
    }
  }

  stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }
}
