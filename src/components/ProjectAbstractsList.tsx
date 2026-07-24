import React, { useState, useMemo } from 'react';
import { Search, Lock } from 'lucide-react';
import { PROJECT_ABSTRACTS } from '../data/projectAbstracts';
import ProjectAbstractCard from './ProjectAbstractCard';
import { useAuth } from '../context/AuthContext';

interface ProjectAbstractsListProps {
  selectedProjectId?: string;
  onSelectProject?: (projectId: string) => void;
  showSelectionOnly?: boolean;
  viewMode?: 'grid' | 'list';
  showSelectButton?: boolean;
}

export default function ProjectAbstractsList({
  selectedProjectId,
  onSelectProject,
  showSelectionOnly = false,
  viewMode = 'list',
  showSelectButton = true,
}: ProjectAbstractsListProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Extract unique domains and difficulties
  const domains = useMemo(
    () => ['all', ...new Set(PROJECT_ABSTRACTS.map((p) => p.domain))],
    []
  );
  const difficulties = useMemo(
    () => ['all', ...new Set(PROJECT_ABSTRACTS.map((p) => p.difficulty))],
    []
  );

  // Filter projects
  const filteredProjects = useMemo(() => {
    return PROJECT_ABSTRACTS.filter((project) => {
      const matchesSearch =
        searchTerm === '' ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.problemStatement.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDomain =
        selectedDomain === 'all' || project.domain === selectedDomain;

      const matchesDifficulty =
        selectedDifficulty === 'all' || project.difficulty === selectedDifficulty;

      return matchesSearch && matchesDomain && matchesDifficulty;
    });
  }, [searchTerm, selectedDomain, selectedDifficulty]);

  return (
    <div className="space-y-6">
      {/* Info Banner for non-leaders */}
      {user && !user.isLeader && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900">View Only</h3>
            <p className="text-sm text-blue-700">
              Only team leaders can select projects. Your team leader will choose a project for your team.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Domain Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Domain
            </label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain === 'all' ? 'All Domains' : domain}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredProjects.length} of {PROJECT_ABSTRACTS.length} projects
        </div>
      </div>

      {/* Projects Grid/List */}
      <div
        className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }`}
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectAbstractCard
              key={project.id}
              project={project}
              isSelected={selectedProjectId === project.id}
              onSelect={onSelectProject}
              showSelectButton={showSelectButton}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No projects match your filters.</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
