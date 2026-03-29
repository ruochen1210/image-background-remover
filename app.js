// 配置 - 请替换为您的 Cloudflare Worker URL
const API_URL = 'https://your-worker.your-subdomain.workers.dev/api/remove-bg';

// DOM 元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const processing = document.getElementById('processing');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const preview = document.getElementById('preview');
const originalImage = document.getElementById('originalImage');
const processedImage = document.getElementById('processedImage');

// 初始化事件监听
function init() {
    // 点击上传区域
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // 文件选择
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽事件
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
}

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

// 拖拽经过
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

// 拖拽离开
function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

// 拖拽放下
function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file) {
        processFile(file);
    }
}

// 处理文件
async function processFile(file) {
    // 验证文件类型
    if (!file.type.match('image/(png|jpeg)')) {
        showError('请上传 JPG 或 PNG 格式的图片');
        return;
    }
    
    // 验证文件大小 (32MB)
    if (file.size > 32 * 1024 * 1024) {
        showError('图片大小不能超过 32MB');
        return;
    }
    
    // 显示原图预览
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // 显示处理中状态
    uploadArea.style.display = 'none';
    preview.style.display = 'none';
    error.style.display = 'none';
    processing.style.display = 'block';
    
    try {
        // 调用 API
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API 请求失败：${response.status}`);
        }
        
        // 获取处理后的图片
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        processedImage.src = url;
        
        // 存储下载 URL
        processedImage.dataset.downloadUrl = url;
        
        // 显示预览
        processing.style.display = 'none';
        preview.style.display = 'block';
        preview.style.gridTemplateColumns = '1fr 1fr';
        
    } catch (err) {
        console.error('处理失败:', err);
        showError(err.message || '处理失败，请稍后重试');
    }
}

// 显示错误
function showError(message) {
    processing.style.display = 'none';
    uploadArea.style.display = 'none';
    preview.style.display = 'none';
    error.style.display = 'block';
    errorMessage.textContent = message;
}

// 重置应用
function resetApp() {
    fileInput.value = '';
    uploadArea.style.display = 'block';
    processing.style.display = 'none';
    error.style.display = 'none';
    preview.style.display = 'none';
    originalImage.src = '';
    processedImage.src = '';
}

// 下载图片
function downloadImage() {
    const url = processedImage.dataset.downloadUrl;
    if (!url) return;
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `background-removed-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
