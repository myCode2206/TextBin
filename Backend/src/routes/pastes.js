const express = require("express");
const Paste = require("../models/paste");

const router = express.Router();

// Quick health check for DB
router.get("/healthz", async (req, res) => {
    try {
        await Paste.findOne();
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ ok: false });
    }
});

// Create a new paste
router.post("/pastes", async (req, res) => {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content?.trim()) {
        return res.status(400).json({ error: "Content is required" });
    }

    if (ttl_seconds < 1 || max_views < 1) {
        return res.status(400).json({ error: "Invalid parameters" });
    }

    try {
        const paste = await Paste.create({
            content,
            ttl_seconds: ttl_seconds || null,
            max_views: max_views || null
        });

        res.status(201).json({
            id: paste._id,
            url: `${process.env.BASE_URL || 'http://localhost:3000'}/paste/${paste._id}`
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to create paste" });
    }
});

// Helper to get and validate paste
async function getAndValidatePaste(id) {
    const now = new Date();
    const paste = await Paste.findById(id);

    if (!paste) {
        throw { status: 404, message: "Paste not found" };
    }

    // Check TTL
    if (paste.ttl_seconds && (now - paste.created_at > paste.ttl_seconds * 1000)) {
        throw { status: 404, message: "Paste has expired" };
    }

    // Check Max Views
    if (paste.max_views && paste.current_views >= paste.max_views) {
        throw { status: 404, message: "View limit reached" };
    }

    // Increment views
    paste.current_views += 1;
    await paste.save();

    return paste;
}


// Simple HTML view
router.get("/paste/:id", async (req, res) => {
    try {
        const paste = await getAndValidatePaste(req.params.id);

        // Simple HTML template using textarea for safe raw text display
        res.send(`
            <!DOCTYPE html>
            <html>
            <head><title>Pastebin</title></head>
            <body style="margin: 0; background: #1a1a1a; color: #eee; height: 100vh; overflow: hidden;">
                <textarea readonly style="width: 100%; height: 100%; background: #1a1a1a; color: #eee; border: none; padding: 2rem; box-sizing: border-box; font-family: monospace; font-size: 16px; resize: none; outline: none;">${paste.content}</textarea>
            </body>
            </html>
        `);
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).send("404 - Not Found or Expired");
        }
        res.status(500).send("Server Error");
    }
});

module.exports = router;
