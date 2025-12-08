'use client'; // 👈 これ重要：ブラウザで動く機能（ボタンなど）を使う合図

import { useState } from 'react';

// 空港データのサンプル（後で増やせます）
const AIRPORTS = [
  { id: 1, name: '新千歳空港', region: '北海道' },
  { id: 2, name: '羽田空港', region: '関東' },
  { id: 3, name: '中部国際空港', region: '中部' },
  { id: 4, name: '伊丹空港', region: '関西' },
  { id: 5, name: '福岡空港', region: '九州' },
  { id: 6, name: '那覇空港', region: '沖縄' },
];

export default function Home() {
  // 収集した空港のIDを保存する箱
  const [collectedIds, setCollectedIds] = useState<number[]>([]);

  // チェックボックスを押した時の処理
  const toggleAirport = (id: number) => {
    if (collectedIds.includes(id)) {
      // 既にあったら削除（チェックを外す）
      setCollectedIds(collectedIds.filter((item) => item !== id));
    } else {
      // なかったら追加（チェックを入れる）
      setCollectedIds([...collectedIds, id]);
    }
  };

  // 進捗率の計算
  const progress = Math.round((collectedIds.length / AIRPORTS.length) * 100);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <main className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* ヘッダー部分 */}
        <div className="bg-red-600 p-6 text-white">
          <h1 className="text-2xl font-bold">✈️ JAL御翔印帳アプリ</h1>
          <p className="mt-2">収集状況: {collectedIds.length} / {AIRPORTS.length} 空港</p>
          
          {/* 進捗バー */}
          <div className="w-full bg-red-800 h-4 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-sm mt-1">{progress}% コンプリート</p>
        </div>

        {/* リスト部分 */}
        <div className="p-6">
          <div className="space-y-3">
            {AIRPORTS.map((airport) => (
              <div 
                key={airport.id} 
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  collectedIds.includes(airport.id) 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-red-200'
                }`}
                onClick={() => toggleAirport(airport.id)}
              >
                {/* チェックボックスの見た目 */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  collectedIds.includes(airport.id)
                    ? 'bg-red-500 border-red-500'
                    : 'border-gray-300'
                }`}>
                  {collectedIds.includes(airport.id) && (
                    <span className="text-white font-bold">✓</span>
                  )}
                </div>
                
                {/* 空港名 */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{airport.name}</h3>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {airport.region}
                  </span>
                </div>

                {/* スタンプ済みの表示 */}
                {collectedIds.includes(airport.id) && (
                  <span className="text-red-600 font-bold transform -rotate-12 border-2 border-red-600 px-2 py-1 rounded opacity-80">
                    済
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}