import { useState, useEffect } from 'react';
import { FileText, Download, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface PDFViewerProps {
  title?: string;
  pdfUrl: string;
  fileName?: string;
}

export default function PDFViewer({ 
  title = 'Reference Document', 
  pdfUrl = '/Reference%20abstract.key.pdf',
  fileName = 'Reference abstract.key.pdf'
}: PDFViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fix URL encoding
  const encodedPdfUrl = pdfUrl.includes('%20') ? pdfUrl : pdfUrl.replace(/ /g, '%20');

  useEffect(() => {
    if (!isOpen) return;

    // Dynamically load PDF.js
    const loadPdfJs = async () => {
      try {
        setLoading(true);
        const pdfjsLib = (window as any).pdfjsLib;
        
        if (!pdfjsLib) {
          // Load PDF.js from CDN
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            renderPDF();
          };
          document.head.appendChild(script);
        } else {
          renderPDF();
        }
      } catch (error) {
        console.error('Failed to load PDF.js:', error);
        setLoading(false);
      }
    };

    const renderPDF = async () => {
      try {
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) return;

        const pdf = await pdfjsLib.getDocument(encodedPdfUrl).promise;
        setTotalPages(pdf.numPages);
        await renderPage(pdf, 1);
        setLoading(false);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setLoading(false);
      }
    };

    const renderPage = async (pdf: any, pageNum: number) => {
      try {
        const page = await pdf.getPage(pageNum);
        const canvas = document.getElementById('pdf-canvas') as HTMLCanvasElement;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    loadPdfJs();
  }, [isOpen, encodedPdfUrl]);

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="space-y-3">
      {/* Closed State */}
      {!isOpen && (
        <div className="glass-card flex items-center justify-between p-4 hover:border-brand-400 transition-all dark:hover:border-brand-500">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
              <FileText className="h-5 w-5 text-brand-600 dark:text-brand-300" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{fileName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsOpen(true);
                setCurrentPage(1);
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-500/10"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </button>
            <a
              href={encodedPdfUrl}
              download={fileName}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-accent-600 transition-colors hover:bg-accent-50 dark:text-accent-300 dark:hover:bg-accent-500/10"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>
      )}

      {/* Open State - PDF Viewer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-card relative max-h-[90vh] w-[90vw] max-w-4xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/20 p-4 dark:border-slate-700/20">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-brand-600 dark:text-brand-300" />
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{fileName}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a
                  href={encodedPdfUrl}
                  download={fileName}
                  className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  title="Download PDF"
                >
                  <Download className="h-5 w-5" />
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="overflow-auto bg-slate-50 dark:bg-slate-900 flex-1 flex items-center justify-center">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900/30 mb-3">
                      <div className="animate-spin h-6 w-6 border-2 border-brand-600 border-t-transparent rounded-full" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">Loading PDF...</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full">
                  <canvas
                    id="pdf-canvas"
                    className="max-w-full max-h-96 rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Navigation */}
            {totalPages > 0 && (
              <div className="border-t border-slate-200/20 bg-slate-50/50 p-4 dark:border-slate-700/20 dark:bg-slate-900/50 flex items-center justify-between">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Note */}
            <div className="border-t border-slate-200/20 bg-slate-50/50 p-3 text-center text-xs text-slate-600 dark:border-slate-700/20 dark:bg-slate-900/50 dark:text-slate-400">
              💡 You can download the PDF to view it on your device
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
