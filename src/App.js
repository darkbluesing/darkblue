import React, { useState, useRef } from "react";
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

function ResultPage({ scorePercent, solution, t, onRestart, onHome }) {
  const circleBg = getRedGradient(scorePercent);
  
  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `나의 인종차별적 성향 테스트 결과: ${scorePercent}%`;
    
    switch(platform) {
      case 'instagram':
        // Instagram은 웹에서 직접 공유가 어려우므로 URL 복사
        navigator.clipboard.writeText(`${text}\n${url}`);
        alert('인스타그램에 공유할 내용이 클립보드에 복사되었습니다.');
        break;
      case 'kakao':
        // 카카오톡 공유 (카카오 SDK 필요)
        window.open(`https://story.kakao.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'tiktok':
        // TikTok은 웹에서 직접 공유가 어려우므로 URL 복사
        navigator.clipboard.writeText(`${text}\n${url}`);
        alert('틱톡에 공유할 내용이 클립보드에 복사되었습니다.');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'url':
        navigator.clipboard.writeText(url);
        alert('URL이 클립보드에 복사되었습니다.');
        break;
      default:
        break;
    }
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
      <div style={{ fontWeight: 600, margin: '18px 0 8px 0' }}>{t("solutions")}</div>
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
        <div style={{ textAlign: 'center', marginBottom: 16, fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>
          {t("shareResult")}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleShare('instagram')}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid #ddd',
              background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#666', fontSize: '1rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </button>
          <button 
            onClick={() => handleShare('kakao')}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid #ddd',
              background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#666', fontSize: '1rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <path d="M8 9h8"/>
              <path d="M8 13h6"/>
            </svg>
          </button>
          <button 
            onClick={() => handleShare('facebook')}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid #ddd',
              background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#666', fontSize: '1rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </button>
          <button 
            onClick={() => handleShare('tiktok')}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid #ddd',
              background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#666', fontSize: '1rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
            </svg>
          </button>
          <button 
            onClick={() => handleShare('twitter')}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid #ddd',
              background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#666', fontSize: '1rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
            </svg>
          </button>
          <button 
            onClick={() => handleShare('url')}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid #ddd',
              background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#666', fontSize: '1rem'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </button>
        </div>
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
          <div id="main-intro" className="main-intro" style={{ marginBottom: 18, textAlign: 'center', lineHeight: 1.6 }}>
            • {t("intro")}
          </div>
          <div id="main-disclaimer" className="main-disclaimer" style={{ margin: '18px 0', fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 1.5 }}>
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
