// api/proxy.js

export default async function handler(req, res) {
  const { path, key } = req.query;

  if (!path || !key) {
    return res.status(400).json({ error: "Missing path or key" });
  }

  // 🟢 关键修复：强制解码 path
  // server.js 发过来的是 encodeURIComponent 过的字符串 (含 %3A)
  // 我们必须 decodeURIComponent 把它变回冒号 (:)
  // 否则 Google 会报 "Model not found"
  const cleanPath = decodeURIComponent(path);

  // 构造 Google URL
  const googleUrl = `https://generativelanguage.googleapis.com/${cleanPath}?key=${key}`;

  console.log(`Proxying to: ${googleUrl}`);

  try {
    const response = await fetch(googleUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : null
    });

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
