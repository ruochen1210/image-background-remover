import { NextRequest, NextResponse } from 'next/server';

// ⚠️ 请在此处填入您的 Remove.bg API Key
// 建议通过环境变量设置：REMOVE_BG_API_KEY
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || 'YOUR_REMOVE_BG_API_KEY';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json(
        { success: false, message: '请上传的图片文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const contentType = imageFile.type;
    if (!contentType.match('image/(png|jpeg|jpg)')) {
      return NextResponse.json(
        { success: false, message: '只支持 JPG 或 PNG 格式的图片' },
        { status: 400 }
      );
    }

    // 验证文件大小 (32MB)
    const fileSize = imageFile.size;
    if (fileSize > 32 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: '图片大小不能超过 32MB' },
        { status: 400 }
      );
    }

    // 调用 Remove.bg API
    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: imageFile,
    });

    if (!removeBgResponse.ok) {
      const errorData = await removeBgResponse.text();
      console.error('Remove.bg API error:', errorData);

      let errorMessage = '背景移除失败';
      try {
        const errorJson = JSON.parse(errorData);
        if (errorJson.errors && errorJson.errors[0]) {
          errorMessage = errorJson.errors[0].title || errorMessage;
        }
      } catch (e) {
        // 忽略解析错误
      }

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: removeBgResponse.status }
      );
    }

    // 返回处理后的图片
    const processedImage = await removeBgResponse.arrayBuffer();

    return new NextResponse(processedImage, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="background-removed.png"',
      },
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { success: false, message: '服务器错误：' + (err as Error).message },
      { status: 500 }
    );
  }
}
