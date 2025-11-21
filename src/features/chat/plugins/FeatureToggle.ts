/**
 * Feature Toggle
 * 기능 플래그 관리
 */

interface FeatureFlags {
  mention: boolean;
  markdown: boolean;
  linkPreview: boolean;
  fileUpload: boolean;
  voiceMessage: boolean;
  videoCall: boolean;
}

class FeatureToggle {
  private flags: FeatureFlags;

  constructor() {
    // 기본 활성화된 기능들
    this.flags = {
      mention: true,
      markdown: true,
      linkPreview: true,
      fileUpload: true,
      voiceMessage: false,
      videoCall: false,
    };

    // localStorage에서 설정 로드
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('chat_feature_flags');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.flags = { ...this.flags, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load feature flags:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('chat_feature_flags', JSON.stringify(this.flags));
    } catch (error) {
      console.error('Failed to save feature flags:', error);
    }
  }

  isEnabled(feature: keyof FeatureFlags): boolean {
    return this.flags[feature] ?? false;
  }

  enable(feature: keyof FeatureFlags): void {
    this.flags[feature] = true;
    this.saveToStorage();
  }

  disable(feature: keyof FeatureFlags): void {
    this.flags[feature] = false;
    this.saveToStorage();
  }

  toggle(feature: keyof FeatureFlags): boolean {
    this.flags[feature] = !this.flags[feature];
    this.saveToStorage();
    return this.flags[feature];
  }

  getAll(): Readonly<FeatureFlags> {
    return { ...this.flags };
  }
}

// Singleton instance
export const featureToggle = new FeatureToggle();
export default FeatureToggle;
