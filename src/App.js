import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./App.css";
import "./i18n";
import AdPlaceholder from "./components/AdPlaceholder";

const LANGUAGES = [
  { code: "ko", label: "한국어", short: "KO" },
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
  { code: "ja", label: "日本語", short: "JA" },
  { code: "fr", label: "Français", short: "FR" },
];

function LangDarkRow({ lang, onLang, onDark, dark }) {
  return (
    <div className="lang-dark-row">
      <select
        className="lang-btn"
        value={lang}
        onChange={(e) => onLang(e.target.value)}
        style={{ 
          background: 'none',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '6px 8px',
          fontSize: '0.85rem',
          color: '#666',
          cursor: 'pointer',
          fontWeight: '500',
          width: '40px',
          height: '28px'
        }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.short}
          </option>
        ))}
      </select>
      <button
        className="dark-btn"
        onClick={onDark}
        style={{
          background: 'none',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '6px 8px',
          fontSize: '0.85rem',
          color: '#666',
          cursor: 'pointer',
          width: '40px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {dark ? (
            // 라이트 모드 아이콘 (태양)
            <circle cx="12" cy="12" r="5"/>
          ) : (
            // 다크 모드 아이콘 (달)
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          )}
        </svg>
      </button>
    </div>
  );
}

function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    const pref = localStorage.getItem('darkmode');
    if (pref === '1') return true;
    if (pref === '0') return false;
    return false; // 기본값을 라이트모드로 설정
  });
  React.useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
      localStorage.setItem('darkmode', '1');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkmode', '0');
    }
  }, [dark]);
  return (
    <button
      id="darkmode-toggle"
      style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}
      onClick={() => setDark(d => !d)}
      aria-label="다크모드 토글"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

function LandingPage({ onStart, t }) {
  return (
    <div className="landing-page">
      <DarkModeToggle />
      <h1 id="main-title">{t("title")}</h1>
      <div id="main-subtitle" style={{ color: '#6c63ff', fontWeight: 600, marginBottom: 12 }}>{t("subtitle")}</div>
      <div id="main-intro" className="main-intro" style={{ textAlign: 'left', width: '100%', display: 'block' }}>{t("intro")}</div>
      <div id="main-disclaimer" className="main-disclaimer" style={{ margin: '18px 0', fontSize: 15, color: '#888', textAlign: 'left', width: '100%', display: 'block' }}>
        <strong>{t("disclaimerLanding")}</strong>
      </div>
      <div id="main-important-label" style={{ fontWeight: 600, marginTop: 18 }}>{t("important")}</div>
      <ul id="main-important-list" style={{ margin: '8px 0 24px 0', paddingLeft: 18, color: '#555', fontSize: 15 }}>
        {(t("importantList", { returnObjects: true }) || []).map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
      <button className="submit-btn" style={{ width: 220, fontSize: 18, margin: '18px 0' }} onClick={onStart}>{t("start")}</button>
      
      {/* 테스트 이미지 다운로드 버튼 (개발용) */}
      <button 
        onClick={downloadTestImages}
        style={{
          marginTop: 16,
          padding: '8px 16px',
          background: '#f0f0f0',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer'
        }}
      >
        🎨 게이지 스타일 테스트 이미지 다운로드
      </button>
    </div>
  );
}

function ProgressBox({ current, total, t }) {
  return (
    <div
      style={{
        width: "100%",
        background: "#e9e9ff",
        borderRadius: 8,
        padding: "12px 0",
        marginBottom: 12,
        textAlign: "center",
        fontWeight: 600,
        color: "#6c63ff",
        fontSize: 15,
      }}
    >
      {t("progress", { current, total })}
    </div>
  );
}

function ProgressCard({ current, total, t }) {
  const percent = Math.round(((current + 1) / total) * 100);
  return (
    <div className="progress-card">
      <div className="progress-row">
        <span className="progress-label">{t("progressLabel")}</span>
        <span className="progress-index">{current + 1} / {total}</span>
      </div>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function getRedGradient(percent) {
  // 0%: #ffe5e5 (연한 붉은색), 100%: #b71c1c (짙은 붉은색)
  const start = { r: 255, g: 229, b: 229 };
  const end = { r: 183, g: 28, b: 28 };
  const r = Math.round(start.r + (end.r - start.r) * (percent / 100));
  const g = Math.round(start.g + (end.g - start.g) * (percent / 100));
  const b = Math.round(start.b + (end.b - start.b) * (percent / 100));
  return `rgb(${r},${g},${b})`;
}

// 디바이스 타입 감지 및 이미지 크기 설정 함수
function getImageDimensions() {
  // 항상 모바일 사이즈 반환 (1080x1920)
  return { width: 1080, height: 1920 };
}

// 통합 이미지 생성 함수 (모바일 비율로 최적화)
function generateTikTokImage(scorePercent, solution, t) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 모바일 최적화 크기 (세로형 비율)
  canvas.width = 1080;
  canvas.height = 1920;
  
  // 배경 - 웹페이지와 동일한 흰색 배경
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 상단 제목 (모바일에 최적화된 크기)
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 56px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t("resultTitle"), canvas.width/2, 140);
  
  // 부제목 (모바일에 최적화된 크기)
  ctx.fillStyle = '#6c63ff';
  ctx.font = 'bold 36px Arial, sans-serif';
  ctx.fillText(t("resultSubtitle"), canvas.width/2, 200);
  
  // 점수 원 그리기 (모바일에 최적화된 크기)
  const centerX = canvas.width / 2;
  const centerY = 500;
  const radius = 70; // 모바일에 최적화된 크기
  
  // 점수 원 배경 (웹페이지와 동일한 그라데이션)
  const circleBg = getRedGradient(scorePercent);
  ctx.fillStyle = circleBg;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // 그림자 효과 (웹페이지와 동일)
  ctx.shadowColor = circleBg + '55';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 12;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // 점수 텍스트 (모바일에 최적화된 크기)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${scorePercent}%`, centerX, centerY + 12);
  
  // 편견 지수 (모바일에 최적화된 크기)
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText(t("biasIndex"), centerX, centerY + radius + 50);
  
  // 분석 제목 (모바일에 최적화된 크기)
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(t("analysis"), centerX - 250, centerY + radius + 100);
  
  // 분석 결과 (모바일에 최적화된 크기)
  ctx.fillStyle = '#333333';
  ctx.font = '18px Arial, sans-serif';
  ctx.textAlign = 'left';
  
  const maxWidth = 500; // 모바일에 최적화된 텍스트 영역
  const analysisLines = wrapText(ctx, solution.analysis, maxWidth, 24);
  let y = centerY + radius + 130;
  
  analysisLines.forEach((line, index) => {
    ctx.fillText(line, centerX - 250, y + (index * 24));
  });
  
  y += analysisLines.length * 24 + 40;
  
  // 솔루션 제목 (모바일에 최적화된 크기)
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText(t("solutionsTitle"), centerX - 250, y);
  
  // 솔루션 팁들 (모바일에 최적화된 크기)
  if (solution.tips && solution.tips.length > 0) {
    ctx.fillStyle = '#333333';
    ctx.font = '18px Arial, sans-serif';
    
    const maxTips = Math.min(3, solution.tips.length);
    for (let i = 0; i < maxTips; i++) {
      const tip = solution.tips[i];
      const tipY = y + 40 + (i * 70); // 모바일에 최적화된 간격
      
      // 글머리 기호 (모바일에 최적화된 크기)
      ctx.fillText('•', centerX - 250, tipY);
      
      // 팁 텍스트 (개선된 줄바꿈으로 텍스트 깨짐 방지)
      const tipWords = tip.split(' ');
      let tipLine = '';
      let tipLineY = tipY;
      
      for (let j = 0; j < tipWords.length; j++) {
        const testTipLine = tipLine + tipWords[j] + ' ';
        const tipMetrics = ctx.measureText(testTipLine);
        const tipTestWidth = tipMetrics.width;
        
        if (tipTestWidth > 460 && j > 0) { // 모바일에 최적화된 텍스트 영역
          ctx.fillText(tipLine, centerX - 230, tipLineY);
          tipLine = tipWords[j] + ' ';
          tipLineY += 24;
        } else {
          tipLine = testTipLine;
        }
      }
      ctx.fillText(tipLine, centerX - 230, tipLineY);
    }
  }
  
  // 하단 디스클레이머 (모바일에 최적화된 크기)
  ctx.fillStyle = '#888888';
  ctx.font = '16px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t("disclaimer"), centerX, canvas.height - 100);
  
  return canvas.toDataURL('image/png');
}

// 텍스트 줄바꿈 헬퍼 함수
function wrapText(ctx, text, maxWidth, lineHeight) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// 동적 메타 태그 업데이트 함수
function updateMetaTags(scorePercent, imageDataUrl) {
  const dimensions = getImageDimensions();
  
  // Open Graph 메타 태그 업데이트
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogImageWidth = document.querySelector('meta[property="og:image:width"]');
  const ogImageHeight = document.querySelector('meta[property="og:image:height"]');
  
  if (ogTitle) ogTitle.setAttribute('content', `나의 인종차별적 성향 테스트 결과: ${scorePercent}%`);
  if (ogDescription) ogDescription.setAttribute('content', `인종차별적 성향 테스트 결과를 확인해보세요. 점수: ${scorePercent}%`);
  if (ogImage) ogImage.setAttribute('content', imageDataUrl);
  if (ogImageWidth) ogImageWidth.setAttribute('content', dimensions.width.toString());
  if (ogImageHeight) ogImageHeight.setAttribute('content', dimensions.height.toString());
  
  // Twitter 메타 태그 업데이트
  const twitterTitle = document.querySelector('meta[property="twitter:title"]');
  const twitterDescription = document.querySelector('meta[property="twitter:description"]');
  const twitterImage = document.querySelector('meta[property="twitter:image"]');
  
  if (twitterTitle) twitterTitle.setAttribute('content', `나의 인종차별적 성향 테스트 결과: ${scorePercent}%`);
  if (twitterDescription) twitterDescription.setAttribute('content', `인종차별적 성향 테스트 결과를 확인해보세요. 점수: ${scorePercent}%`);
  if (twitterImage) twitterImage.setAttribute('content', imageDataUrl);
}

// 게이지 스타일 점수 표시 생성 함수
function generateGaugeStyle(scorePercent, t) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 게이지 크기 설정
  canvas.width = 800;
  canvas.height = 200;
  
  // 5개 구간 정의 (이미지와 동일한 스타일)
  const segments = [
    { min: 0, max: 20, color: '#ff4444', label: 'POOR', emoji: '😞', range: '0-20%' },
    { min: 21, max: 40, color: '#ff8800', label: 'UNCERTAIN', emoji: '😐', range: '21-40%' },
    { min: 41, max: 60, color: '#ffcc00', label: 'FAIR', emoji: '😐', range: '41-60%' },
    { min: 61, max: 80, color: '#88cc00', label: 'GOOD', emoji: '🙂', range: '61-80%' },
    { min: 81, max: 100, color: '#44cc44', label: 'EXCELLENT', emoji: '😊', range: '81-100%' }
  ];
  
  // 배경
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 게이지 바 그리기
  const barWidth = canvas.width - 100;
  const segmentWidth = barWidth / 5;
  const barY = 60;
  const barHeight = 80;
  
  segments.forEach((segment, index) => {
    const x = 50 + index * segmentWidth;
    
    // 둥근 모서리 게이지 바
    ctx.fillStyle = segment.color;
    ctx.beginPath();
    ctx.roundRect(x, barY, segmentWidth, barHeight, 8);
    ctx.fill();
    
    // 라벨
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(segment.label, x + segmentWidth/2, barY + 30);
    
    // 범위
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText(segment.range, x + segmentWidth/2, barY + 50);
    
    // 이모지
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText(segment.emoji, x + segmentWidth/2, barY + 75);
  });
  
  // 포인터 그리기 (점수 위치)
  const pointerX = 50 + (scorePercent / 100) * barWidth;
  drawGaugePointer(ctx, pointerX, barY + barHeight + 20);
  
  return canvas.toDataURL('image/png');
}

// 게이지 포인터 그리기 함수
function drawGaugePointer(ctx, x, y) {
  ctx.fillStyle = '#000000';
  
  // 삼각형 포인터
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 8, y + 15);
  ctx.lineTo(x + 8, y + 15);
  ctx.closePath();
  ctx.fill();
  
  // 포인터 선
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(x, y + 15);
  ctx.lineTo(x, y + 25);
  ctx.stroke();
  
  // 포인터 원
  ctx.beginPath();
  ctx.arc(x, y + 25, 4, 0, 2 * Math.PI);
  ctx.fill();
}

// 둥근 모서리 사각형 그리기 (Canvas API 확장)
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
};

// 게이지 표시 컴포넌트
function GaugeDisplay({ scorePercent, t }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // 캔버스 크기 설정
      canvas.width = 560;
      canvas.height = 120;
      
      // 10단계 그라데이션 색상 정의 (연두색 → 빨간색)
      const gradientColors = [
        '#4CAF50', // 연두색 (좋음)
        '#66BB6A',
        '#81C784',
        '#A5D6A7',
        '#C8E6C9',
        '#FFD54F', // 노란색 (중간)
        '#FFB74D',
        '#FF8A65',
        '#E57373',
        '#F44336'  // 빨간색 (나쁨)
      ];
      
      // 5개 구간 정의 (사람 얼굴 픽토그램)
      const segments = [
        { min: 0, max: 20, label: 'EXCELLENT', icon: '😊', range: '81-100%' },
        { min: 21, max: 40, label: 'GOOD', icon: '🙂', range: '61-80%' },
        { min: 41, max: 60, label: 'FAIR', icon: '😐', range: '41-60%' },
        { min: 61, max: 80, label: 'UNCERTAIN', icon: '😕', range: '21-40%' },
        { min: 81, max: 100, label: 'POOR', icon: '😞', range: '0-20%' }
      ];
      
      // 배경
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 게이지 바 그리기
      const barWidth = canvas.width - 40;
      const barHeight = 50;
      const barY = 30;
      
      // 10단계 그라데이션 바 그리기
      const segmentWidth = barWidth / 10;
      
      for (let i = 0; i < 10; i++) {
        const x = 20 + i * segmentWidth;
        
        // 각 구간을 그라데이션 색상으로 그리기
        ctx.fillStyle = gradientColors[i];
        ctx.beginPath();
        ctx.roundRect(x, barY, segmentWidth, barHeight, 6);
        ctx.fill();
      }
      
      // 5개 구간 라벨과 픽토그램 그리기
      const labelSegmentWidth = barWidth / 5;
      
      segments.forEach((segment, index) => {
        const x = 20 + index * labelSegmentWidth;
        
        // 라벨
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 12px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(segment.label, x + labelSegmentWidth/2, barY + 20);
        
        // 사람 얼굴 픽토그램 (하얀색)
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Arial, sans-serif';
        ctx.fillText(segment.icon, x + labelSegmentWidth/2, barY + 40);
      });
      
      // 포인터 그리기 (점수 위치)
      const pointerX = 20 + (scorePercent / 100) * barWidth;
      drawGaugePointer(ctx, pointerX, barY + barHeight + 10);
    }
  }, [scorePercent]);
  
  return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />;
}

function ResultPage({ scorePercent, solution, t, onRestart, onHome }) {
  const circleBg = getRedGradient(scorePercent);
  
  // 결과 페이지 로드 시 메타 태그 업데이트
  useEffect(() => {
    const imageDataUrl = generateTikTokImage(scorePercent, solution, t);
    updateMetaTags(scorePercent, imageDataUrl);
  }, [scorePercent, solution, t]);
  
  const handleShare = (platform) => {
    // 항상 모바일 사이즈 이미지 생성 (1080x1920)
    const imageDataUrl = generateTikTokImage(scorePercent, solution, t);
    
    // 통합 공유: 모바일 사이즈 이미지 다운로드
    const link = document.createElement('a');
    link.download = `racial-bias-test-result-${scorePercent}.png`;
    link.href = imageDataUrl;
    link.click();
    alert('결과 이미지가 다운로드되었습니다. 원하는 소셜 미디어에 업로드해주세요.');
  };

  return (
    <div className="result-page">
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 8 }}>{t("resultTitle")}</h2>
      <div style={{ color: '#6c63ff', fontWeight: 600, marginBottom: 8 }}>{t("resultSubtitle")}</div>
      
      {/* 점수 표시 */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: 32 
      }}>
        <div style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: circleBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: 'bold',
          boxShadow: `0 4px 20px ${circleBg}55`,
          marginBottom: 16
        }}>
          {scorePercent}%
        </div>
        <div style={{ 
          fontSize: '14px', 
          color: '#666', 
          textAlign: 'center' 
        }}>
          {t("biasIndex")}
        </div>
      </div>
      
      <div style={{ fontWeight: 600, margin: '18px 0 8px 0' }}>{t("analysis")}</div>
      <div style={{ marginBottom: 12 }}>{solution.analysis}</div>
      <div style={{ fontWeight: 600, margin: '18px 0 8px 0' }}>{t("solutionsTitle")}</div>
      <ul style={{ textAlign: 'left', paddingLeft: 18, margin: 0 }}>
        {solution.tips.map((tip, idx) => (
          <li key={idx} style={{ marginBottom: 6 }}>{tip}</li>
        ))}
      </ul>
      <div className="main-disclaimer" style={{ margin: '18px 0', fontSize: 15, color: '#888' }}>
        <strong>{t("disclaimer")}</strong>
      </div>
      
      {/* 버튼 영역 */}
      <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 18, marginBottom: 24 }}>
        <button className="submit-btn" style={{ width: 140, padding: '12px 16px', fontSize: '0.95rem' }} onClick={onRestart}>{t("restart")}</button>
        <button className="submit-btn" style={{ width: 100, padding: '12px 16px', fontSize: '0.95rem', background: '#fafbfc', color: '#333', border: '1.5px solid #e0e0e0', boxShadow: 'none' }} onClick={onHome}>{t("home")}</button>
      </div>
      
      {/* SNS 공유 버튼 영역 */}
      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #eee' }}>
        <button 
          onClick={() => handleShare('unified')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            maxWidth: 280,
            margin: '0 auto',
            padding: '12px 20px',
            background: '#6c63ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(108, 99, 255, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#5a52d5';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(108, 99, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#6c63ff';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 8px rgba(108, 99, 255, 0.3)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16,6 12,2 8,6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          {t("shareResult")}
        </button>
      </div>
    </div>
  );
}

function App() {
  const { t, i18n } = useTranslation();
  const questions = t("questions", { returnObjects: true });
  const solutions = t("solutions", { returnObjects: true });
  const total = questions.length;

  const [page, setPage] = useState("landing");
  const [current, setCurrent] = useState(0); // 0~29
  const [answers, setAnswers] = useState([]); // 각 문항의 value
  const [dark, setDark] = useState(() => {
    const pref = localStorage.getItem('darkmode');
    if (pref === '1') return true;
    if (pref === '0') return false;
    return false; // 기본값을 라이트모드로 설정
  });
  // 다크모드 적용
  React.useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
      localStorage.setItem('darkmode', '1');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkmode', '0');
    }
  }, [dark]);

  // 결과 계산
  const maxScore = questions.reduce((sum, q) => {
    const max = Math.max(...q.options.map(o => o.value));
    return sum + max;
  }, 0);
  const userScore = answers.reduce((sum, v) => sum + v, 0);
  const scorePercent = maxScore > 0 ? Math.round((userScore / maxScore) * 100) : 0;
  function getSolutionByPercent(percent) {
    if (percent <= 10) return solutions["0-10"];
    if (percent <= 20) return solutions["11-20"];
    if (percent <= 30) return solutions["21-30"];
    if (percent <= 40) return solutions["31-40"];
    if (percent <= 50) return solutions["41-50"];
    if (percent <= 60) return solutions["51-60"];
    if (percent <= 70) return solutions["61-70"];
    if (percent <= 80) return solutions["71-80"];
    if (percent <= 90) return solutions["81-90"];
    return solutions["91-100"];
  }

  // 언어 변경
  const handleLangChange = (code) => {
    i18n.changeLanguage(code);
    setPage("landing");
    setCurrent(0);
    setAnswers([]);
  };

  // 설문 답변
  const handleOptionClick = (value) => {
    const newAnswers = [...answers];
    newAnswers[current] = value;
    setAnswers(newAnswers);
    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      setPage("result");
    }
  };

  // 버튼 핸들러
  const handleRestart = () => {
    setCurrent(0);
    setAnswers([]);
    setPage("question");
  };
  const handleHome = () => {
    setCurrent(0);
    setAnswers([]);
    setPage("landing");
  };
  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };
  const handleNext = () => {
    if (current < total - 1) setCurrent(current + 1);
  };

  // 메인(랜딩) 페이지
  if (page === "landing") {
    return (
      <div className="container">
        <div className="section section-top">
          <div className="header-container">
            <h1 style={{ margin: 0, textAlign: 'center', flex: 1 }}>{t("title")}</h1>
            <LangDarkRow lang={i18n.language} onLang={handleLangChange} onDark={() => setDark(d => !d)} dark={dark} />
          </div>
        </div>
        <div className="section section-mid">
          <AdPlaceholder />
        </div>
        <div className="section section-bot">
          <div id="main-intro" className="main-intro" style={{ marginBottom: 18, textAlign: 'left', lineHeight: 1.6, width: '100%', display: 'block' }}>
            • {t("intro")}
          </div>
          <div id="main-disclaimer" className="main-disclaimer" style={{ margin: '18px 0', fontSize: 15, color: '#888', textAlign: 'left', lineHeight: 1.5, width: '100%', display: 'block' }}>
            • <strong>{t("disclaimerLanding")}</strong>
          </div>
          <div id="main-important-label" style={{ fontWeight: 600, marginTop: 18, textAlign: 'left' }}>{t("important")}</div>
          <ul id="main-important-list" style={{ margin: '8px 0 24px 0', paddingLeft: 18, color: '#555', fontSize: 15 }}>
            {(t("importantList", { returnObjects: true }) || []).map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
          <button className="submit-btn" style={{ width: 220, fontSize: 18, margin: '18px auto', display: 'block' }} onClick={() => setPage("question")}>{t("start")}</button>
          
          {/* 테스트 이미지 다운로드 버튼 (개발용) */}
          <button 
            onClick={downloadTestImages}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              background: '#f0f0f0',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'block',
              margin: '16px auto 0 auto'
            }}
          >
            🎨 게이지 스타일 테스트 이미지 다운로드
          </button>
        </div>
      </div>
    );
  }
  // 결과 페이지
  if (page === "result") {
    return (
      <div className="container">
        <div className="section section-top">
          <div style={{ fontWeight: 700, fontSize: 20 }}>{t("resultTitle")}</div>
        </div>
        <div className="section section-mid">
          <AdPlaceholder />
        </div>
        <div className="section section-bot">
          <ResultPage scorePercent={scorePercent} solution={getSolutionByPercent(scorePercent)} t={t} onRestart={handleRestart} onHome={handleHome} />
        </div>
      </div>
    );
  }
  // 설문 진행 페이지
  return (
    <div className="container">
      <div className="section section-top">
        <ProgressCard current={current} total={total} t={t} />
      </div>
      <div className="section section-mid">
        <AdPlaceholder />
      </div>
      <div className="section section-bot">
        <div className="question">{questions[current].question}</div>
        <div className="options-list">
          {questions[current].options.map((opt, idx) => (
            <div
              key={idx}
              className={`option-card${answers[current] === opt.value ? ' selected' : ''}`}
              tabIndex={0}
              onClick={() => handleOptionClick(opt.value)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleOptionClick(opt.value)}
              role="button"
              aria-pressed={answers[current] === opt.value}
            >
              <span className="option-radio">
                <span className="option-radio-dot" />
              </span>
              {opt.label}
            </div>
          ))}
        </div>
        <div className="btn-row">
          <button className="submit-btn prev" onClick={handlePrev} disabled={current === 0}>{t("prev")}</button>
          <button className="submit-btn next" onClick={handleNext} disabled={answers[current] === undefined || current === total - 1}>
            {t("next")} <span style={{ fontSize: 18, marginLeft: 2 }}>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 테스트 이미지 생성 함수들
function generateTestImage1() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 600;
  canvas.height = 150;
  
  // 배경
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 제목
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('옵션 1: 부드러운 그라데이션 + 심플 픽토그램', canvas.width/2, 25);
  
  // 5개 구간 정의
  const segments = [
    { min: 0, max: 20, color: '#4CAF50', label: 'EXCELLENT', icon: '●', range: '81-100%' },
    { min: 21, max: 40, color: '#8BC34A', label: 'GOOD', icon: '●', range: '61-80%' },
    { min: 41, max: 60, color: '#FFC107', label: 'FAIR', icon: '●', range: '41-60%' },
    { min: 61, max: 80, color: '#FF9800', label: 'UNCERTAIN', icon: '●', range: '21-40%' },
    { min: 81, max: 100, color: '#F44336', label: 'POOR', icon: '●', range: '0-20%' }
  ];
  
  // 게이지 바 그리기
  const barWidth = canvas.width - 100;
  const segmentWidth = barWidth / 5;
  const barY = 50;
  const barHeight = 60;
  
  segments.forEach((segment, index) => {
    const x = 50 + index * segmentWidth;
    
    // 둥근 모서리 게이지 바
    ctx.fillStyle = segment.color;
    ctx.beginPath();
    ctx.roundRect(x, barY, segmentWidth, barHeight, 8);
    ctx.fill();
    
    // 라벨
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(segment.label, x + segmentWidth/2, barY + 25);
    
    // 픽토그램
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText(segment.icon, x + segmentWidth/2, barY + 45);
  });
  
  // 포인터 (예시: 65% 위치)
  const pointerX = 50 + (65 / 100) * barWidth;
  drawGaugePointer(ctx, pointerX, barY + barHeight + 10);
  
  return canvas.toDataURL('image/png');
}

function generateTestImage2() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 600;
  canvas.height = 150;
  
  // 배경
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 제목
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('옵션 2: 강한 대비 + 감정 표현', canvas.width/2, 25);
  
  // 5개 구간 정의
  const segments = [
    { min: 0, max: 20, color: '#2E7D32', label: 'EXCELLENT', icon: '😊', range: '81-100%' },
    { min: 21, max: 40, color: '#4CAF50', label: 'GOOD', icon: '🙂', range: '61-80%' },
    { min: 41, max: 60, color: '#FFC107', label: 'FAIR', icon: '😐', range: '41-60%' },
    { min: 61, max: 80, color: '#FF5722', label: 'UNCERTAIN', icon: '😕', range: '21-40%' },
    { min: 81, max: 100, color: '#D32F2F', label: 'POOR', icon: '😞', range: '0-20%' }
  ];
  
  // 게이지 바 그리기
  const barWidth = canvas.width - 100;
  const segmentWidth = barWidth / 5;
  const barY = 50;
  const barHeight = 60;
  
  segments.forEach((segment, index) => {
    const x = 50 + index * segmentWidth;
    
    // 둥근 모서리 게이지 바
    ctx.fillStyle = segment.color;
    ctx.beginPath();
    ctx.roundRect(x, barY, segmentWidth, barHeight, 8);
    ctx.fill();
    
    // 라벨
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(segment.label, x + segmentWidth/2, barY + 25);
    
    // 픽토그램
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText(segment.icon, x + segmentWidth/2, barY + 45);
  });
  
  // 포인터 (예시: 65% 위치)
  const pointerX = 50 + (65 / 100) * barWidth;
  drawGaugePointer(ctx, pointerX, barY + barHeight + 10);
  
  return canvas.toDataURL('image/png');
}

function generateTestImage3() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 600;
  canvas.height = 150;
  
  // 배경
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 제목
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('옵션 3: 중성 + 기하학적', canvas.width/2, 25);
  
  // 5개 구간 정의
  const segments = [
    { min: 0, max: 20, color: '#4CAF50', label: 'EXCELLENT', icon: '◯', range: '81-100%' },
    { min: 21, max: 40, color: '#8BC34A', label: 'GOOD', icon: '◯', range: '61-80%' },
    { min: 41, max: 60, color: '#FFC107', label: 'FAIR', icon: '◯', range: '41-60%' },
    { min: 61, max: 80, color: '#FF9800', label: 'UNCERTAIN', icon: '◯', range: '21-40%' },
    { min: 81, max: 100, color: '#F44336', label: 'POOR', icon: '◯', range: '0-20%' }
  ];
  
  // 게이지 바 그리기
  const barWidth = canvas.width - 100;
  const segmentWidth = barWidth / 5;
  const barY = 50;
  const barHeight = 60;
  
  segments.forEach((segment, index) => {
    const x = 50 + index * segmentWidth;
    
    // 둥근 모서리 게이지 바
    ctx.fillStyle = segment.color;
    ctx.beginPath();
    ctx.roundRect(x, barY, segmentWidth, barHeight, 8);
    ctx.fill();
    
    // 라벨
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(segment.label, x + segmentWidth/2, barY + 25);
    
    // 픽토그램
    ctx.font = '20px Arial, sans-serif';
    ctx.fillText(segment.icon, x + segmentWidth/2, barY + 45);
  });
  
  // 포인터 (예시: 65% 위치)
  const pointerX = 50 + (65 / 100) * barWidth;
  drawGaugePointer(ctx, pointerX, barY + barHeight + 10);
  
  return canvas.toDataURL('image/png');
}

function generateTestImage4() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 600;
  canvas.height = 150;
  
  // 배경
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 제목
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('옵션 4: 파스텔 그라데이션 + 미니멀', canvas.width/2, 25);
  
  // 5개 구간 정의
  const segments = [
    { min: 0, max: 20, color: '#A5D6A7', label: 'EXCELLENT', icon: '•', range: '81-100%' },
    { min: 21, max: 40, color: '#C8E6C9', label: 'GOOD', icon: '•', range: '61-80%' },
    { min: 41, max: 60, color: '#FFF9C4', label: 'FAIR', icon: '•', range: '41-60%' },
    { min: 61, max: 80, color: '#FFCC80', label: 'UNCERTAIN', icon: '•', range: '21-40%' },
    { min: 81, max: 100, color: '#EF9A9A', label: 'POOR', icon: '•', range: '0-20%' }
  ];
  
  // 게이지 바 그리기
  const barWidth = canvas.width - 100;
  const segmentWidth = barWidth / 5;
  const barY = 50;
  const barHeight = 60;
  
  segments.forEach((segment, index) => {
    const x = 50 + index * segmentWidth;
    
    // 둥근 모서리 게이지 바
    ctx.fillStyle = segment.color;
    ctx.beginPath();
    ctx.roundRect(x, barY, segmentWidth, barHeight, 8);
    ctx.fill();
    
    // 라벨
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(segment.label, x + segmentWidth/2, barY + 25);
    
    // 픽토그램
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText(segment.icon, x + segmentWidth/2, barY + 45);
  });
  
  // 포인터 (예시: 65% 위치)
  const pointerX = 50 + (65 / 100) * barWidth;
  drawGaugePointer(ctx, pointerX, barY + barHeight + 10);
  
  return canvas.toDataURL('image/png');
}

function generateTestImage5() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 600;
  canvas.height = 150;
  
  // 배경
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 제목
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 20px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('옵션 5: 비비드 + 라인 픽토그램', canvas.width/2, 25);
  
  // 5개 구간 정의
  const segments = [
    { min: 0, max: 20, color: '#00C851', label: 'EXCELLENT', icon: '┌─┐', range: '81-100%' },
    { min: 21, max: 40, color: '#33D17A', label: 'GOOD', icon: '┌─┐', range: '61-80%' },
    { min: 41, max: 60, color: '#FFD700', label: 'FAIR', icon: '┌─┐', range: '41-60%' },
    { min: 61, max: 80, color: '#FF6B35', label: 'UNCERTAIN', icon: '┌─┐', range: '21-40%' },
    { min: 81, max: 100, color: '#FF1744', label: 'POOR', icon: '┌─┐', range: '0-20%' }
  ];
  
  // 게이지 바 그리기
  const barWidth = canvas.width - 100;
  const segmentWidth = barWidth / 5;
  const barY = 50;
  const barHeight = 60;
  
  segments.forEach((segment, index) => {
    const x = 50 + index * segmentWidth;
    
    // 둥근 모서리 게이지 바
    ctx.fillStyle = segment.color;
    ctx.beginPath();
    ctx.roundRect(x, barY, segmentWidth, barHeight, 8);
    ctx.fill();
    
    // 라벨
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(segment.label, x + segmentWidth/2, barY + 25);
    
    // 픽토그램
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText(segment.icon, x + segmentWidth/2, barY + 45);
  });
  
  // 포인터 (예시: 65% 위치)
  const pointerX = 50 + (65 / 100) * barWidth;
  drawGaugePointer(ctx, pointerX, barY + barHeight + 10);
  
  return canvas.toDataURL('image/png');
}

// 테스트 이미지 다운로드 함수
function downloadTestImages() {
  const images = [
    { name: 'option1', data: generateTestImage1() },
    { name: 'option2', data: generateTestImage2() },
    { name: 'option3', data: generateTestImage3() },
    { name: 'option4', data: generateTestImage4() },
    { name: 'option5', data: generateTestImage5() }
  ];
  
  images.forEach((image, index) => {
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `gauge-option-${index + 1}.png`;
      link.href = image.data;
      link.click();
    }, index * 500);
  });
  
  alert('5개의 테스트 이미지가 순차적으로 다운로드됩니다!');
}

export default App;
