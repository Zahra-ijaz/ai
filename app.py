# ============================================
# app.py - COMPLETE BACKEND (ALL 6 MODULES)
# ============================================

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pickle
import pandas as pd
import re
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import nltk
from textblob import TextBlob
import warnings
warnings.filterwarnings('ignore')

# Download NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('stopwords')
    nltk.download('punkt')

from nltk.corpus import stopwords
stop_words = set(stopwords.words('english'))

app = Flask(__name__)
CORS(app)

print("="*60)
print("🚀 LOADING ALL 6 AI MODULES...")
print("="*60)

# ============================================
# MODULE 1: Fake News Detection
# ============================================
try:
    model = pickle.load(open("module 1/fake_news_model.pkl", "rb"))
    vectorizer = pickle.load(open("module 1/tfidf_vectorizer.pkl", "rb"))
    print("✓ Module 1: Fake News Detection loaded")
except:
    try:
        model = pickle.load(open("fake_news_model.pkl", "rb"))
        vectorizer = pickle.load(open("tfidf_vectorizer.pkl", "rb"))
        print("✓ Module 1: Fake News Detection loaded")
    except Exception as e:
        print(f"✗ Module 1 failed: {e}")
        model = None
        vectorizer = None

# ============================================
# MODULE 3: Category Detection
# ============================================
try:
    category_model = pickle.load(open("module 3/category_model.pkl", "rb"))
    category_vectorizer = pickle.load(open("module 3/category_tfidf.pkl", "rb"))
    category_encoder = pickle.load(open("module 3/category_label_encoder.pkl", "rb"))
    print("✓ Module 3: Category Detection loaded")
except:
    try:
        category_model = pickle.load(open("category_model.pkl", "rb"))
        category_vectorizer = pickle.load(open("category_tfidf.pkl", "rb"))
        category_encoder = pickle.load(open("category_label_encoder.pkl", "rb"))
        print("✓ Module 3: Category Detection loaded")
    except Exception as e:
        print(f"✗ Module 3 failed: {e}")
        category_model = None

# ============================================
# MODULE 4: Source Verification
# ============================================
try:
    sources = pd.read_csv("module 4/sources.csv")
    print(f"✓ Module 4: Source Verification loaded ({len(sources)} sources)")
except:
    try:
        sources = pd.read_csv("sources.csv")
        print(f"✓ Module 4: Source Verification loaded ({len(sources)} sources)")
    except:
        sources = pd.DataFrame({
            "source": ["reuters.com", "bbc.com", "cnn.com", "dawn.com", "aljazeera.com"],
            "score": [98, 95, 95, 90, 92]
        })
        print("✓ Module 4: Using default sources")

print("="*60)

# ============================================
# ALL MODULE FUNCTIONS
# ============================================

def clean_text(text):
    """Clean text for prediction"""
    if pd.isna(text) or str(text).strip() == '':
        return ""
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z ]", "", text)
    words = text.split()
    words = [word for word in words if word not in stop_words]
    return " ".join(words)

# Module 2: Sentiment Analysis
def get_sentiment(text):
    """Analyze sentiment using TextBlob"""
    try:
        blob = TextBlob(str(text))
        polarity = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
        
        if polarity > 0.1:
            sentiment = "Positive"
        elif polarity < -0.1:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"
        
        return {
            'sentiment': sentiment,
            'polarity': round(polarity, 3),
            'subjectivity': round(subjectivity, 3)
        }
    except:
        return {'sentiment': 'Neutral', 'polarity': 0, 'subjectivity': 0}

# Module 3: Category Detection
def detect_category(text):
    """Detect news category"""
    if category_model is None:
        return "Unknown"
    try:
        cleaned = clean_text(text)
        vector = category_vectorizer.transform([cleaned])
        pred = category_model.predict(vector)[0]
        return category_encoder.inverse_transform([pred])[0]
    except:
        return "Unknown"

# Module 4: Source Verification
def verify_source(url):
    """Verify source credibility"""
    try:
        domain = urlparse(url).netloc
        domain = domain.replace("www.", "")
        
        if domain in sources["source"].values:
            score = sources.loc[sources["source"] == domain, "score"].values[0]
            status = "Known Source"
        else:
            score = 50
            status = "Unknown Source"
        
        if score >= 90:
            reputation = "High"
            risk = "Safe"
        elif score >= 70:
            reputation = "Medium"
            risk = "Moderate"
        else:
            reputation = "Low"
            risk = "Suspicious"
        
        return {
            'domain': domain,
            'status': status,
            'score': score,
            'reputation': reputation,
            'risk': risk
        }
    except:
        return {'domain': 'unknown', 'status': 'Unknown', 'score': 50, 'reputation': 'Low', 'risk': 'Suspicious'}

# Module 5: Explainable Prediction
def explain_prediction(text):
    """Predict with explanation"""
    if model is None or vectorizer is None:
        return None
    
    try:
        cleaned = clean_text(text)
        vector = vectorizer.transform([cleaned])
        prediction = model.predict(vector)[0]
        confidence = model.predict_proba(vector).max()
        
        # Get important words
        feature_names = vectorizer.get_feature_names_out()
        vector_data = vector.toarray()[0]
        important_words = []
        
        for index, value in enumerate(vector_data):
            if value > 0:
                important_words.append((feature_names[index], round(value, 4)))
        
        important_words = sorted(important_words, key=lambda x: x[1], reverse=True)[:5]
        
        return {
            'prediction': prediction,
            'label': "Fake" if prediction == 1 else "Real",
            'confidence': round(confidence * 100, 2),
            'important_words': important_words
        }
    except Exception as e:
        return None

# Module 6: URL Scraper
def scrape_article(url):
    """Scrape article from URL"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        for script in soup(["script", "style"]):
            script.decompose()
        
        title = soup.find('title')
        title_text = title.get_text().strip() if title else "No title found"
        
        paragraphs = soup.find_all('p')
        article_text = ' '.join([p.get_text().strip() for p in paragraphs])
        
        if not article_text:
            article_tag = soup.find('article')
            if article_tag:
                article_text = article_tag.get_text().strip()
            else:
                article_text = soup.get_text().strip()
        
        article_text = ' '.join(article_text.split())
        
        return {
            'success': True,
            'title': title_text,
            'text': article_text,
            'word_count': len(article_text.split())
        }
    except Exception as e:
        return {'success': False, 'error': str(e)}

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    url = data.get('url', '')
    article_text = data.get('text', '')
    
    # Scrape if URL provided
    if url and not article_text:
        scraped = scrape_article(url)
        if scraped['success']:
            article_text = scraped['text']
            title = scraped['title']
        else:
            return jsonify({'error': scraped.get('error', 'Failed to scrape URL')})
    else:
        title = article_text[:100] + '...' if len(article_text) > 100 else article_text
    
    # Module 4: Source Verification
    source_info = verify_source(url) if url else {'domain': 'Manual Entry', 'status': 'N/A', 'score': 0}
    
    # Module 1 & 5: Fake News Detection + Explanation
    prediction = explain_prediction(article_text)
    
    # Module 2: Sentiment Analysis
    sentiment = get_sentiment(article_text)
    
    # Module 3: Category Detection
    category = detect_category(article_text)
    
    return jsonify({
        'title': title,
        'url': url,
        'source': source_info,
        'prediction': prediction,
        'sentiment': sentiment,
        'category': category,
        'word_count': len(article_text.split())
    })

if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 AI-Powered Fake News Detector")
    print("   Running at: http://localhost:5000")
    print("="*60 + "\n")
    app.run(debug=True, port=5000)