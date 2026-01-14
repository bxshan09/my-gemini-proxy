// api/proxy.js
// ❌ 不要用 export const config = { runtime: 'edge' };
// ✅ 使用默认的 Node.js 运行时，配合 vercel.json 锁定美国区域

export default async function handler(req, res) {
  // 1. 获取 URL 参数
  const { path, key } = req.query;

  if (!path || !key) {
    return res.status(400).json({ error: "Missing path or key parameters" });
  }

  // 2. 构造 Google 的 API 地址
  const googleUrl = `https://generativelanguage.googleapis.com/${path}?key=${key}`;

  try {
    // 3. 转发请求 (Node.js 环境下 fetch 是内置的)
    // 注意：req.body 在 Vercel 函数中已经被解析为对象了，所以需要再次 stringify
    const response = await fetch(googleUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body) 
    });

    const data = await response.json();

    // 4. 返回结果
    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
