// api/proxy.js
export default async function handler(req, res) {
  const { path, key } = req.query;

  if (!path || !key) {
    return res.status(400).json({ error: "Missing path or key parameters" });
  }

  const googleUrl = `https://generativelanguage.googleapis.com/${path}?key=${key}`;

  // 🟢 构造 fetch 选项
  const fetchOptions = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  // 🟢 关键修复：只有当方法不是 GET 或 HEAD 时，才添加 body
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    // Vercel 会自动解析 body，如果是对象则转字符串，如果是字符串直接用
    fetchOptions.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
  }

  try {
    const response = await fetch(googleUrl, fetchOptions);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
