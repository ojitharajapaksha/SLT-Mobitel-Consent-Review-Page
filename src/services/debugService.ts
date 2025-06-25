import { partyService } from '../services/partyService';

interface DebugInfo {
  backendStatus: 'connected' | 'disconnected' | 'unknown';
  apiBaseUrl: string;
  individualsCount: number;
  organizationsCount: number;
  lastError: string | null;
}

export class DebugService {
  static async getDebugInfo(): Promise<DebugInfo> {
    const debugInfo: DebugInfo = {
      backendStatus: 'unknown',
      apiBaseUrl: 'http://localhost:3000',
      individualsCount: 0,
      organizationsCount: 0,
      lastError: null
    };

    try {
      // Test connection by fetching individuals
      const individuals = await partyService.getIndividuals();
      debugInfo.individualsCount = individuals.length;
      debugInfo.backendStatus = 'connected';
    } catch (error: any) {
      debugInfo.lastError = error.message;
      debugInfo.backendStatus = 'disconnected';
    }

    try {
      // Test organizations if individuals worked
      if (debugInfo.backendStatus === 'connected') {
        const organizations = await partyService.getOrganizations();
        debugInfo.organizationsCount = organizations.length;
      }
    } catch (error: any) {
      if (!debugInfo.lastError) {
        debugInfo.lastError = error.message;
      }
    }

    return debugInfo;
  }

  static logDebugInfo(debugInfo: DebugInfo) {
    console.group('🔍 Frontend-Backend Connection Debug');
    console.log('📡 Backend Status:', debugInfo.backendStatus);
    console.log('🌐 API Base URL:', debugInfo.apiBaseUrl);
    console.log('👤 Individuals Count:', debugInfo.individualsCount);
    console.log('🏢 Organizations Count:', debugInfo.organizationsCount);
    if (debugInfo.lastError) {
      console.error('❌ Last Error:', debugInfo.lastError);
    }
    console.groupEnd();
  }
}

// Auto-run debug on load in development
if (import.meta.env.DEV) {
  DebugService.getDebugInfo().then(DebugService.logDebugInfo);
}
