'use client'; // ← Next.jsでこのアプリを動かすための必須コード

import React, { useState, useEffect, useMemo, memo } from 'react';
import { Plane, Calendar, CheckCircle2, Award, Home, ListFilter, Search, X } from 'lucide-react';

// --- 以下、アプリのロジックは同じです ---

/**
 * JAL御翔印 対象空港データ (全55空港 + 緯度経度)
 */
const AIRPORTS_DATA = [
  // 北海道 (9)
  { id: 'CTS', name: '新千歳空港', region: '北海道', code: 'CTS', lat: 42.7752, lon: 141.6923 },
  { id: 'OKD', name: '札幌丘珠空港', region: '北海道', code: 'OKD', lat: 43.1163, lon: 141.3803 },
  { id: 'HKD', name: '函館空港', region: '北海道', code: 'HKD', lat: 41.7700, lon: 140.8222 },
  { id: 'KUH', name: '釧路空港', region: '北海道', code: 'KUH', lat: 43.0409, lon: 144.1932 },
  { id: 'MMB', name: '女満別空港', region: '北海道', code: 'MMB', lat: 43.8806, lon: 144.1644 },
  { id: 'AKJ', name: '旭川空港', region: '北海道', code: 'AKJ', lat: 43.6708, lon: 142.4476 },
  { id: 'OBO', name: '帯広空港', region: '北海道', code: 'OBO', lat: 42.7333, lon: 143.2170 },
  { id: 'RIS', name: '利尻空港', region: '北海道', code: 'RIS', lat: 45.2238, lon: 141.1856 },
  { id: 'OIR', name: '奥尻空港', region: '北海道', code: 'OIR', lat: 42.0723, lon: 139.4316 },

  // 東北 (6)
  { id: 'AOJ', name: '青森空港', region: '東北', code: 'AOJ', lat: 40.7342, lon: 140.6903 },
  { id: 'MSJ', name: '三沢空港', region: '東北', code: 'MSJ', lat: 40.7033, lon: 141.3685 },
  { id: 'AXT', name: '秋田空港', region: '東北', code: 'AXT', lat: 39.6156, lon: 140.2186 },
  { id: 'HNA', name: '花巻空港', region: '東北', code: 'HNA', lat: 39.4286, lon: 141.1350 },
  { id: 'SDJ', name: '仙台空港', region: '東北', code: 'SDJ', lat: 38.1397, lon: 140.9170 },
  { id: 'GAJ', name: '山形空港', region: '東北', code: 'GAJ', lat: 38.4119, lon: 140.3711 },

  // 関東 (2)
  { id: 'HND', name: '羽田空港', region: '関東', code: 'HND', lat: 35.5494, lon: 139.7798 },
  { id: 'NRT', name: '成田国際空港', region: '関東', code: 'NRT', lat: 35.7720, lon: 140.3929 },

  // 中部・北陸 (3)
  { id: 'NGO', name: '中部国際空港', region: '中部', code: 'NGO', lat: 34.8584, lon: 136.8046 },
  { id: 'KMQ', name: '小松空港', region: '中部', code: 'KMQ', lat: 36.3938, lon: 136.4077 },
  { id: 'KIJ', name: '新潟空港', region: '中部', code: 'KIJ', lat: 37.9558, lon: 139.1205 },

  // 近畿 (4)
  { id: 'ITM', name: '大阪国際空港(伊丹)', region: '近畿', code: 'ITM', lat: 34.7855, lon: 135.4382 },
  { id: 'KIX', name: '関西国際空港', region: '近畿', code: 'KIX', lat: 34.4320, lon: 135.2304 },
  { id: 'SHM', name: '南紀白浜空港', region: '近畿', code: 'SHM', lat: 33.6624, lon: 135.3621 },
  { id: 'TJH', name: '但馬空港', region: '近畿', code: 'TJH', lat: 35.5126, lon: 134.7865 },

  // 中国・四国 (9)
  { id: 'IZO', name: '出雲空港', region: '中国・四国', code: 'IZO', lat: 35.4136, lon: 132.8893 },
  { id: 'OKI', name: '隠岐空港', region: '中国・四国', code: 'OKI', lat: 36.1812, lon: 133.3235 },
  { id: 'OKJ', name: '岡山空港', region: '中国・四国', code: 'OKJ', lat: 34.7631, lon: 133.8550 },
  { id: 'HIJ', name: '広島空港', region: '中国・四国', code: 'HIJ', lat: 34.4361, lon: 132.9195 },
  { id: 'UBJ', name: '山口宇部空港', region: '中国・四国', code: 'UBJ', lat: 33.9300, lon: 131.2789 },
  { id: 'TKS', name: '徳島空港', region: '中国・四国', code: 'TKS', lat: 34.1328, lon: 134.6067 },
  { id: 'TAK', name: '高松空港', region: '中国・四国', code: 'TAK', lat: 34.2142, lon: 134.0156 },
  { id: 'KCZ', name: '高知空港', region: '中国・四国', code: 'KCZ', lat: 33.5461, lon: 133.6694 },
  { id: 'MYJ', name: '松山空港', region: '中国・四国', code: 'MYJ', lat: 33.8272, lon: 132.6997 },

  // 九州 (7)
  { id: 'FUK', name: '福岡空港', region: '九州', code: 'FUK', lat: 33.5859, lon: 130.4506 },
  { id: 'KKJ', name: '北九州空港', region: '九州', code: 'KKJ', lat: 33.8456, lon: 131.0350 },
  { id: 'OIT', name: '大分空港', region: '九州', code: 'OIT', lat: 33.4794, lon: 131.7370 },
  { id: 'NGS', name: '長崎空港', region: '九州', code: 'NGS', lat: 32.9169, lon: 129.9136 },
  { id: 'KMJ', name: '熊本空港', region: '九州', code: 'KMJ', lat: 32.8372, lon: 130.8549 },
  { id: 'KMI', name: '宮崎空港', region: '九州', code: 'KMI', lat: 31.8772, lon: 131.4489 },
  { id: 'KOJ', name: '鹿児島空港', region: '九州', code: 'KOJ', lat: 31.8034, lon: 130.7196 },

  // 離島・沖縄 (15)
  // 地図表示のため、南西諸島は実際の位置より調整して表示する場合があります
  { id: 'TNE', name: '種子島空港', region: '離島・沖縄', code: 'TNE', lat: 30.6094, lon: 130.9839 },
  { id: 'KUM', name: '屋久島空港', region: '離島・沖縄', code: 'KUM', lat: 30.3853, lon: 130.6593 },
  { id: 'ASJ', name: '奄美空港', region: '離島・沖縄', code: 'ASJ', lat: 28.4306, lon: 129.7126 },
  { id: 'KKX', name: '喜界空港', region: '離島・沖縄', code: 'KKX', lat: 28.3223, lon: 129.9280 },
  { id: 'TKN', name: '徳之島空港', region: '離島・沖縄', code: 'TKN', lat: 27.8361, lon: 128.8820 },
  { id: 'OKE', name: '沖永良部空港', region: '離島・沖縄', code: 'OKE', lat: 27.4253, lon: 128.7028 },
  { id: 'RNJ', name: '与論空港', region: '離島・沖縄', code: 'RNJ', lat: 27.0429, lon: 128.4019 },
  { id: 'OKA', name: '那覇空港', region: '離島・沖縄', code: 'OKA', lat: 26.1958, lon: 127.6459 },
  { id: 'UEO', name: '久米島空港', region: '離島・沖縄', code: 'UEO', lat: 26.3639, lon: 126.7132 },
  { id: 'MMY', name: '宮古空港', region: '離島・沖縄', code: 'MMY', lat: 24.7968, lon: 125.2811 },
  { id: 'ISG', name: '新石垣空港', region: '離島・沖縄', code: 'ISG', lat: 24.3964, lon: 124.2450 },
  { id: 'OGN', name: '与那国空港', region: '離島・沖縄', code: 'OGN', lat: 24.4673, lon: 123.0105 },
  { id: 'MMD', name: '南大東空港', region: '離島・沖縄', code: 'MMD', lat: 25.8456, lon: 131.2655 },
  { id: 'KTD', name: '北大東空港', region: '離島・沖縄', code: 'KTD', lat: 25.9458, lon: 131.3283 },
  { id: 'TRA', name: '多良間空港', region: '離島・沖縄', code: 'TRA', lat: 24.6542, lon: 124.6749 },
];

const REGION_COLORS = {
  '北海道': 'bg-blue-500 text-blue-50 border-blue-100',
  '東北': 'bg-green-500 text-green-50 border-green-100',
  '関東': 'bg-indigo-500 text-indigo-50 border-indigo-100',
  '中部': 'bg-teal-500 text-teal-50 border-teal-100',
  '近畿': 'bg-purple-500 text-purple-50 border-purple-100',
  '中国・四国': 'bg-orange-500 text-orange-50 border-orange-100',
  '九州': 'bg-red-500 text-red-50 border-red-100',
  '離島・沖縄': 'bg-pink-500 text-pink-50 border-pink-100',
};

// 地域ごとのラベル表示位置 (SVG内の座標)
// TypeScriptの型定義を追加して、alignが特定の値しか取らないことを明示します
const REGION_LABEL_POS: Record<string, { x: number; y: number; align: "start" | "middle" | "end" }> = {
  '北海道': { x: 500, y: 80, align: 'end' },
  '東北': { x: 530, y: 240, align: 'start' },
  '関東': { x: 520, y: 350, align: 'start' },
  '中部': { x: 380, y: 440, align: 'middle' },
  '近畿': { x: 320, y: 440, align: 'end' },
  '中国・四国': { x: 250, y: 440, align: 'end' },
  '九州': { x: 100, y: 400, align: 'end' },
  '離島・沖縄': { x: 230, y: 60, align: 'end' }, // 枠の右上
};

const STORAGE_KEY = 'jal-goshoin-app-data';

// サンプルデータ（主要空港を初期値として設定）
const SAMPLE_DATA = {
  'HND': { collected: true, date: '2023-10-01', memo: '第一弾！' },
  'CTS': { collected: true, date: '2023-11-15', memo: '雪が降っていた' },
  'ITM': { collected: true, date: '2024-01-05', memo: '' },
  'FUK': { collected: true, date: '2024-03-20', memo: 'ラーメン美味しかった' },
  'OKA': { collected: true, date: '2024-07-10', memo: '夏休み旅行' },
};

// --- Sub Components ---

const JapanMap = memo(({ progressData, onSelectAirport, regionStats }: any) => {
  // SVG ViewBox設定
  const WIDTH = 600;
  const HEIGHT = 500;

  // プロジェクション関数 (Lat/Lon -> x/y)
  const project = (lat: number, lon: number) => {
    
    // 沖縄・離島エリア (緯度32度未満) の特別処理
    if (lat < 32) {
       const latMin = 24.0;
       const latMax = 31.5;
       const lonMin = 122.5;
       const lonMax = 131.5;

       const yRatio = (lat - latMin) / (latMax - latMin);
       const xRatio = (lon - lonMin) / (lonMax - lonMin);

       return {
         x: 40 + (xRatio * 160),
         y: 230 - (yRatio * 180) // 緯度は北に行くほどyが小さくなる
       };
    }

    // 本土エリア用プロジェクション
    const y = HEIGHT - ((lat - 30) * (HEIGHT / 18)) + 20;
    const x = (lon - 128) * (WIDTH / 18);
    
    return { x, y };
  };

  return (
    <div className="relative w-full aspect-square bg-blue-50/30 rounded-3xl border border-blue-100 overflow-hidden">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-full drop-shadow-sm">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="1" dy="1" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 日本地図の簡易パス (装飾用) */}
        <g fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1">
           <path d="M420,130 L460,110 L510,120 L520,160 L480,200 L430,210 L410,170 Z" />
           <path d="M410,220 L420,210 L420,270 L380,300 L350,320 L280,330 L230,350 L200,340 L210,310 L250,300 L300,280 L350,250 L390,200 Z" />
           <path d="M220,360 L260,355 L270,380 L230,390 Z" />
           <path d="M160,350 L200,350 L210,390 L180,420 L150,390 Z" />
           
           {/* 離島エリアの枠線とラベル */}
           <rect x="20" y="20" width="220" height="230" rx="10" fill="white" fillOpacity="0.4" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
           <text x="30" y="45" fontSize="12" fill="#94a3b8" fontWeight="bold">沖縄・離島エリア</text>
        </g>
        
        {/* 地域ごとのスタッツ表示 (地図上に浮かべる) */}
        {Object.entries(regionStats).map(([region, data]: any) => {
          const pos = REGION_LABEL_POS[region as keyof typeof REGION_LABEL_POS];
          if (!pos) return null;
          
          const isComplete = data.collected === data.total;
          
          return (
            <g key={region}>
               {/* コネクタ線 (一部地域のみ) */}
               {region === '東北' && <line x1="430" y1="240" x2="525" y2="240" stroke="#cbd5e1" strokeDasharray="2 2" />}
               {region === '関東' && <line x1="410" y1="320" x2="515" y2="345" stroke="#cbd5e1" strokeDasharray="2 2" />}
               
               <text 
                 x={pos.x} 
                 y={pos.y} 
                 textAnchor={pos.align} 
                 className="text-xs font-bold"
                 fill={isComplete ? "#dc2626" : "#475569"}
                 fontSize="16"
                 fontWeight="900"
                 style={{ textShadow: "0px 0px 4px rgba(255,255,255,0.9)" }}
               >
                 {region}
               </text>
               <text 
                 x={pos.x} 
                 y={pos.y + 20} 
                 textAnchor={pos.align} 
                 fontSize="14"
                 fill="#64748b"
                 fontWeight="bold"
                 style={{ textShadow: "0px 0px 4px rgba(255,255,255,0.9)" }}
               >
                 <tspan fill={data.collected > 0 ? "#dc2626" : "#64748b"} fontSize="18" fontWeight="900">{data.collected}</tspan>
                 <tspan fontSize="12" fill="#94a3b8"> / {data.total}</tspan>
               </text>
            </g>
          );
        })}

        {/* 空港プロット */}
        {AIRPORTS_DATA.map((airport) => {
          const { x, y } = project(airport.lat, airport.lon);
          const isCollected = progressData[airport.id]?.collected;
          
          return (
            <g 
              key={airport.id} 
              onClick={() => onSelectAirport(airport)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              {isCollected && (
                <circle cx={x} cy={y} r="8" fill="rgba(220, 38, 38, 0.2)" />
              )}
              <circle 
                cx={x} 
                cy={y} 
                r={isCollected ? 5 : 3} 
                fill={isCollected ? "#dc2626" : "#94a3b8"} 
                stroke="white" 
                strokeWidth="1.5"
                filter="url(#shadow)"
              />
              {/* 主要空港または選択中の空港コードを表示 */}
              {['HND', 'ITM', 'CTS', 'FUK', 'OKA'].includes(airport.code) && (
                <text x={x} y={y - 8} textAnchor="middle" fontSize="10" fill="#475569" fontWeight="bold" style={{textShadow: "0px 0px 2px white"}}>
                  {airport.code}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="absolute bottom-2 right-4 text-[10px] text-gray-400">
        ※ 離島は位置を調整して表示しています
      </div>
    </div>
  );
});

const AirportDetailModal = ({ selectedAirport, progressData, onClose, toggleCollection, updateDate, updateMemo }: any) => {
  if (!selectedAirport) return null;
  const data = progressData[selectedAirport.id] || {};
  const isCollected = !!data.collected;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
      <div className="bg-white w-full max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl pointer-events-auto p-4 animate-slide-up sm:animate-fade-in m-0 sm:m-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${
              isCollected ? 'bg-red-600 border-red-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-400'
            }`}>
              <span className="font-black text-lg">{selectedAirport.code}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">{selectedAirport.name}</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{selectedAirport.region}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 bg-gray-100 rounded-full text-gray-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
            <button
              onClick={() => toggleCollection(selectedAirport.id)}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                isCollected 
                  ? 'bg-red-50 text-red-600 border border-red-200' 
                  : 'bg-gray-900 text-white shadow-lg'
              }`}
            >
              {isCollected ? (
                <><CheckCircle2 size={20} /> <span>収集済み！</span></>
              ) : (
                <span>収集する</span>
              )}
            </button>

            {isCollected && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3 animate-fade-in">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400">取得日</label>
                    <input
                      type="date"
                      value={data.date || ''}
                      onChange={(e) => updateDate(selectedAirport.id, e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-sm"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400">メモ</label>
                    <textarea
                      value={data.memo || ''}
                      onChange={(e) => updateMemo(selectedAirport.id, e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-sm min-h-[60px]"
                      placeholder="思い出を記録..."
                    />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ stats, progressData, onSelectAirport }: any) => (
  <div className="space-y-6 pb-24 animate-fade-in px-1">
    {/* Map Card */}
    <div className="bg-white p-4 rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase">Map View</h2>
        <div className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
            🔴 収集済 / ⚪ 未収集
        </div>
      </div>
      <JapanMap 
        progressData={progressData} 
        onSelectAirport={onSelectAirport} 
        regionStats={stats.byRegion}
      />
    </div>

    {/* Stats Card */}
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">達成率</h2>
            <p className="text-gray-400 text-sm">あと {stats.total - stats.collected} 空港で制覇！</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-red-600">{stats.percentage}</span>
            <span className="text-sm font-bold text-gray-400">%</span>
          </div>
      </div>
      
      {/* Region Grid (詳細) */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(stats.byRegion).map(([region, data]: any) => {
          const regionPercent = Math.round((data.collected / data.total) * 100);
          const styles = REGION_COLORS[region as keyof typeof REGION_COLORS] || 'bg-gray-500';
          const [bgColor] = styles.split(' ');
          
          return (
            <div key={region} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-bold text-gray-600">{region}</span>
                <span className="text-xs text-gray-400">{data.collected}/{data.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full ${bgColor}`} 
                  style={{ width: `${regionPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const ListView = ({ 
  listFilter, 
  setListFilter, 
  searchQuery, 
  setSearchQuery, 
  filteredAirports, 
  progressData, 
  toggleCollection, 
  updateDate, 
  updateMemo, 
  expandedId, 
  setExpandedId 
}: any) => {
  return (
    <div className="pb-24 space-y-4 px-1">
      {/* Search & Filter */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 sticky top-[60px] z-10 mx-1">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="空港名、コードで検索..."
            className="w-full bg-gray-50 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex p-1 bg-gray-100 rounded-xl">
          {['all', 'collected', 'uncollected'].map(filter => (
            <button
              key={filter}
              onClick={() => setListFilter(filter)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                listFilter === filter 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {filter === 'all' ? 'すべて' : filter === 'collected' ? '収集済' : '未収集'}
            </button>
          ))}
        </div>
      </div>

      {/* Airport Cards */}
      <div className="space-y-3">
        {filteredAirports.map((airport: any) => {
          const data = progressData[airport.id] || {};
          const isCollected = !!data.collected;
          const isExpanded = expandedId === airport.id;
          const styles = REGION_COLORS[airport.region as keyof typeof REGION_COLORS] || 'bg-gray-500';
          const [bgColor, textColor, borderColor] = styles.split(' ');

          return (
            <div 
              key={airport.id} 
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                isCollected ? 'border-red-100 shadow-md shadow-red-50' : 'border-gray-100 shadow-sm'
              }`}
            >
              <div 
                onClick={() => setExpandedId(isExpanded ? null : airport.id)}
                className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 ${
                    isCollected 
                      ? 'bg-red-600 border-red-600 text-white' 
                      : 'bg-white border-gray-100 text-gray-300'
                  }`}>
                    <span className="text-xl font-black leading-none">{airport.code}</span>
                    <span className="text-[9px] font-bold mt-0.5 opacity-80">JAL</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${textColor} ${borderColor} bg-white`}>
                        {airport.region}
                      </span>
                    </div>
                    <h3 className={`font-bold text-lg leading-tight ${isCollected ? 'text-gray-900' : 'text-gray-500'}`}>
                      {airport.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => toggleCollection(airport.id)} 
                    className={`p-2 rounded-full transition-colors ${
                      isCollected ? 'text-red-600 bg-red-50' : 'text-gray-200 hover:text-gray-400'
                    }`}
                  >
                    <CheckCircle2 size={28} fill={isCollected ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              <div className={`bg-gray-50/50 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-64' : 'max-h-0'}`}>
                <div className="p-4 pt-0 space-y-3 border-t border-dashed border-gray-200 mt-2 pt-4 mx-4 mb-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> 取得日
                    </label>
                    <input
                      type="date"
                      value={data.date || ''}
                      disabled={!isCollected}
                      onChange={(e) => updateDate(airport.id, e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-xs font-bold text-gray-400">メモ・思い出</label>
                    <textarea
                      placeholder={isCollected ? "旅の思い出を記録..." : "収集後に記録できます"}
                      disabled={!isCollected}
                      value={data.memo || ''}
                      onChange={(e) => updateMemo(airport.id, e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-100 min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Component ---

export default function JALStampApp() {
  const [progressData, setProgressData] = useState<any>({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const [listFilter, setListFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedAirport, setSelectedAirport] = useState<any>(null);

  // --- Initial Load ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Object.keys(parsed).length === 0) {
           setProgressData({});
        } else {
           setProgressData(parsed);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    } else {
      setProgressData(SAMPLE_DATA);
    }
    setIsLoaded(true);
  }, []);

  // --- Save on Change ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    }
  }, [progressData, isLoaded]);

  // --- Handlers ---
  const toggleCollection = (id: string) => {
    setProgressData((prev: any) => {
      const current = prev[id] || {};
      const nextState = !current.collected;
      const today = new Date().toISOString().split('T')[0];
      return {
        ...prev,
        [id]: {
          ...current,
          collected: nextState,
          date: nextState ? (current.date || today) : current.date,
        }
      };
    });
  };

  const updateDate = (id: string, date: string) => {
    setProgressData((prev: any) => ({
      ...prev,
      [id]: { ...prev[id], date: date }
    }));
  };

  const updateMemo = (id: string, memo: string) => {
    setProgressData((prev: any) => ({
      ...prev,
      [id]: { ...prev[id], memo: memo }
    }));
  };

  // --- Stats ---
  const stats = useMemo(() => {
    const total = AIRPORTS_DATA.length;
    const collected = AIRPORTS_DATA.filter(a => progressData[a.id]?.collected).length;
    const percentage = Math.round((collected / total) * 100);
    const byRegion: any = {};
    
    AIRPORTS_DATA.forEach(a => {
      if (!byRegion[a.region]) byRegion[a.region] = { total: 0, collected: 0 };
      byRegion[a.region].total++;
      if (progressData[a.id]?.collected) byRegion[a.region].collected++;
    });
    return { total, collected, percentage, byRegion };
  }, [progressData]);

  // --- Filter ---
  const filteredAirports = useMemo(() => {
    return AIRPORTS_DATA.filter(airport => {
      const isCollected = !!progressData[airport.id]?.collected;
      const matchesFilter = 
        listFilter === 'all' ? true :
        listFilter === 'collected' ? isCollected :
        !isCollected;
      const matchesSearch = 
        airport.name.includes(searchQuery) || 
        airport.code.includes(searchQuery.toUpperCase()) ||
        airport.region.includes(searchQuery);
      return matchesFilter && matchesSearch;
    });
  }, [progressData, listFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-red-600 text-white p-1.5 rounded-lg shadow-sm">
              <Plane size={18} fill="currentColor" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">
              JAL<span className="text-red-600">御翔印</span>LOG
            </h1>
          </div>
          
          {/* Header Stats (Right Top) - Modified for Larger Percentage */}
          <div className="flex items-center">
             <div className="flex items-center bg-white border border-gray-100 rounded-2xl px-3 py-1 shadow-sm space-x-3">
               {/* Percentage: Extra Large */}
               <div className={`flex items-baseline ${
                 stats.percentage === 100 ? 'text-yellow-600' : 'text-red-600'
               }`}>
                 <span className="text-3xl font-black leading-none tracking-tighter">{stats.percentage}</span>
                 <span className="text-sm font-bold ml-0.5">%</span>
               </div>
               
               {/* Divider */}
               <div className="w-px h-6 bg-gray-200"></div>

               {/* Fraction */}
               <div className="flex items-baseline space-x-0.5">
                  <span className="text-lg font-bold text-gray-700 leading-none">{stats.collected}</span>
                  <span className="text-xs font-bold text-gray-400">/{stats.total}</span>
               </div>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-3 py-4">
        {activeTab === 'dashboard' ? (
          <Dashboard 
            stats={stats} 
            progressData={progressData} 
            onSelectAirport={setSelectedAirport} 
          />
        ) : (
          <ListView 
            listFilter={listFilter}
            setListFilter={setListFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredAirports={filteredAirports}
            progressData={progressData}
            toggleCollection={toggleCollection}
            updateDate={updateDate}
            updateMemo={updateMemo}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
        <div className="max-w-md mx-auto flex justify-around items-center h-16 pb-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === 'dashboard' ? 'text-red-600' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <Home size={24} strokeWidth={activeTab === 'dashboard' ? 3 : 2} />
            <span className="text-[10px] font-bold">ホーム</span>
          </button>
          
          <div className="w-px h-8 bg-gray-100"></div>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              activeTab === 'list' ? 'text-red-600' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <ListFilter size={24} strokeWidth={activeTab === 'list' ? 3 : 2} />
            <span className="text-[10px] font-bold">空港リスト</span>
          </button>
        </div>
      </nav>
      
      {/* 選択時モーダル */}
      <AirportDetailModal 
        selectedAirport={selectedAirport}
        progressData={progressData}
        onClose={() => setSelectedAirport(null)}
        toggleCollection={toggleCollection}
        updateDate={updateDate}
        updateMemo={updateMemo}
      />

      <style>{`
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}