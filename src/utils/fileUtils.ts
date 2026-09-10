// src/utils/fileUtils.ts
import { API_BASE_URL } from './api';

export const getFullFileUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  
  // Nếu path đã là URL tuyệt đối (chứa http/https) thì giữ nguyên
  if (path.startsWith('http')) return path;

  // Nếu là đường dẫn tương đối, ghép với Base URL từ file .env
  const baseUrl = API_BASE_URL;
  
  // Đảm bảo không bị dư dấu / ở giữa (VD: http://localhost:8080//uploads/...)
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${cleanBaseUrl}${cleanPath}`;
};