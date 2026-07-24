import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProjectAbstract } from '../data/projectAbstracts';
import { useAuth } from '../context/AuthContext';

interface ProjectAbstractCardProps {
  project: ProjectAbstract;
  isSelected?: boolean;
  onSelect?: (projectId: string) => void;
  showSelectButton?: boolean;
}

export default function ProjectAbstractCard({
  project,
  isSelected = false,
  onSelect,
  showSelectButton = true,
}: ProjectAbstractCardProps) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);

  // Only team leaders can select projects
  const canSelect = showSelectButton && user?.isLeader === true;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      'AI/Accessibility': 'bg-purple-100 text-purple-800',
      'AR/VR': 'bg-blue-100 text-blue-800',
      'Mobile/AI': 'bg-indigo-100 text-indigo-800',
      'VR/Assessment': 'bg-cyan-100 text-cyan-800',
      'AR/Education': 'bg-teal-100 text-teal-800',
      'Speech/AI': 'bg-pink-100 text-pink-800',
      'AI/Engagement': 'bg-orange-100 text-orange-800',
      'AI/Healthcare': 'bg-rose-100 text-rose-800',
      'Web/Education': 'bg-amber-100 text-amber-800',
      'Hardware/IoT': 'bg-lime-100 text-lime-800',
    };
    return colors[domain] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      className={`rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div
        className="p-4 cursor-pointer"
        onClick={() => {
          setExpanded(!expanded);
          if (onSelect) onSelect(project.id);
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center">
                {project.problemNumber}
              </span>
              <h3 className="font-bold text-gray-900 text-lg">{project.title}</h3>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                  project.difficulty
                )}`}
              >
                {project.difficulty}
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDomainColor(
                  project.domain
                )}`}
              >
                {project.domain}
              </span>
            </div>

            {/* Preview */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.problemStatement}
            </p>
          </div>

          {/* Expand Icon */}
          <button className="mt-1 p-1 hover:bg-gray-100 rounded">
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-200 px-4 py-4 space-y-4">
          {/* Problem Statement */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Problem Statement</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {project.problemStatement}
            </p>
          </div>

          {/* Development Guidelines */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Development Guidelines</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {project.developmentGuidelines}
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold mt-0.5">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Expected Solution */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Expected Solution</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {project.expectedSolution.map((solution, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Select Button */}
          {canSelect && !isSelected && (
            <button
              onClick={() => onSelect?.(project.id)}
              className="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
            >
              Select This Project
            </button>
          )}
          {canSelect && isSelected && (
            <div className="w-full mt-4 px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg text-center border-2 border-green-500">
              ✓ Selected
            </div>
          )}
        </div>
      )}
    </div>
  );
}
