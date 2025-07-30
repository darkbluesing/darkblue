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

// 통합 이미지 생성 함수 (웹페이지와 동일한 디자인)
function generateTikTokImage(scorePercent, solution, t) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // 모바일 최적화 크기 (세로형)
  canvas.width = 1080;
  canvas.height = 1920;
  
  // 배경 - 웹페이지와 동일한 흰색 배경
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 상단 제목 (웹페이지와 동일한 스타일)
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 48px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t("resultTitle"), canvas.width/2, 120);
  
  // 부제목 (웹페이지와 동일한 스타일)
  ctx.fillStyle = '#6c63ff';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillText(t("resultSubtitle"), canvas.width/2, 170);
  
  // 점수 원 그리기 (웹페이지와 동일한 스타일)
  const centerX = canvas.width / 2;
  const centerY = 400;
  const radius = 55; // 웹페이지와 동일한 크기
  
  // 점수 원 배경 (웹페이지와 동일한 그라데이션)
  const circleBg = getRedGradient(scorePercent);
  ctx.fillStyle = circleBg;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  
  // 그림자 효과 (웹페이지와 동일)
  ctx.shadowColor = circleBg + '55';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // 점수 텍스트 (웹페이지와 동일한 스타일)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${scorePercent}%`, centerX, centerY + 10);
  
  // 편견 지수 (웹페이지와 동일한 스타일)
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.fillText(t("biasIndex"), centerX, centerY + radius + 40);
  
  // 분석 제목 (웹페이지와 동일한 스타일)
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(t("analysis"), centerX - 200, centerY + radius + 80);
  
  // 분석 결과 (웹페이지와 동일한 스타일)
  ctx.fillStyle = '#333333';
  ctx.font = '14px Arial, sans-serif';
  ctx.textAlign = 'left';
  
  const maxWidth = 400;
  const analysisLines = wrapText(ctx, solution.analysis, maxWidth, 20);
  let y = centerY + radius + 100;
  
  analysisLines.forEach((line, index) => {
    ctx.fillText(line, centerX - 200, y + (index * 20));
  });
  
  y += analysisLines.length * 20 + 30;
  
  // 솔루션 제목 (웹페이지와 동일한 스타일)
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.fillText(t("solutionsTitle"), centerX - 200, y);
  
  // 솔루션 팁들 (웹페이지와 동일한 스타일)
  if (solution.tips && solution.tips.length > 0) {
    ctx.fillStyle = '#333333';
    ctx.font = '14px Arial, sans-serif';
    
    const maxTips = Math.min(3, solution.tips.length);
    for (let i = 0; i < maxTips; i++) {
      const tip = solution.tips[i];
      const tipY = y + 30 + (i * 60); // 간격 증가
      
      // 글머리 기호 (웹페이지와 동일한 스타일)
      ctx.fillText('•', centerX - 200, tipY);
      
      // 팁 텍스트 (개선된 줄바꿈으로 텍스트 깨짐 방지)
      const tipWords = tip.split(' ');
      let tipLine = '';
      let tipLineY = tipY;
      
      for (let j = 0; j < tipWords.length; j++) {
        const testTipLine = tipLine + tipWords[j] + ' ';
        const tipMetrics = ctx.measureText(testTipLine);
        const tipTestWidth = tipMetrics.width;
        
        if (tipTestWidth > 360 && j > 0) {
          ctx.fillText(tipLine, centerX - 180, tipLineY);
          tipLine = tipWords[j] + ' ';
          tipLineY += 20;
        } else {
          tipLine = testTipLine;
        }
      }
      ctx.fillText(tipLine, centerX - 180, tipLineY);
    }
  }
  
  // 하단 디스클레이머 (웹페이지와 동일한 스타일)
  ctx.fillStyle = '#888888';
  ctx.font = '15px Arial, sans-serif';
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
      <div className="score-circle" style={{ width: 110, height: 110, borderRadius: '50%', background: circleBg, margin: '0 auto 18px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: '#fff', boxShadow: `0 10px 30px ${circleBg}55` }}>
        {scorePercent}%
      </div>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{t("biasIndex")}</div>
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
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 18, marginBottom: 24 }}>
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

export default App;
