// api/proxy.js
export default async function handler(req, res) {
  // 1. 获取完整的 Google 路径 (例如 v1beta/models/...)
  // 你的 server.js 会传参数过来: ?path=...&key=...
  const { path, key } = req.query;

  if (!path || !key) {
    return res.status(400).json({ error: "Missing path or key" });
  }

  // 2. 构造 Google URL (解码 path)
  const googleUrl = `https://generativelanguage.googleapis.com/${path}?key=${key}`;

  console.log(`Proxying to: ${googleUrl}`);

  try {
    // 3. 转发请求
    const response = await fetch(googleUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json'
      },
      // Vercel 会自动解析 body，如果是 POST 需要转回字符串
      body: req.method === 'POST' ? JSON.stringify(req.body) : null
    });

    const data = await response.json();
    
    // 4. 返回结果
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
