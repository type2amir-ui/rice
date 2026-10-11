// Source: Google Maps Platform Code Assist
import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import {
  MapPin,
  ExternalLink,
  Star,
  Clock,
  Phone,
  Navigation,
  ShieldCheck
} from 'lucide-react';

interface GoogleBusinessMapProps {
  cityName?: string;
  province?: string;
  customHeading?: string;
  customSubheading?: string;
  height?: string;
  showDetailsGrid?: boolean;
  className?: string;
}

const BUCHEKI_HQ_COORDS = { lat: 31.3117, lng: 73.6936 };

export const GoogleBusinessMap: React.FC<GoogleBusinessMapProps> = ({
  cityName,
  province = 'Punjab',
  customHeading,
  customSubheading,
  height = '360px',
  showDetailsGrid = true,
  className = ''
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const rawMapId = (import.meta as any).env?.VITE_GOOGLE_MAPS_MAP_ID as string | undefined;
  // DEMO_MAP_ID triggers "Unable to fetch configuration for mapId DEMO_MAP_ID" unless registered in GCP Cloud Console
  const hasValidMapId = Boolean(rawMapId && rawMapId.trim() !== '' && rawMapId !== 'DEMO_MAP_ID');
  const [activeTab, setActiveTab] = useState<'hq' | 'local'>('hq');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  // Default to reliable embed mode unless a valid custom Cloud Map ID is explicitly configured
  const [renderMode, setRenderMode] = useState<'sdk' | 'free-embed'>(
    apiKey && hasValidMapId ? 'sdk' : 'free-embed'
  );

  const buchekiQuery = 'Amir Rice Trader, Noor Galla Mandi, Bucheki, Nankana Sahib, Punjab, Pakistan';
  const localQuery = cityName
    ? `${cityName} Grain Market, ${province}, Pakistan`
    : buchekiQuery;

  const currentQuery = activeTab === 'hq' ? buchekiQuery : localQuery;
  const gmbDirectLink = 'https://share.google/Xog0BKr0oU1NiGIUL';
  const googleSearchLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentQuery)}`;

  const showSdkMap = Boolean(apiKey) && hasValidMapId && renderMode === 'sdk' && activeTab === 'hq';

  return (
    <div
      id="google-business-map-container"
      className={`bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs ${className}`}
    >
      {/* Google My Business Verified Header Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-emerald-950 p-4 sm:p-5 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Google Business Profile
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-white font-bold ml-1">4.9</span>
                <span className="text-neutral-400 text-[11px]">(185+ B2B Reviews)</span>
              </div>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
              {customHeading || (activeTab === 'hq' 
                ? 'Amir Rice Trader – Noor Galla Mandi Bucheki' 
                : `${cityName} Wholesale Mandi & Freight Terminal`)}
            </h3>

            <p className="text-xs text-neutral-300">
              {customSubheading || (activeTab === 'hq'
                ? 'Shop #4, Noor Galla Mandi, Bucheki, District Nankana Sahib, Punjab'
                : `Direct logistics freight corridor and commercial supply routes for ${cityName}, ${province}`)}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              id="btn-open-gmb-profile"
              href={gmbDirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3 text-neutral-200" />
            </a>
          </div>
        </div>

        {/* Tab switcher if cityName is provided */}
        {cityName && cityName.toLowerCase() !== 'bucheki' && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-800 text-xs">
            <span className="text-neutral-400 text-[11px] font-medium mr-1">Switch View:</span>
            <button
              onClick={() => setActiveTab('hq')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'hq'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-600" />
                Bucheki Sourcing HQ
              </span>
            </button>
            <button
              onClick={() => setActiveTab('local')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'local'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-500" />
                {cityName} Transit Terminal
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Map Frame with Map Toolbar */}
      <div className="relative bg-neutral-100 overflow-hidden" style={{ height }}>
        {showSdkMap && apiKey && rawMapId ? (
          <APIProvider apiKey={apiKey} region="PK" language="en">
            <Map
              defaultCenter={BUCHEKI_HQ_COORDS}
              defaultZoom={15}
              mapId={rawMapId}
              mapTypeId={mapType}
              gestureHandling="cooperative"
              disableDefaultUI={false}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              className="w-full h-full"
            >
              <AdvancedMarker
                position={BUCHEKI_HQ_COORDS}
                title="Hashir Rice Supplier – Noor Galla Mandi, Bucheki"
              >
                <Pin background="#047857" borderColor="#064e3b" glyphColor="#fbbf24" />
              </AdvancedMarker>
            </Map>
          </APIProvider>
        ) : (
          <iframe
            title={`Google Business Map: ${currentQuery}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(currentQuery)}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=14&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full filter contrast-[1.02]"
          />
        )}

        {/* Floating Quick Action Overlay on Map */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-1.5 shadow-md border border-neutral-200 flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                mapType === 'roadmap' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                mapType === 'satellite' ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Satellite
            </button>
            {apiKey && (
              <button
                onClick={() => setRenderMode(renderMode === 'sdk' ? 'free-embed' : 'sdk')}
                className="px-2 py-1 rounded-lg font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Switch between Google Maps JS SDK and 100% Free Unlimited Embed"
              >
                {renderMode === 'sdk' ? 'SDK Pin' : 'Free Embed'}
              </button>
            )}
          </div>

          <a
            href={googleSearchLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/95 backdrop-blur-md text-neutral-900 hover:text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-md border border-neutral-200 flex items-center gap-1.5 transition-all self-end"
          >
            <Navigation className="w-3 h-3 text-emerald-700" />
            <span>Get Directions</span>
          </a>
        </div>

        {/* Floating Pin Card in Bottom Left */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-neutral-200 shadow-md max-w-[280px] sm:max-w-xs text-xs">
          <div className="flex items-start gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900 shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="text-neutral-950 font-bold block text-[11px]">
                {activeTab === 'hq' ? 'Amir Rice Trader' : `${cityName} Freight & Depot Terminal`}
              </strong>
              <p className="text-[10px] text-neutral-600 leading-tight mt-0.5">
                {activeTab === 'hq'
                  ? 'Noor Galla Mandi, Bucheki (Nankana Sahib)'
                  : `Connecting daily truckloads directly to ${cityName}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Details Grid below map */}
      {showDetailsGrid && (
        <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Physical Mandi Address</span>
            </div>
            <p className="text-neutral-600 text-[11px]">
              Shop #4, Noor Galla Mandi, Bucheki, District Nankana Sahib, Punjab 39140.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Trading & Mandi Hours</span>
            </div>
            <p className="text-neutral-600 text-[11px]">
              Mon – Sat: 07:00 AM – 09:00 PM (PST)<br />
              Sunday: 24/7 WhatsApp Dispatch Desk<br />
              <span className="text-neutral-500 font-medium">Desk Incharge: Muhammad Amir Shahzad</span>
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Direct Sourcing Contact</span>
            </div>
            <p className="text-neutral-600 text-[11px] break-words">
              WhatsApp: <a href="https://wa.me/923338990883" target="_blank" rel="noopener noreferrer" className="text-emerald-800 font-bold hover:underline whitespace-nowrap">+92 333 8990883</a> / <a href="https://wa.me/923002861297" target="_blank" rel="noopener noreferrer" className="text-emerald-800 font-bold hover:underline whitespace-nowrap">+92 300 2861297</a><br />
              Email: <a href="mailto:info@hashirricesupplier.com" className="text-emerald-800 font-semibold hover:underline break-all">info@hashirricesupplier.com</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

