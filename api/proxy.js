// api/proxy.js
// 这个函数默认运行在美国华盛顿 (iad1)

export const config = {
  runtime: 'edge', // 尝试使用 Edge，但在配置里强制区域
  regions: ['iad1'], // 强制只在美国东部运行
};

export default async function handler(req) {
  const url = new URL(req.url);
  
  // 1. 提取目标路径 (把 /api/proxy 去掉，保留后面的)
  // 例如: https://你的vercel.app/api/proxy?path=v1beta/...
  const targetPath = url.searchParams.get('path');
  const targetKey = url.searchParams.get('key');

  if (!targetPath || !targetKey) {
    return new Response("Missing path or key parameters", { status: 400 });
  }

  // 2. 构造 Google 的真实 URL
  // 最终变成: https://generativelanguage.googleapis.com/v1beta/models/...?key=...
  const googleUrl = `https://generativelanguage.googleapis.com/${targetPath}?key=${targetKey}`;

  // 3. 转发请求 (强制从美国发出)
  const modifiedRequest = new Request(googleUrl, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: req.body,
  });

  try {
    const response = await fetch(modifiedRequest);
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
