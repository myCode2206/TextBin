# 📋 PasteBin-Lite

A secure, fast, and minimalist text sharing application designed for simplicity and style. **PasteBin-Lite** allows you to share code snippets and text easily with optional expiration times and view limits.

![Project Banner](https://img.shields.io/badge/Status-Active-success?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Features

- **🚀 Instant Sharing**: Paste your text or code and generate a unique link instantly.
- **⏱️ Auto-Expiration**: Set a Time-To-Live (TTL) in seconds for your pastes.
- **👁️ View limits**: Configure a maximum number of views before the paste self-destructs.
- **🌑 Dark Mode UI**: A beautiful, modern, and eye-friendly dark interface.
- **📋 Auto-Copy**: Generated links are automatically copied to your clipboard.
- **📱 Responsive**: Works seamlessly on desktop and mobile devices.

## 🛠️ Tech Stack

### Frontend
- **React**: UI library for building interactive interfaces.
- **Vite**: Next Generation Frontend Tooling.
- **CSS3**: Custom dark-themed styling.

### Backend
- **Node.js & Express**: Fast and minimalist web server.
- **MongoDB & Mongoose**: NoSQL database for flexible data storage.
- **Helmet & CORS**: Enhanced security middleware.

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or Atlas URI)

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/yourusername/pastebin-lite.git
    cd pasteBin
    ```

2.  **Backend Setup**
    ```sh
    cd Backend
    npm install
    ```
    Create a `.env` file in the `Backend` directory:
    ```env
    MONGO_URI=mongodb://localhost:27017/pastebin
    BASE_URL=http://localhost:3000
    TEST_MODE=0
    PORT=3000
    ```
    Start the server:
    ```sh
    npm run dev
    ```

3.  **Frontend Setup**
    Open a new terminal:
    ```sh
    cd Frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## 🔌 API Reference

### Create Paste
POST `/pastes`

**Body:**
```json
{
  "content": "Your text content here",
  "ttl_seconds": 3600, // Optional: Expire after 1 hour
  "max_views": 5       // Optional: Expire after 5 views
}
```

**Response:**
```json
{
  "url": "http://localhost:3000/pastes/unique_id",
  "expiresAt": "2024-03-20T12:00:00.000Z",
  "remainingViews": 5
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---


