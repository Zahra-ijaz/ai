/* =========================================================
    — Fake News Detection System
   Custom JavaScript (Vanilla JS only)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* =======================================================
     1. NAVBAR — scroll style + smooth scroll + active link
     ======================================================= */
  const navbar = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.sq-nav-link');
  const navCollapseEl = document.getElementById('navMenu');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('sq-scrolled');
    } else {
      navbar.classList.remove('sq-scrolled');
    }
  });

  // Close mobile menu after clicking a link (smooth scroll handled by CSS scroll-behavior)
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navCollapseEl.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapseEl);
        bsCollapse.hide();
      }
    });
  });

  /* =======================================================
     2. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ======================================================= */
  const revealItems = document.querySelectorAll('[data-aos]');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('sq-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(function (item) { revealObserver.observe(item); });

  /* =======================================================
     3. ANIMATED COUNTERS (hero stats + dashboard)
     ======================================================= */
  function animateCounter(el, target, duration) {
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(start + (target - start) * eased);
      el.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCounter(el, target, 1800);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) { counterObserver.observe(el); });

  /* =======================================================
     4. DASHBOARD RINGS (set CSS custom property for conic-gradient)
     ======================================================= */
  const dashRings = document.querySelectorAll('.sq-dash-ring');
  const ringObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const ring = entry.target;
        const percent = parseInt(ring.getAttribute('data-percent'), 10) || 0;
        // Animate the ring fill from 0 to target percent
        let current = 0;
        const step = Math.max(percent / 40, 1);
        const interval = setInterval(function () {
          current += step;
          if (current >= percent) {
            current = percent;
            clearInterval(interval);
          }
          ring.style.setProperty('--p', current);
        }, 20);
        ringObserver.unobserve(ring);
      }
    });
  }, { threshold: 0.3 });

  dashRings.forEach(function (ring) { ringObserver.observe(ring); });

  /* =======================================================
     5. NEWS ANALYSIS — analyzeNews()
     ======================================================= */
  const analyzeForm = document.getElementById('analyzeForm');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clearBtn = document.getElementById('clearBtn');

  const resultEmpty = document.getElementById('resultEmpty');
  const resultLoading = document.getElementById('resultLoading');
  const resultContent = document.getElementById('resultContent');

  // Demo dataset — used to simulate varied AI responses for the prototype
  const demoOutcomes = [
    {
      verdict: 'Fake',
      confidence: 94,
      sentiment: 'Negative',
      category: 'Politics',
      credibility: 'Low',
      explanation: 'The article contains exaggerated claims and unverified statements with no cited sources, a pattern strongly associated with fabricated news.'
    },
    {
      verdict: 'Real',
      confidence: 91,
      sentiment: 'Neutral',
      category: 'Business',
      credibility: 'High',
      explanation: 'The language is measured and cites verifiable figures consistent with legitimate financial reporting from credible outlets.'
    },
    {
      verdict: 'Fake',
      confidence: 87,
      sentiment: 'Negative',
      category: 'Health',
      credibility: 'Low',
      explanation: 'The content uses alarming language and miracle-cure framing typical of health misinformation, without referencing peer-reviewed sources.'
    },
    {
      verdict: 'Real',
      confidence: 96,
      sentiment: 'Positive',
      category: 'Sports',
      credibility: 'High',
      explanation: 'The report matches verified match statistics and uses neutral, factual sports-reporting language consistent with credible coverage.'
    }
  ];

  /**
   * analyzeNews()
   * Currently returns a simulated AI response for demo purposes.
   *
   * --- FASTAPI INTEGRATION POINT ---
   * Replace the simulated block below with a real API call once the
   * backend is deployed, e.g.:
   *
   * const response = await fetch("http://localhost:8000/analyze", {
   *   method: "POST",
   *   headers: { "Content-Type": "application/json" },
   *   body: JSON.stringify({ title, content, language })
   * });
   * const data = await response.json();
   * return data;
   * ----------------------------------
   */
  async function analyzeNews(title, content, language) {
    try {
        const response = await fetch("http://localhost:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                text: content,
                title: title 
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return { verdict: 'Error', confidence: 0 };
    }
}

  if (analyzeForm) {
    analyzeForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const title = document.getElementById('newsTitle').value.trim();
      const content = document.getElementById('newsContent').value.trim();
      const language = document.getElementById('newsLanguage').value;

      if (!content) {
        document.getElementById('newsContent').classList.add('is-invalid');
        document.getElementById('newsContent').focus();
        setTimeout(function () {
          document.getElementById('newsContent').classList.remove('is-invalid');
        }, 1500);
        return;
      }

      // Show loading state
      resultEmpty.classList.add('d-none');
      resultContent.classList.add('d-none');
      resultLoading.classList.remove('d-none');

      analyzeBtn.disabled = true;
      analyzeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Analyzing...';

      analyzeNews(title, content, language).then(function (result) {
        renderAnalysisResult(result);

        resultLoading.classList.add('d-none');
        resultContent.classList.remove('d-none');

        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="bi bi-cpu me-2"></i>Analyze News';
      });
    });
  }

function renderAnalysisResult(result) {
    // Check for error
    if (result.error) {
        document.getElementById('moduleVerdict').textContent = 'ERROR';
        document.getElementById('moduleConfidenceText').textContent = '0%';
        document.getElementById('moduleSentiment').textContent = 'ERROR';
        document.getElementById('moduleCategory').textContent = 'ERROR';
        document.getElementById('moduleCredibility').textContent = 'ERROR';
        document.getElementById('moduleExplanation').textContent = result.error;
        return;
    }

    // Module 1: Fake News Detection
    const verdict = result.prediction ? result.prediction.label : 'Unknown';
    const confidence = result.prediction ? result.prediction.confidence : 0;
    
    const verdictBadge = document.getElementById('resultVerdictBadge');
    if (verdictBadge) {
        verdictBadge.textContent = verdict.toUpperCase();
        verdictBadge.className = 'badge sq-badge-result ' + (verdict === 'Fake' ? 'sq-verdict-fake' : 'sq-verdict-real');
    }

    document.getElementById('moduleVerdict').textContent = verdict.toUpperCase();
    document.getElementById('moduleVerdict').className = 'sq-module-value ' + verdict.toLowerCase();

    const confBar = document.getElementById('moduleConfidenceBar');
    confBar.style.width = confidence + '%';
    confBar.className = 'sq-bar-fill ' + verdict.toLowerCase();
    document.getElementById('moduleConfidenceText').textContent = confidence + '%';

    // Module 2: Sentiment Analysis
    const sentiment = result.sentiment ? result.sentiment.sentiment : 'Neutral';
    const polarity = result.sentiment ? result.sentiment.polarity : 0;
    
    const sentEl = document.getElementById('moduleSentiment');
    sentEl.textContent = sentiment.toUpperCase();
    sentEl.className = 'sq-module-value ' + sentiment.toLowerCase();

    const sentBar = document.getElementById('moduleSentimentBar');
    const sentPercent = Math.min(Math.abs(polarity) * 100, 100);
    sentBar.style.width = sentPercent + '%';
    sentBar.className = 'sq-bar-fill ' + sentiment.toLowerCase();

    document.getElementById('moduleSentimentScore').textContent = polarity.toFixed(2);
    
    let sentimentDesc = 'Neutral tone';
    if (sentiment === 'Positive') sentimentDesc = 'Positive tone with optimistic language';
    if (sentiment === 'Negative') sentimentDesc = 'Negative tone with critical language';
    document.getElementById('moduleSentimentDesc').textContent = sentimentDesc;

    // Module 3: News Categorization
    const category = result.category || 'General';
    document.getElementById('moduleCategory').textContent = category.toUpperCase();
    document.getElementById('moduleCategoryConfidence').textContent = confidence + '%';

    // Module 4: Source Credibility
    const credibility = result.source ? result.source.reputation : 'Unknown';
    const credibilityDesc = result.source ? result.source.status : 'No source information available';
    
    const credEl = document.getElementById('moduleCredibility');
    credEl.textContent = credibility.toUpperCase();
    credEl.className = 'sq-module-value ' + credibility.toLowerCase();
    document.getElementById('moduleCredibilityDesc').textContent = credibilityDesc;

    // Module 5: Explainable AI - Important Words
    const wordList = document.getElementById('moduleWordList');
    wordList.innerHTML = '';
    
    const importantWords = result.prediction ? result.prediction.important_words : [];
    
    if (importantWords && importantWords.length > 0) {
        const isFake = verdict === 'Fake';
        importantWords.forEach(function(w) {
            const item = document.createElement('div');
            item.className = 'sq-word-item';
            
            const wordSpan = document.createElement('span');
            wordSpan.className = 'sq-word';
            wordSpan.textContent = w[0] || w.word || 'unknown';
            
            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'sq-word-score';
            const scoreValue = typeof w[1] === 'number' ? w[1] : 0.5;
            scoreSpan.textContent = (scoreValue * 100).toFixed(1) + '%';
            
            const barDiv = document.createElement('div');
            barDiv.className = 'sq-word-bar';
            const fillDiv = document.createElement('div');
            fillDiv.className = 'sq-word-fill ' + (isFake ? 'fake-word' : 'real-word');
            fillDiv.style.width = (scoreValue * 100) + '%';
            
            barDiv.appendChild(fillDiv);
            item.appendChild(wordSpan);
            item.appendChild(scoreSpan);
            item.appendChild(barDiv);
            wordList.appendChild(item);
        });
        
        document.getElementById('moduleExplanation').textContent = 
            'These words contributed to ' + verdict + ' news prediction';
    } else {
        wordList.innerHTML = '<p class="sq-module-sub">No important words identified</p>';
        document.getElementById('moduleExplanation').textContent = 
            'No significant words found in this article';
    }
}
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      analyzeForm.reset();
      resultContent.classList.add('d-none');
      resultLoading.classList.add('d-none');
      resultEmpty.classList.remove('d-none');
    });
  }

  /* =======================================================
     6. URL ANALYSIS — analyzeURL()
     ======================================================= */
  const urlForm = document.getElementById('urlForm');
  const urlAnalyzeBtn = document.getElementById('urlAnalyzeBtn');
  const urlResult = document.getElementById('urlResult');

  const demoUrlOutcomes = [
    { score: '82 / 100', trust: 'High', age: '8 years', risk: 'Low' },
    { score: '34 / 100', trust: 'Low', age: '3 months', risk: 'High' },
    { score: '61 / 100', trust: 'Medium', age: '2 years', risk: 'Medium' }
  ];

  /**
   * analyzeURL()
   * Currently returns a simulated credibility report for demo purposes.
   *
   * --- FASTAPI INTEGRATION POINT ---
   * Replace the simulated block below with a real API call once the
   * backend is deployed, e.g.:
   *
   * const response = await fetch("http://localhost:8000/analyze-url", {
   *   method: "POST",
   *   headers: { "Content-Type": "application/json" },
   *   body: JSON.stringify({ url })
   * });
   * const data = await response.json();
   * return data;
   * ----------------------------------
   */
 async function analyzeURL(url) {
    try {
        const response = await fetch("http://localhost:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url })
        });
        const data = await response.json();
        return {
            score: data.source.score + '/100',
            trust: data.source.reputation,
            age: 'N/A',
            risk: data.source.risk
        };
    } catch (error) {
        console.error("Error:", error);
        return { score: 'Error', trust: 'Error', age: 'Error', risk: 'Error' };
    }
}
  if (urlForm) {
    urlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const urlInput = document.getElementById('newsUrl');
      const url = urlInput.value.trim();

      if (!url) {
        urlInput.classList.add('is-invalid');
        setTimeout(function () { urlInput.classList.remove('is-invalid'); }, 1500);
        return;
      }

      urlAnalyzeBtn.disabled = true;
      urlAnalyzeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Scanning...';

      analyzeURL(url).then(function (result) {
        document.getElementById('urlCredScore').textContent = result.score;
        document.getElementById('urlTrustLevel').textContent = result.trust;
        document.getElementById('urlDomainAge').textContent = result.age;
        document.getElementById('urlRiskLevel').textContent = result.risk;

        urlResult.classList.remove('d-none');

        urlAnalyzeBtn.disabled = false;
        urlAnalyzeBtn.innerHTML = '<i class="bi bi-search me-2"></i>Analyze URL';
      });
    });
  }

  /* =======================================================
     7. CONTACT FORM — demo submission feedback
     ======================================================= */
  const contactForm = document.getElementById('contactForm');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');
  const contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.classList.add('was-validated');
        return;
      }

      contactSubmitBtn.disabled = true;
      contactSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

      // --- FASTAPI / EMAIL INTEGRATION POINT ---
      // fetch("http://localhost:8000/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, message })
      // });

      setTimeout(function () {
        contactSuccess.classList.remove('d-none');
        contactForm.reset();
        contactForm.classList.remove('was-validated');

        contactSubmitBtn.disabled = false;
        contactSubmitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Send Message';

        setTimeout(function () { contactSuccess.classList.add('d-none'); }, 5000);
      }, 1200);
    });
  }

});
