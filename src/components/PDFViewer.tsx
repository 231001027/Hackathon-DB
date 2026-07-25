import { useState } from 'react';
import { FileText, Download, X, Eye } from 'lucide-react';

interface PDFViewerProps {
  title?: string;
  pdfUrl: string;
  fileName?: string;
}

export default function PDFViewer({ 
  title = 'Reference Document', 
  pdfUrl = '/reference-abstract-key.pdf',
  fileName = 'reference-abstract-key.pdf'
}: PDFViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

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
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-500/10"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">View</span>
            </button>
            <a
              href={pdfUrl}
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
          <div className="glass-card relative max-h-[90vh] w-[90vw] max-w-4xl overflow-hidden">
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
                  href={pdfUrl}
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
            <div className="overflow-auto bg-slate-50 dark:bg-slate-900">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                className="h-[calc(90vh-60px)] w-full border-0"
                title={title}
              />
            </div>

            {/* Note */}
            <div className="border-t border-slate-200/20 bg-slate-50/50 p-3 text-center text-xs text-slate-600 dark:border-slate-700/20 dark:bg-slate-900/50 dark:text-slate-400">
              💡 You can also download the PDF to view it on your device
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
