import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, FileText, CheckCircle2, UploadCloud, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import StatusBadge from '@/components/ui/StatusBadge';

export default function UploadCard() {
  const { user, teams, uploadPdf } = useAuth();
  const { success, error } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const team = teams.find((t) => t.id === user?.teamId);
  if (!team) return null;

  const isLeader = user?.isLeader;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      error('Invalid file type', 'Only PDF files are accepted.');
      e.target.value = '';
      setFileName('');
      return;
    }
    setFileName(file.name);
  };

  const handleUpload = () => {
    if (!fileName) {
      error('No file selected', 'Please choose a PDF file first.');
      return;
    }
    setUploading(true);
    setTimeout(() => {
      uploadPdf(fileName);
      setUploading(false);
      success('Submission completed!', `${fileName} has been uploaded successfully.`);
    }, 1300);
  };

  // Member view — read-only
  if (!isLeader) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/15">
            <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Project PDF Upload</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Leader-only permission</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-amber-200/60 bg-amber-50/60 p-4 text-center dark:border-amber-500/20 dark:bg-amber-500/10">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Only the Team Leader is authorized to upload the project PDF.
          </p>
        </div>
        {team.pdfName && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/50 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-600 dark:text-brand-300" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{team.pdfName}</span>
            </div>
            <StatusBadge status={team.submissionStatus} size="sm" />
          </div>
        )}
      </div>
    );
  }

  // Leader view — full upload controls
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 ring-1 ring-brand-500/20">
          <FileUp className="h-5 w-5 text-brand-600 dark:text-brand-300" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Upload Project PDF</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Only the team leader can upload</p>
        </div>
      </div>

      {team.submissionStatus === 'submitted' && team.pdfName ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 rounded-xl border border-emerald-200/60 bg-emerald-50/60 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Submission Completed</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">{team.pdfName}</p>
            </div>
            <StatusBadge status="submitted" size="sm" />
          </div>
        </motion.div>
      ) : (
        <div className="mt-4 space-y-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/40 p-6 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-800/20 dark:hover:border-brand-500"
          >
            <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            <UploadCloud className="mx-auto h-9 w-9 text-slate-400 transition-colors group-hover:text-brand-500" />
            <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {fileName ? fileName : 'Choose File'}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">PDF files only (max 10MB)</p>
          </div>

          <AnimatePresence>
            {fileName && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
                <FileText className="h-5 w-5 text-brand-600 dark:text-brand-300" />
                <span className="flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">{fileName}</span>
                <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">PDF</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleUpload}
            disabled={!fileName || uploading}
            className="btn-primary w-full"
          >
            {uploading ? (
              <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Uploading…</span>
            ) : (
              <span className="flex items-center gap-2"><UploadCloud className="h-4 w-4" /> Upload PDF</span>
            )}
          </button>

          <div className="flex items-center gap-2 rounded-lg bg-slate-100/60 p-2.5 text-xs text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-slate-400" />
            Upload status: <StatusBadge status={team.submissionStatus} size="sm" />
          </div>
        </div>
      )}
    </div>
  );
}
