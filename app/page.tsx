'use client';

import { useState, useEffect } from 'react';
import { Plane, Map as MapIcon, List, Check, ChevronDown, ChevronUp } from 'lucide-react';

// --- 1. 型定義 (TypeScriptのエラーを防ぐための設計図) ---
type Region = '北海道' | '東北' | '関東' | '中部' | '近畿' | '中国・四国' | '九州' | '沖縄・離島';

interface Airport {
  id: number;
  name: string;
  code: string;
  region: Region;
}

// --- 2. データ (JAL御翔印の対象空港55ヶ所) ---
const AIRPORTS: Airport[] = [
  { id: 1, name: '新千歳空港', code: 'CTS', region: '北海道' },
  { id: 2, name: '丘珠空港', code: 'OKD', region: '北海道' },
  { id: 3, name: '女満別空港', code: 'MMB', region: '北海道' },
  { id: 4, name: '旭川空港', code: 'AKJ', region: '北海道' },
  { id: 5, name: '釧路空港', code: 'KUH', region: '北海道' },
  { id: 6, name: '帯広空港', code: 'OBO', region: '北海道' },
  { id: 7, name: '函館空港', code: 'HKD', region: '北海道' },
  { id: 8, name: '奥尻空港', code: 'OIR', region: '北海道' },
  { id: 9, name: '利尻空港', code: 'RIS', region: '北海道' },
  { id: 10, name: '青森空港', code: 'AOJ', region: '東北' },
  { id: 11, name: '三沢空港', code: 'MSJ', region: '東北' },
  { id: 12, name: '秋田空港', code: 'AXT', region: '東北' },
  { id: 13, name: '花巻空港', code: 'HNA', region: '東北' },
  { id: 14, name: '仙台空港', code: 'SDJ', region: '東北' },
  { id: 15, name: '山形空港', code: 'GAJ', region: '東北' },
  { id: 16, name: '羽田空港', code: 'HND', region: '関東' },
  { id: 17, name: '成田空港', code: 'NRT', region: '関東' },
  { id: 18, name: '新潟空港', code: 'KIJ', region: '中部' },
  { id: 19, name: '松本空港', code: 'MMJ', region: '中部' },
  { id: 20, name: '小松空港', code: 'KMQ', region: '中部' },
  { id: 21, name: '中部国際空港', code: 'NGO', region: '中部' },
  { id: 22, name: '伊丹空港', code: 'ITM', region: '近畿' },
  { id: 23, name: '関西空港', code: 'KIX', region: '近畿' },
  { id: 24, name: '南紀白浜空港', code: 'SHM', region: '近畿' },
  { id: 25, name: '但馬空港', code: 'TJH', region: '近畿' },
  { id: 26, name: '岡山空港', code: 'OKJ', region: '中国・四国' },
  { id: 27, name: '出雲空港', code: 'IZO', region: '中国・四国' },
  { id: 28, name: '隠岐空港', code: 'OKI', region: '中国・四国' },
  { id: 29, name: '広島空港', code: 'HIJ', region: '中国・四国' },
  { id: 30, name: '山口宇部空港', code: 'UBJ', region: '中国・四国' },
  { id: 31, name: '徳島空港', code: 'TKS', region: '中国・四国' },
  { id: 32, name: '高松空港', code: 'TAK', region: '中国・四国' },
  { id: 33, name: '高知空港', code: 'KCZ', region: '中国・四国' },
  { id: 34, name: '松山空港', code: 'MYJ', region: '中国・四国' },
  { id: 35, name: '福岡空港', code: 'FUK', region: '九州' },
  { id: 36, name: '北九州空港', code: 'KKJ', region: '九州' },
  { id: 37, name: '大分空港', code: 'OIT', region: '九州' },
  { id: 38, name: '長崎空港', code: 'NGS', region: '九州' },
  { id: 39, name: '熊本空港', code: 'KMJ', region: '九州' },
  { id: 40, name: '宮崎空港', code: 'KMI', region: '九州' },
  { id: 41, name: '鹿児島空港', code: 'KOJ', region: '九州' },
  { id: 42, name: '種子島空港', code: 'TNE', region: '九州' },
  { id: 43, name: '屋久島空港', code: 'KUM', region: '九州' },
  { id: 44, name: '喜界島空港', code: 'KKX', region: '九州' },
  { id: 45, name: '奄美大島空港', code: 'ASJ', region: '九州' },
  { id: 46, name: '徳之島空港', code: 'TKN', region: '九州' },
  { id: 47, name: '沖永良部空港', code: 'OKE', region: '九州' },
  { id: 48, name: '与論空港', code: 'RNJ', region: '九州' },
  { id: 49, name: '那覇空港', code: 'OKA', region: '沖縄・離島' },
  { id: 50, name: '久米島空港', code: 'UEO', region: '沖縄・離島' },
  { id: 51, name: '宮古空港', code: 'MMY', region: '沖縄・離島' },
  { id: 52, name: '多良間空港', code: 'TRA', region: '沖縄・離島' },
  { id: 53, name: '石垣空港', code: 'ISG', region: '沖縄・離島' },
  { id: 54, name: '与那国空港', code: 'OGN', region: '沖縄・離島' },
  { id: 55, name: '北大東空港', code: 'KTD', region: '沖縄・離島' }, // 例として追加
];

const REGIONS: Region[] = ['北海道', '東北', '関東', '中部', '近畿', '中国・四国', '九州', '沖縄・離島'];

export default function JALApp() {
  const [collectedIds, setCollectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [expandedRegion, setExpandedRegion] = useState<Region | null>('関東');

  // 保存データの読み込み（ブラウザ保存）
  useEffect(() => {
    const saved = localStorage.getItem('jal-stamp-collection');
    if (saved) setCollectedIds(JSON.parse(saved));
  }, []);

  // データ保存
  const toggleAirport = (id: number) => {
    let newIds;
    if (collectedIds.includes(id)) {
      newIds = collectedIds.filter(i => i !== id);
    } else {
      newIds = [...collectedIds, id];
    }
    setCollectedIds(newIds);
    localStorage.setItem('jal-stamp-collection', JSON.stringify(newIds));
  };

  // 進捗計算
  const progress = Math.round((collectedIds.length / AIRPORTS.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* 1. ヘッダー (固定) */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 text-white p-1.5 rounded-md">
            <Plane size={20} fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">JAL御翔印LOG</h1>
        </div>
        
        {/* 進捗表示 */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 shadow-inner">
            <span className="text-red-600 font-bold text-xl mr-1">{progress}</span>
            <span className="text-xs text-gray-500 mt-1">%</span>
            <div className="w-px h-4 bg-gray-300 mx-3"></div>
            <span className="text-sm font-medium text-gray-700">
              {collectedIds.length} <span className="text-gray-400">/ {AIRPORTS.length}</span>
            </span>
        </div>
      </header>

      {/* 2. メインコンテンツ */}
      <main className="max-w-3xl mx-auto p-4">
        
        {/* ビュー切り替えタブ */}
        <div className="flex bg-gray-200 p-1 rounded-lg mb-6">
          <button 
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
          >
            <MapIcon size={16} /> MAP VIEW
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
          >
            <List size={16} /> LIST VIEW
          </button>
        </div>

        {viewMode === 'map' ? (
          /* マップビュー (簡易版) */
          <div className="bg-white p-8 rounded-2xl shadow-sm border min-h-[400px] flex items-center justify-center flex-col text-center">
             <div className="bg-blue-50 p-6 rounded-full mb-4">
                <MapIcon size={48} className="text-blue-200" />
             </div>
             <h3 className="text-gray-500 font-bold">日本地図モード</h3>
             <p className="text-xs text-gray-400 mt-2">現在はリストモードをご利用ください。<br/>(地図機能は開発中です)</p>
          </div>
        ) : (
          /* リストビュー (地域別アコーディオン) */
          <div className="space-y-4">
            {REGIONS.map((region) => {
              const regionAirports = AIRPORTS.filter(a => a.region === region);
              const regionCollected = regionAirports.filter(a => collectedIds.includes(a.id)).length;
              const isExpanded = expandedRegion === region;

              return (
                <div key={region} className="bg-white rounded-xl shadow-sm border overflow-hidden transition-all">
                  <button 
                    onClick={() => setExpandedRegion(isExpanded ? null : region)}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 active:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-1.5 h-12 rounded-full ${regionCollected === regionAirports.length ? 'bg-red-500' : 'bg-gray-200'}`}></span>
                      <div className="text-left">
                        <h3 className="font-bold text-gray-800 text-lg">{region}</h3>
                        <p className="text-xs text-gray-400">収集: {regionCollected} / {regionAirports.length}</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
                  </button>

                  {isExpanded && (
                    <div className="border-t bg-gray-50 p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {regionAirports.map((airport) => {
                        const isCollected = collectedIds.includes(airport.id);
                        return (
                          <div 
                            key={airport.id}
                            onClick={() => toggleAirport(airport.id)}
                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                              isCollected 
                                ? 'bg-red-50 border-red-200 shadow-sm' 
                                : 'bg-white border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 border transition-colors ${
                              isCollected ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-300 text-transparent'
                            }`}>
                              <Check size={16} strokeWidth={4} />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-gray-400">{airport.code}</div>
                              <div className={`font-bold ${isCollected ? 'text-red-900' : 'text-gray-700'}`}>
                                {airport.name}
                              </div>
                            </div>
                            {isCollected && <span className="ml-auto text-xs font-bold text-red-500 border border-red-200 px-2 py-0.5 rounded bg-white">済</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}