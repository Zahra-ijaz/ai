# 🤖 AI-Powered Fake News Detection System

An end-to-end machine learning system that detects fake news articles using 6 integrated AI modules with **95% accuracy**.

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🚀 Live Demo

🔗 **[Try the Live App](https://your-app.onrender.com)** *(Replace with your Render URL after deployment)*

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [6 AI Modules](#-6-ai-modules)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Contributors](#-contributors)
- [License](#-license)

---

## 📖 Overview

**TruthScope AI** is a comprehensive fake news detection system that analyzes news articles from multiple perspectives. It combines **machine learning**, **natural language processing**, and **explainable AI** to provide transparent and accurate predictions.

The system processes articles through **6 integrated modules**:
- 🔍 Fake News Detection
- 😊 Sentiment Analysis
- 📌 News Categorization
- 🔗 Source Verification
- 💡 Explainable AI
- 🌐 URL Analysis

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **95% Accuracy** | Trained on 170,000+ news articles |
| 🤖 **6 AI Modules** | Comprehensive multi-angle analysis |
| 🔍 **URL Analysis** | Scrape and analyze any news URL |
| 📝 **Text Analysis** | Paste any article for instant results |
| 💡 **Explainable AI** | See WHY it predicted Fake or Real |
| 🔗 **Source Verification** | Check credibility of news sources |
| 😊 **Sentiment Analysis** | Detect positive/negative/neutral tone |
| 📌 **Category Detection** | Classify into Politics, Health, Sports, Business |
| 🌐 **Web Interface** | Beautiful, responsive, dark-themed UI |
| 🚀 **Deployable** | Ready for Render, Netlify, or any cloud |

---

## 🧠 6 AI Modules

| Module | Function | Technology |
|--------|----------|------------|
| **Module 1** | Fake News Detection | Logistic Regression, Random Forest, SVM, Naive Bayes |
| **Module 2** | Sentiment Analysis | TextBlob, NLTK |
| **Module 3** | News Categorization | Multinomial Naive Bayes |
| **Module 4** | Source Verification | Domain reputation scoring |
| **Module 5** | Explainable AI | TF-IDF word importance |
| **Module 6** | URL Analysis | BeautifulSoup web scraping |

---

## 🛠️ Tech Stack

### Backend
- **Python 3.9+**
- **Flask** - Web framework
- **Scikit-learn** - Machine Learning
- **NLTK** - Natural Language Processing
- **TextBlob** - Sentiment Analysis
- **BeautifulSoup** - Web scraping

### Frontend
- **HTML5**
- **CSS3** (Custom dark theme)
- **JavaScript** (Vanilla JS)
- **Bootstrap 5**
- **Bootstrap Icons**

### Deployment
- **Render** - Backend hosting
- **GitHub** - Version control

---

## 📁 Project Structure
AI/
│
├── app.py # Flask backend (all 6 modules)
├── requirements.txt # Python dependencies
├── render.yaml # Render deployment config
├── .gitignore # Git ignore rules
│
├── templates/
│ └── index.html # Main frontend
│
├── static/
│ ├── style.css # Custom styles
│ └── script.js # Frontend logic
│
├── module 1/ # Fake News Detection
│ ├── fake_new_detect.ipynb
│ ├── fake_news_model.pkl
│ └── tfidf_vectorizer.pkl
│
├── module 2/ # Sentiment Analysis
│ ├── sentiment_analysis.ipynb
│ └── news_with_sentiment.csv
│
├── module 3/ # Category Detection
│ ├── news_category_detction.ipynb
│ ├── category_model.pkl
│ └── category_tfidf.pkl
│
├── module 4/ # Source Verification
│ ├── source_Verification&credibility_checker.ipynb
│ └── sources.csv
│
├── module 5/ # Explainable AI
│ └── explainableAI.ipynb
│
└── module 6/ # URL Analyzer
└── url_analyzer.ipynb


---

## 💻 Installation

### Prerequisites
- Python 3.9+
- pip

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/Zahra-ijaz/ai.git
cd ai

2.Create virtual environment

bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
Install dependencies

bash
pip install -r requirements.txt
Download NLTK data

3.Install dependencies
pip install -r requirements.txt


4.Download NLTK data
import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('vader_lexicon')
Run the application

5.Run the application
python app.py


6.Open in browser
http://localhost:5000


## 🎯 Usage

### Analyze a News Article

1. Open the web interface
2. Paste the article text in the text box
3. Click **"Analyze News"**
4. View results from all 6 modules

### Analyze a URL

1. Enter a news URL in the URL input
2. Click **"Analyze URL"**
3. The system scrapes and analyzes the article

### Understanding Results

| Result | What It Means |
|--------|---------------|
| **Fake** | Article shows patterns of misinformation |
| **Real** | Article matches credible news patterns |
| **Confidence %** | How sure the model is |
| **Important Words** | Words that influenced the prediction |
| **Sentiment** | Emotional tone of the article |
| **Category** | News category (Politics, Health, etc.) |
| **Source Score** | Credibility of the source domain |


## 🤝 Contributors

| Name | Role |
|------|------|
| **[Zahra Ijaz](https://github.com/Zahra-ijaz)** | Developer |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by Zahra Ijaz**