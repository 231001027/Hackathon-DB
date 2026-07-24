// Explicit icon registry — avoids `import * as Icons` which bundles all of lucide.
import {
  Users, LayoutDashboard, ShieldCheck, FileUp, UserCog, Activity, Lock, BellRing,
  ClipboardList, UserPlus, Scale, Trophy,
  GraduationCap, FileCheck2, Building2,
  TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Users, LayoutDashboard, ShieldCheck, FileUp, UserCog, Activity, Lock, BellRing,
  ClipboardList, UserPlus, Scale, Trophy,
  GraduationCap, FileCheck2, Building2,
  TrendingUp,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Users;
}
