'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const riskyWords = [
  'mail', 'email', 'emails', 'e-mail', 'gmail', 'gmails', 'hotmail', 'outlook', 'yahoo',
  'phone', 'number', 'contact', 'call', 'contact us', 'Umran',
  'whatsapp', 'telegram', 'skype', 'zoom', 'meet', 'hangouts', 'viber', 'imo', 'signal', 'Send money',
  'pay', 'payment', 'payments', 'purchase', 'purchasing', 'purchased', 'paypal', 'stripe', 'venmo',
  'cashapp', 'bank', 'western union', 'moneygram', 'btc', 'bitcoin', 'crypto', 'wallet', 'price', 'payload',
  'wire transfer', 'invoice', 'direct payment', 'outside fiverr', 'outside fiver', 'off fiverr', 'off fiver',
  'send money', 'money', 'buy', 'pricing', 'salary',
  'personal website', 'domain', 'upwork', 'outside', 'feedback', 'rating', 'freelancer', 'freelancer.com',
  'peopleperhour', 'toptal', 'fiverr alternative',
  'facebook', 'messenger', 'instagram', 'linkedin', 'twitter', 'x.com', 'snapchat', 'tiktok', 'youtube',
  'pinterest', 'reddit', 'discord',
  'give me your number', 'contact me outside', 'message me on', 'hire me on', 'work outside fiverr', 'pay directly',
  'gambling', 'casino', 'betting', 'sports betting', 'poker', 'slot games', 'slots', 'blackjack', 'roulette',
  'fuck', 'shit', 'bitch', 'bastard', 'asshole', 'dick', 'pussy', 'slut', 'whore', 'cunt', 'nude', 'nudes',
  'porn', 'sex', 'hentai', 'adult content',
  'kill', 'die', 'suicide', 'bomb', 'terrorist', 'attack', 'shoot', 'gun', 'weapon', 'review', 'reviewed',
  'reviews', 'contacts', 'payroll', 'slack', 'address', 'rizwan', 'ratings', 'star',
];

const customHyphenPositions = {
  payment: [2],
  payments: [2],
  payroll: [2],
  payslip: [2],
};

function insertHyphen(word) {
  const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
  if (clean.length < 2) return word;

  let pos;
  if (customHyphenPositions[clean]) {
    const positions = customHyphenPositions[clean];
    pos = positions[Math.floor(Math.random() * positions.length)];
  } else {
    pos = Math.floor(clean.length / 2);
  }

  const hyphenated = clean.slice(0, pos) + '-' + clean.slice(pos);
  return word.replace(new RegExp(clean, 'i'), hyphenated);
}

function applyLabels(str) {
  let res = str;
  res = res.replace(/buyer\s*:/gi, '<b style="color: red; font-size: 30pt;">Buyer:</b><br />');
  res = res.replace(/seller\s*:/gi, '<b style="color: blue; font-size: 30pt;">Seller:</b><br />');
  res = res.replace(/requirements\s*:/gi, '<b style="color: #FF00FF; font-size: 30pt;">Requirements:</b><br />');
  res = res.replace(/custom\s*offer\s*:/gi, '<b style="color: #FF00FF; font-size: 30pt;">Custom Offer:</b><br />'); 
  return res;
}

function CustomIcon({ src, alt, className = 'w-6 h-6' }) {
  return (
    <img src={`/icon_images/${src}`} alt={alt} className={className} />
  );
}

function Toast({ type, message }) {
  return (
    <div className={`toast ${type}`}>
      <span style={{ fontSize: '20px' }}>{type === 'success' ? '✅' : '⚠️'}</span>
      {message}
    </div>
  );
}

export default function FiverShieldTool() {
  const [darkMode, setDarkMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [outputHTML, setOutputHTML] = useState('');
  const [copyHTML, setCopyHTML] = useState('');
  const [outputText, setOutputText] = useState('');
  const [foundWords, setFoundWords] = useState(new Set());
  const [highlight, setHighlight] = useState(true);
  const [inputCount, setInputCount] = useState({ words: 0, chars: 0 });
  const [outputCount, setOutputCount] = useState({ words: 0, chars: 0 });
  const [copyFeedback, setCopyFeedback] = useState('');
  const [ripples, setRipples] = useState([]);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  function showToast(type, message) {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ type, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, 3000);
  }

  function updateCounts(input, output) {
    const inputWords = input.trim().split(/\s+/).filter(Boolean).length;
    const outputWords = output.trim().split(/\s+/).filter(Boolean).length;
    setInputCount({ words: inputWords, chars: input.length });
    setOutputCount({ words: outputWords, chars: output.length });
  }

  function handleInputChange(event) {
    const text = event.target.value;
    setInputText(text);
    updateCounts(text, outputText);
  }

  function processMessage(event) {
    if (event && event.currentTarget && event.clientX !== undefined) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    if (!inputText.trim()) {
      showToast('error', 'Please enter a message!');
      return;
    }

    let text = inputText;
    let htmlText = inputText;
    const found = new Set();

    riskyWords.forEach((risky) => {
      const pattern = new RegExp(`\\b${risky}\\b`, 'gi');
      text = text.replace(pattern, (match) => {
        found.add(match.toLowerCase());
        return insertHyphen(match);
      });
      htmlText = htmlText.replace(pattern, (match) => {
        found.add(match.toLowerCase());
        const cleaned = insertHyphen(match);
        return highlight
          ? `<span style="background-color: #ffcccc; color: #a00; padding: 2px 4px; border-radius: 3px;">${cleaned}</span>`
          : cleaned;
      });
    });

    let finalDisplayHTML = applyLabels(htmlText);
    finalDisplayHTML = finalDisplayHTML.replace(/\n/g, '<br />');
    finalDisplayHTML = `<div style="font-family: 'Lexend', sans-serif; font-size: 12pt;">${finalDisplayHTML}</div>`;

    let finalCopyHTML = applyLabels(text);
    finalCopyHTML = finalCopyHTML.replace(/\n/g, '<br />');
    finalCopyHTML = `<div style="color: black; font-family: 'Lexend', sans-serif; font-size: 12pt;">${finalCopyHTML}</div>`;

    setFoundWords(found);
    setOutputText(text);
    setOutputHTML(finalDisplayHTML);
    setCopyHTML(finalCopyHTML);
    updateCounts(inputText, text);

    setInputText('');
    setInputCount({ words: 0, chars: 0 });

    showToast('success', 'Message made safe successfully!');
  }

  function copyOutput() {
    if (!outputText.trim()) {
      showToast('error', 'No safe message to copy!');
      return;
    }

    try {
      const onCopy = (e) => {
        e.clipboardData.setData('text/html', copyHTML);
        e.clipboardData.setData('text/plain', outputText);
        e.preventDefault();
      };
      document.addEventListener('copy', onCopy);
      const successful = document.execCommand('copy');
      document.removeEventListener('copy', onCopy);
      if (successful) {
        setCopyFeedback('✅ Copied!');
        showToast('success', 'Text copied to clipboard!');
        setTimeout(() => setCopyFeedback(''), 1000);
      } else {
        throw new Error('execCommand failed');
      }
    } catch (err) {
      console.error('Rich copy failed, falling back to plain text:', err);
      const textArea = document.createElement('textarea');
      textArea.value = outputText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyFeedback('✅ Copied!');
        showToast('success', 'Text copied to clipboard!');
        setTimeout(() => setCopyFeedback(''), 1000);
      } catch (err2) {
        showToast('error', 'Copy failed!');
      }
      document.body.removeChild(textArea);
    }
  }

  function pasteToInput() {
    if (!outputText.trim()) {
      showToast('error', 'No safe message to paste!');
      return;
    }
    setInputText(outputText);
    updateCounts(outputText, outputText);
    showToast('success', 'Message pasted for editing!');
  }

  return (
    <div className="min-h-screen bg-sky-100 dark:bg-slate-900 p-6 transition-colors duration-300">
      {toast && <Toast type={toast.type} message={toast.message} />}

      <div className="max-w-7xl mx-auto relative">
        {/* Dark mode toggle */}
        <div className="absolute top-0 right-0 z-10">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-200"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '💡' : '🌃'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <CustomIcon src="fsicon.png" alt="Logo" className="w-10 h-10 object-contain" />
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white">FiverShield</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Protect your Fiverr messages from policy violations
          </p>
        </div>

        {/* Alert banner */}
        <div className="bg-sky-50 dark:bg-slate-800 border border-sky-300 dark:border-slate-700 rounded-lg p-3 mb-6 flex gap-3 max-w-2xl mx-auto shadow-sm">
          <div className="text-sky-600 dark:text-sky-400">
            <CustomIcon src="alert.png" alt="Alert" className="w-5 h-5 flex-shrink-0 mt-0.5" />
          </div>
          <p className="text-sky-800 dark:text-slate-300 text-sm font-medium">
            Always manually review the final message. This tool works carefully but cannot guarantee 100% accuracy.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Input panel */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-xl">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                  <CustomIcon src="message.png" alt="Message" className="w-5 h-5" />
                  Your Message:
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highlight}
                    onChange={(e) => setHighlight(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-600"
                  />
                  <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1">
                    <CustomIcon src="highlight.png" alt="Highlight" className="w-4 h-4" />
                    Highlight words
                  </span>
                </label>
              </div>

              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Write your Fiverr message here..."
                className="w-full h-[400px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-black dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none mb-2 transition-all"
              />

              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-sm mb-3">
                <span>Words: {inputCount.words}</span>
                <span>Characters: {inputCount.chars}</span>
              </div>

              <button
                onClick={processMessage}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg ripple-container"
              >
                <CustomIcon src="make-safe.png" alt="Make Safe" className="w-6 h-6" />
                Make Safe
                {ripples.map((ripple) => (
                  <span
                    key={ripple.id}
                    className="ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                  />
                ))}
              </button>
            </div>
          </div>

          {/* Output panel */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-xl">
            <div className="p-5">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-3 flex items-center gap-2">
                <CustomIcon src="message.png" alt="Safe Message" className="w-5 h-5" />
                Safe Message:
              </label>

              <div
                className="w-full h-[400px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-black dark:text-white overflow-y-auto whitespace-pre-wrap break-words mb-2"
                dangerouslySetInnerHTML={{
                  __html:
                    outputHTML ||
                    `<span class="text-slate-400 italic">${
                      darkMode
                        ? 'Your safe message will appear here...'
                        : 'Your safe message will appear here...'
                    }</span>`,
                }}
              />

              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-sm mb-3">
                <span>Words: {outputCount.words}</span>
                <span>Characters: {outputCount.chars}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyOutput}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg active:scale-95"
                >
                  <CustomIcon src="copy.png" alt="Copy" className="w-6 h-6" />
                  {copyFeedback || 'Copy Text'}
                </button>
                <button
                  onClick={pasteToInput}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg active:scale-95"
                >
                  <CustomIcon src="re-edit.png" alt="Re-edit" className="w-6 h-6" />
                  Re-edit
                </button>
              </div>
            </div>

            {/* Restricted words list */}
            {foundWords.size > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                <div className="flex gap-3">
                  <div className="text-red-600 dark:text-red-400 flex-shrink-0">
                    <CustomIcon src="alert.png" alt="Alert" className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  </div>
                  <div>
                    <p className="text-red-800 dark:text-red-300 font-semibold text-sm">
                      ❌ Restricted Words Detected:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.from(foundWords).map((word) => (
                        <span
                          key={word}
                          className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs px-2 py-1 rounded border border-red-200 dark:border-red-800"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-slate-600 dark:text-slate-400 text-sm">
        
          {'Built with 💙 by '}
          <a
            href="https://mazharul.bro.bd"
            className="transition-colors duration-300 ease-in-out font-medium text-blue-600 dark:text-sky-400 drop-shadow-[0_0_0.4rem_rgba(14,165,233,0.8)] hover:text-blue-700 dark:hover:text-sky-300 hover:drop-shadow-none"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rafi
          </a>
        </footer>
      </div>
    </div>
  );
}
