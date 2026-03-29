// Cloudflare Worker - API 代理
// 用于隐藏 Remove.bg API Key 并处理跨域请求

// ⚠️ 请在此处填入您的 Remove.bg API Key
const REMOVE_BG_API_KEY = 'YOUR_REMOVE_BG_API_KEY';

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }
    
    // 只处理 POST 请求
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    try {
      // 解析 FormData
      const formData = await request.formData();
      const imageFile = formData.get('image');
      
      if (!imageFile) {
        return jsonResponse({ 
          success: false, 
          message: '请上传的图片文件' 
        }, 400);
      }
      
      // 验证文件类型
      const contentType = imageFile.type;
      if (!contentType.match('image/(png|jpeg)')) {
        return jsonResponse({ 
          success: false, 
          message: '只支持 JPG 或 PNG 格式的图片' 
        }, 400);
      }
      
      // 验证文件大小 (32MB)
      const fileSize = imageFile.size;
      if (fileSize > 32 * 1024 * 1024) {
        return jsonResponse({ 
          success: false, 
          message: '图片大小不能超过 32MB' 
        }, 400);
      }
      
      // 调用 Remove.bg API
      const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': REMOVE_BG_API_KEY
        },
        body: imageFile
      });
      
      if (!removeBgResponse.ok) {
        const errorData = await removeBgResponse.text();
        console.error('Remove.bg API error:', errorData);
        
        // 解析错误信息
        let errorMessage = '背景移除失败';
        try {
          const errorJson = JSON.parse(errorData);
          if (errorJson.errors && errorJson.errors[0]) {
            errorMessage = errorJson.errors[0].title || errorMessage;
          }
        } catch (e) {
          // 忽略解析错误
        }
        
        return jsonResponse({ 
          success: false, 
          message: errorMessage 
        }, removeBgResponse.status);
      }
      
      // 返回处理后的图片
      const processedImage = await removeBgResponse.arrayBuffer();
      
      return new Response(processedImage, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': 'attachment; filename="background-removed.png"',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
      
    } catch (err) {
      console.error('Worker error:', err);
      return jsonResponse({ 
        success: false, 
        message: '服务器错误：' + err.message 
      }, 500);
    }
  }
};

// 辅助函数：返回 JSON 响应
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// 辅助函数：处理 CORS
function handleCORS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
