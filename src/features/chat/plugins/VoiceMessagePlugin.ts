/**
 * Voice Message Plugin
 * 음성 메시지 녹음 및 재생
 */

export interface VoiceMessage {
  id: string;
  audioUrl: string;
  duration: number;
  waveform: number[]; // 파형 데이터 (시각화용)
  size: number;
}

export interface RecordingState {
  isRecording: boolean;
  duration: number;
  isPaused: boolean;
}

class VoiceMessagePlugin {
  private mediaRecorder: MediaRecorder | null;
  private audioChunks: Blob[];
  private stream: MediaStream | null;
  private startTime: number;
  private recordingTimer: number | null;
  private onDataAvailable?: (data: VoiceMessage) => void;
  private onStateChange?: (state: RecordingState) => void;

  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.startTime = 0;
    this.recordingTimer = null;
  }

  /**
   * 녹음 시작
   */
  async startRecording(
    onDataAvailable: (data: VoiceMessage) => void,
    onStateChange: (state: RecordingState) => void
  ): Promise<boolean> {
    try {
      // 마이크 권한 요청
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.onDataAvailable = onDataAvailable;
      this.onStateChange = onStateChange;
      this.audioChunks = [];

      // MediaRecorder 생성
      const options = { mimeType: 'audio/webm;codecs=opus' };
      this.mediaRecorder = new MediaRecorder(this.stream, options);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        await this.handleRecordingComplete();
      };

      // 녹음 시작
      this.mediaRecorder.start();
      this.startTime = Date.now();

      // 타이머 시작
      this.startTimer();

      this.notifyStateChange();
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  /**
   * 녹음 중지
   */
  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();

      // 스트림 정리
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }

      // 타이머 정리
      if (this.recordingTimer) {
        window.clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }
    }
  }

  /**
   * 녹음 일시정지
   */
  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.notifyStateChange();
    }
  }

  /**
   * 녹음 재개
   */
  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.notifyStateChange();
    }
  }

  /**
   * 녹음 취소
   */
  cancelRecording(): void {
    this.audioChunks = [];
    this.stopRecording();
  }

  /**
   * 현재 상태 가져오기
   */
  getState(): RecordingState {
    const duration = this.mediaRecorder
      ? (Date.now() - this.startTime) / 1000
      : 0;

    return {
      isRecording: this.mediaRecorder?.state === 'recording',
      duration,
      isPaused: this.mediaRecorder?.state === 'paused',
    };
  }

  /**
   * 녹음 완료 처리
   */
  private async handleRecordingComplete(): Promise<void> {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const duration = (Date.now() - this.startTime) / 1000;

    // 파형 데이터 생성 (간소화된 버전)
    const waveform = await this.generateWaveform(audioBlob);

    const voiceMessage: VoiceMessage = {
      id: `voice-${Date.now()}`,
      audioUrl,
      duration,
      waveform,
      size: audioBlob.size,
    };

    this.onDataAvailable?.(voiceMessage);
    this.audioChunks = [];
  }

  /**
   * 파형 데이터 생성
   */
  private async generateWaveform(audioBlob: Blob): Promise<number[]> {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const rawData = audioBuffer.getChannelData(0);
      const samples = 50; // 50개의 샘플
      const blockSize = Math.floor(rawData.length / samples);
      const waveform: number[] = [];

      for (let i = 0; i < samples; i++) {
        const start = blockSize * i;
        let sum = 0;

        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[start + j]);
        }

        waveform.push(sum / blockSize);
      }

      // 정규화 (0-1)
      const max = Math.max(...waveform);
      return waveform.map(v => v / max);
    } catch (error) {
      console.error('Failed to generate waveform:', error);
      // 기본 파형 반환
      return Array(50).fill(0.5);
    }
  }

  /**
   * 타이머 시작
   */
  private startTimer(): void {
    this.recordingTimer = window.setInterval(() => {
      this.notifyStateChange();
    }, 100);
  }

  /**
   * 상태 변경 알림
   */
  private notifyStateChange(): void {
    this.onStateChange?.(this.getState());
  }

  /**
   * 마이크 권한 확인
   */
  async checkPermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return result.state === 'granted';
    } catch {
      // permissions API를 지원하지 않는 브라우저
      return true;
    }
  }
}

// Singleton instance
export const voiceMessagePlugin = new VoiceMessagePlugin();
export default VoiceMessagePlugin;
