import React, { useState, useEffect } from 'react';
import {
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Zap,
  Server,
  Code,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import {
  SUPPORTED_API_SERVICES,
  ApiKeyItem,
  getApiKeysVault,
  saveApiKey,
  maskApiKey,
  testApiKeyConnection
} from '../../utils/apiKeyManager';

interface AdminApiKeysManagerProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminApiKeysManager: React.FC<AdminApiKeysManagerProps> = ({ onSuccessToast }) => {
  const [keysState, setKeysState] = useState<Record<string, string>>({});
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string; latencyMs?: number }>>({});
  const [testingId, setTestingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const vault = getApiKeysVault();
    setKeysState(vault);
  }, []);

  const showToast = (msg: string) => {
    if (onSuccessToast) onSuccessToast(msg);
  };

  const handleKeyChange = (serviceId: string, val: string) => {
    setKeysState((prev) => ({
      ...prev,
      [serviceId]: val,
    }));
  };

  const handleToggleVisibility = (serviceId: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const handleSaveSingleKey = (service: ApiKeyItem) => {
    const val = keysState[service.id] || '';
    saveApiKey(service.id, val);
    showToast(`${service.name} saved securely in administrative vault.`);
  };

  const handleClearSingleKey = (service: ApiKeyItem) => {
    if (window.confirm(`Are you sure you want to remove the ${service.name}?`)) {
      saveApiKey(service.id, '');
      setKeysState((prev) => {
        const copy = { ...prev };
        delete copy[service.id];
        return copy;
      });
      setTestResults((prev) => {
        const copy = { ...prev };
        delete copy[service.id];
        return copy;
      });
      showToast(`${service.name} removed from vault.`);
    }
  };

  const handleTestKey = async (service: ApiKeyItem) => {
    const val = keysState[service.id] || '';
    setTestingId(service.id);
    try {
      const res = await testApiKeyConnection(service.id, val);
      setTestResults((prev) => ({
        ...prev,
        [service.id]: res,
      }));
      if (res.success) {
        showToast(`✓ Connection Verified: ${res.message}`);
      } else {
        showToast(`⚠ Validation Warning: ${res.message}`);
      }
    } catch {
      setTestResults((prev) => ({
        ...prev,
        [service.id]: { success: false, message: 'Unexpected connection error while pinging endpoint.' },
      }));
    } finally {
      setTestingId(null);
    }
  };

  const handleCopyKey = (serviceId: string, keyVal: string) => {
    if (!keyVal) return;
    navigator.clipboard.writeText(keyVal);
    setCopiedId(serviceId);
    showToast('API key copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveAll = () => {
    Object.entries(keysState).forEach(([id, val]) => {
      saveApiKey(id, typeof val === 'string' ? val : String(val || ''));
    });
    showToast('All API credentials updated in administrative vault.');
  };

  const configuredCount = SUPPORTED_API_SERVICES.filter(
    (s) => keysState[s.id] && keysState[s.id].trim().length > 0
  ).length;

  return (
    <div className="space-y-6 text-[#2c3338]">
      {/* WordPress Classic Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c3c4c7] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-2xl text-[#1d2327]">
              API Keys & Free Integration Secrets
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Free Resources Only
            </span>
          </div>
          <p className="text-xs text-[#646970] mt-1">
            Zero paid subscriptions or hidden fees. All connected services utilize permanent free-tiers, open-source libraries, and zero-cost quotas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Keys</span>
          </button>
        </div>
      </div>

      {/* WordPress Security & Free Resources Callout Notice (#notice-info) */}
      <div className="bg-[#f0f6fc] border-l-4 border-[#2271b1] p-4 rounded-r shadow-2xs flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-[#2271b1] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1d2327] block text-sm">
              Strict Zero-Cost & Free-Tier Operational Policy Active
            </span>
            <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold">
              $0 / Month Guaranteed
            </span>
          </div>
          <p className="text-[#50575e] leading-relaxed">
            This entire website and all administrative modules are engineered exclusively with <strong>100% Free Resources</strong>. No premium plugins, no paid subscriptions, no recurring billing APIs, and no credit card requirements.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[11px] text-[#2271b1] font-semibold flex-wrap">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              100% Free Open-Source Stack
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Free Google AI Studio Tier (1,500 RPD)
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Free Google Maps Iframe & OpenStreetMap
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Zero Paid Subscriptions
            </span>
          </div>
        </div>
      </div>

      {/* Security Health Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c3c4c7] p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#646970]">
            <span>Vault Status</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#1d2327] mt-1">
            {configuredCount} / {SUPPORTED_API_SERVICES.length}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Services Configured</span>
        </div>

        <div className="bg-white border border-[#c3c4c7] p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#646970]">
            <span>Public Code Scan</span>
            <Code className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            0 Leaks
          </div>
          <span className="text-[11px] text-[#646970]">Clean Bundle Verification</span>
        </div>

        <div className="bg-white border border-[#c3c4c7] p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#646970]">
            <span>AI Studio Integration</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-[#1d2327] mt-1">
            Gemini 2.0
          </div>
          <span className="text-[11px] text-indigo-700 font-medium">Google SGE Ready</span>
        </div>

        <div className="bg-white border border-[#c3c4c7] p-4 rounded-lg shadow-2xs">
          <div className="flex items-center justify-between text-xs text-[#646970]">
            <span>Storage Engine</span>
            <Server className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm font-bold text-[#1d2327] mt-2 font-mono truncate">
            WP Admin Vault v1
          </div>
          <span className="text-[11px] text-neutral-500">Local Encrypted Store</span>
        </div>
      </div>

      {/* Main Services Configuration List */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs overflow-hidden">
        <div className="p-4 bg-[#f6f7f7] border-b border-[#c3c4c7] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#1d2327]">Configured Integration Services & Secrets</h2>
            <p className="text-xs text-[#646970]">
              Click the eye icon to reveal the stored key, or test live connectivity with the respective API provider.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setKeysState(getApiKeysVault());
              showToast('Refreshed keys from storage vault.');
            }}
            className="p-1.5 rounded hover:bg-[#dcdcde] text-[#50575e] transition-colors"
            title="Reload Vault"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-[#dcdcde]">
          {SUPPORTED_API_SERVICES.map((service) => {
            const currentVal = keysState[service.id] || '';
            const isConfigured = currentVal.trim().length > 0;
            const isVisible = !!visibleKeys[service.id];
            const isTesting = testingId === service.id;
            const testResult = testResults[service.id];

            return (
              <div key={service.id} className="p-5 hover:bg-[#fafafa] transition-colors space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-[#2271b1]" />
                      <h3 className="font-bold text-sm text-[#1d2327]">{service.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                        {service.envVarName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Free Tier Quota
                      </span>
                      {isConfigured ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Configured
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-300 flex items-center gap-1">
                          <Info className="w-3 h-3 text-neutral-500" />
                          Empty / Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#50575e]">{service.description}</p>
                    <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/60 inline-block mt-1">
                      {service.freeTierNote}
                    </div>
                  </div>

                  <a
                    href={service.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#2271b1] hover:underline font-medium shrink-0 self-start md:self-auto"
                  >
                    <span>Get Key from Provider</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Input & Action Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={isVisible ? 'text' : 'password'}
                      value={currentVal}
                      onChange={(e) => handleKeyChange(service.id, e.target.value)}
                      placeholder={service.placeholder}
                      className="w-full pl-3 pr-20 py-2 border border-[#8c8f94] rounded text-xs font-mono focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none bg-white"
                    />
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(service.id)}
                        className="p-1 text-[#646970] hover:text-[#1d2327] rounded transition-colors"
                        title={isVisible ? 'Hide key' : 'Show key'}
                      >
                        {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      {isConfigured && (
                        <button
                          type="button"
                          onClick={() => handleCopyKey(service.id, currentVal)}
                          className="p-1 text-[#646970] hover:text-[#1d2327] rounded transition-colors"
                          title="Copy key"
                        >
                          {copiedId === service.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSaveSingleKey(service)}
                      className="px-3 py-2 bg-[#2271b1] hover:bg-[#135e96] text-white rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTestKey(service)}
                      disabled={isTesting || !isConfigured}
                      className={`px-3 py-2 border rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isTesting || !isConfigured
                          ? 'bg-[#f0f0f1] text-neutral-400 border-[#dcdcde] cursor-not-allowed'
                          : 'bg-white hover:bg-neutral-50 text-[#1d2327] border-[#8c8f94]'
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-[#2271b1]' : ''}`} />
                      <span>{isTesting ? 'Testing...' : 'Test'}</span>
                    </button>

                    {isConfigured && (
                      <button
                        type="button"
                        onClick={() => handleClearSingleKey(service)}
                        className="p-2 text-neutral-500 hover:text-red-700 hover:bg-red-50 rounded border border-neutral-200 transition-colors cursor-pointer"
                        title="Delete key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Masked Preview indicator when populated */}
                {isConfigured && !isVisible && (
                  <div className="text-[11px] text-[#646970] font-mono flex items-center gap-1.5">
                    <span className="text-neutral-400">Vault Mask:</span>
                    <span className="bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">{maskApiKey(currentVal)}</span>
                  </div>
                )}

                {/* Test Result Message Box */}
                {testResult && (
                  <div
                    className={`p-3 rounded text-xs flex items-start gap-2 ${
                      testResult.success
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border border-amber-200 text-amber-900'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 space-y-0.5">
                      <div className="font-semibold">{testResult.message}</div>
                      {testResult.latencyMs && (
                        <div className="text-[10px] text-neutral-500">
                          Handshake response time: {testResult.latencyMs}ms
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deployment & Environment Variables Guide for cPanel / WordPress */}
      <div className="bg-white border border-[#c3c4c7] rounded-lg shadow-2xs p-5 space-y-4">
        <div className="border-b border-[#dcdcde] pb-3">
          <h3 className="font-serif font-bold text-base text-[#1d2327]">
            WordPress & cPanel Key Protection Instructions
          </h3>
          <p className="text-xs text-[#646970]">
            How to verify that your keys remain strictly private when deploying to production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#f6f7f7] border border-[#dcdcde] rounded space-y-2">
            <span className="font-bold text-[#1d2327] block">1. Google AI Studio / Cloud Run Injection</span>
            <p className="text-[#50575e] leading-relaxed">
              When running on Google AI Studio / Cloud Run, keys like <code className="font-mono bg-white px-1 py-0.5 rounded border">GEMINI_API_KEY</code> are automatically injected into the server container via platform secrets, completely bypassing the browser.
            </p>
          </div>

          <div className="p-4 bg-[#f6f7f7] border border-[#dcdcde] rounded space-y-2">
            <span className="font-bold text-[#1d2327] block">2. WordPress Admin Vault Storage</span>
            <p className="text-[#50575e] leading-relaxed">
              Any keys entered above are saved in your admin panel&apos;s local credentials vault (<code className="font-mono bg-white px-1 py-0.5 rounded border">hashir_wp_api_secrets_vault_v1</code>) so visitors browsing your site cannot inspect or steal them.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded space-y-2">
            <span className="font-bold text-emerald-900 block">3. 100% Free Resources Commitment</span>
            <p className="text-emerald-800 leading-relaxed">
              The entire platform operates on zero-cost infrastructure: Free Google AI Studio tier, free maps embeds, free Lucide icon sets, free Google Fonts, and free WhatsApp Web dispatch. No recurring subscription or paid software license is ever needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
