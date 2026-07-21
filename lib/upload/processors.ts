export interface ProcessedFile {
  text: string;
  wordCount: number;
  pageCount?: number;
  charCount: number;
}

/** Extract text from plain text / markdown */
export function extractText(content: string): ProcessedFile {
  const text = content.trim();
  const words = text.split(/\s+/).filter(Boolean);
  return { text, wordCount: words.length, charCount: text.length };
}

/** Extract text from PDF using pdfjs-dist (browser-side) */
export async function extractPdf(file: File): Promise<ProcessedFile> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    // Use local worker to avoid CDN dependency
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf.numPages;

    const textParts: string[] = [];
    for (let i = 1; i <= Math.min(pageCount, 200); i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      textParts.push(pageText);
    }

    const text = textParts.join('\n').trim();
    const words = text.split(/\s+/).filter(Boolean);
    return { text, wordCount: words.length, pageCount, charCount: text.length };
  } catch (err) {
    throw new Error(`PDF extraction failed: ${(err as Error).message}`);
  }
}

/** Extract text from DOCX using mammoth */
export async function extractDocx(file: File): Promise<ProcessedFile> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    const words = text.split(/\s+/).filter(Boolean);
    return { text, wordCount: words.length, charCount: text.length };
  } catch (err) {
    throw new Error(`DOCX extraction failed: ${(err as Error).message}`);
  }
}

/** List and extract text files from a ZIP archive */
export async function extractZip(
  file: File
): Promise<Array<{ name: string; content: string }>> {
  try {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const results: Array<{ name: string; content: string }> = [];

    const TEXT_EXTENSIONS = new Set([
      'txt', 'md', 'json', 'csv', 'js', 'ts', 'tsx', 'jsx',
      'py', 'html', 'css', 'sh', 'yaml', 'yml', 'xml', 'sql',
    ]);

    for (const [name, zipFile] of Object.entries(zip.files)) {
      if (zipFile.dir) continue;
      const ext = name.split('.').pop()?.toLowerCase() ?? '';
      if (!TEXT_EXTENSIONS.has(ext)) continue;

      try {
        const content = await zipFile.async('text');
        results.push({ name, content });
      } catch {
        /* skip unreadable files */
      }
    }

    return results;
  } catch (err) {
    throw new Error(`ZIP extraction failed: ${(err as Error).message}`);
  }
}

/** Route to the correct extractor based on MIME type */
export async function processFile(file: File): Promise<ProcessedFile> {
  const mime = file.type.toLowerCase();

  if (mime === 'application/pdf') return extractPdf(file);
  if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    return extractDocx(file);

  if (
    mime.startsWith('text/') ||
    ['application/json'].includes(mime)
  ) {
    const text = await file.text();
    return extractText(text);
  }

  return { text: '', wordCount: 0, charCount: 0 };
}
