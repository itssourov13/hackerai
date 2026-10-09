/** Central upload limits — adjust here to affect all upload validations */
export const UPLOAD_LIMITS = {
  pdf: 100 * 1024 * 1024,       // 100 MB
  docx: 50 * 1024 * 1024,       // 50 MB
  txt: 20 * 1024 * 1024,        // 20 MB
  md: 20 * 1024 * 1024,         // 20 MB
  zip: 250 * 1024 * 1024,       // 250 MB
  image: 25 * 1024 * 1024,      // 25 MB
  code: 10 * 1024 * 1024,       // 10 MB (js/ts/py/html/css)
  json: 10 * 1024 * 1024,       // 10 MB
  csv: 20 * 1024 * 1024,        // 20 MB
  default: 10 * 1024 * 1024,    // 10 MB fallback

  maxProjectUpload: 500 * 1024 * 1024,   // 500 MB total per project
  maxFilesPerUpload: 500,                 // max files in one upload batch
} as const;

export type SupportedMimeType =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'text/plain'
  | 'text/markdown'
  | 'application/json'
  | 'text/csv'
  | 'application/zip'
  | 'application/x-zip-compressed'
  | 'image/png'
  | 'image/jpeg'
  | 'image/gif'
  | 'image/webp'
  | 'text/javascript'
  | 'text/typescript'
  | 'text/x-python'
  | 'text/html'
  | 'text/css';

const MIME_TO_LIMIT: Record<string, number> = {
  'application/pdf': UPLOAD_LIMITS.pdf,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': UPLOAD_LIMITS.docx,
  'text/plain': UPLOAD_LIMITS.txt,
  'text/markdown': UPLOAD_LIMITS.md,
  'application/json': UPLOAD_LIMITS.json,
  'text/csv': UPLOAD_LIMITS.csv,
  'application/zip': UPLOAD_LIMITS.zip,
  'application/x-zip-compressed': UPLOAD_LIMITS.zip,
  'image/png': UPLOAD_LIMITS.image,
  'image/jpeg': UPLOAD_LIMITS.image,
  'image/gif': UPLOAD_LIMITS.image,
  'image/webp': UPLOAD_LIMITS.image,
  'text/javascript': UPLOAD_LIMITS.code,
  'text/typescript': UPLOAD_LIMITS.code,
  'text/x-python': UPLOAD_LIMITS.code,
  'text/html': UPLOAD_LIMITS.code,
  'text/css': UPLOAD_LIMITS.code,
};

export function getMaxSize(mimeType: string): number {
  return MIME_TO_LIMIT[mimeType] ?? UPLOAD_LIMITS.default;
}

export const ACCEPTED_EXTENSIONS = [
  '.pdf', '.docx', '.txt', '.md', '.json', '.csv', '.zip',
  '.js', '.ts', '.tsx', '.jsx', '.py', '.html', '.css',
  '.png', '.jpg', '.jpeg', '.gif', '.webp',
];

export function isAcceptedMime(mimeType: string): boolean {
  return mimeType in MIME_TO_LIMIT || mimeType.startsWith('text/');
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
