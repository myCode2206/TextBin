const express = require("express");
const Paste = require("../models/paste");
const { getCurrentTime } = require("../utils/timeUtils");

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
      url: `${process.env.BASE_URL || 'http://localhost:3000'}/api/paste/${paste._id}`
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create paste" });
  }
});

// Helper to get and validate paste
async function getAndValidatePaste(id, req) {
  const now = getCurrentTime(req);

  // First: check existence + TTL (read-only)
  const paste = await Paste.findById(id);
  if (!paste) {
    throw { status: 404, message: "Paste not found" };
  }

  // TTL check
  if (
    paste.ttl_seconds &&
    now - paste.created_at > paste.ttl_seconds * 1000
  ) {
    throw { status: 404, message: "Paste has expired" };
  }

  // Atomic view increment + max_views check
  const updatedPaste = await Paste.findOneAndUpdate(
    {
      _id: id,
      ...(paste.max_views && {
        current_views: { $lt: paste.max_views }
      })
    },
    {
      $inc: { current_views: 1 }
    },
    {
      new: true
    }
  );

  if (!updatedPaste) {
    throw { status: 404, message: "View limit reached" };
  }

  return updatedPaste;
}



// Simple HTML view
router.get("/paste/:id", async (req, res) => {
  try {
    const paste = await getAndValidatePaste(req.params.id, req);

    // Simple HTML template using textarea for safe raw text display
    res.send(`
            <!DOCTYPE html>
            <html>
            <head><title>Pastebin</title></head>
            <body style="margin:0; background:#1a1a1a; color:#eee; height:100vh; display:flex; justify-content:center; align-items:center; font-family:monospace;">

    <div style="width:80%; max-width:900px; height:80%; background:#111; border-radius:8px; box-shadow:0 0 20px rgba(0,0,0,0.6); display:flex; flex-direction:column;">

        <!-- Heading -->
        <div style="padding:1rem 1.5rem; border-bottom:1px solid #333; font-size:18px; font-weight:bold;">
            Your Paste
        </div>

        <!-- Content -->
        <textarea readonly
            style="flex:1; width:100%; background:#111; color:#eee; border:none; padding:1.5rem; box-sizing:border-box; font-size:16px; resize:none; outline:none;">
${paste.content}
        </textarea>

    </div>

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
