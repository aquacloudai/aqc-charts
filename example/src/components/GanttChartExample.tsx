import { GanttChart, useResolvedTheme } from '@aquacloud_ai/aqc-charts';

interface GanttChartExampleProps {
  theme: 'light' | 'dark' | 'auto';
  onInteraction?: (data: string) => void;
}

// Project timeline data
const projectData = {
  tasks: [
    {
      id: 'planning',
      name: 'Project Planning',
      category: 'Management',
      startTime: '2024-01-01',
      endTime: '2024-01-15',
      status: 'completed' as const,
      progress: 100,
    },
    {
      id: 'design',
      name: 'UI/UX Design',
      category: 'Design',
      startTime: '2024-01-10',
      endTime: '2024-02-01',
      status: 'completed' as const,
      progress: 100,
    },
    {
      id: 'frontend',
      name: 'Frontend Development',
      category: 'Development',
      startTime: '2024-01-25',
      endTime: '2024-03-15',
      status: 'in-progress' as const,
      progress: 75,
    },
    {
      id: 'backend',
      name: 'Backend Development',
      category: 'Development',
      startTime: '2024-02-01',
      endTime: '2024-03-20',
      status: 'in-progress' as const,
      progress: 60,
    },
    {
      id: 'testing',
      name: 'Testing & QA',
      category: 'QA',
      startTime: '2024-03-01',
      endTime: '2024-04-01',
      status: 'pending' as const,
      progress: 0,
    },
    {
      id: 'deployment',
      name: 'Deployment',
      category: 'DevOps',
      startTime: '2024-03-25',
      endTime: '2024-04-10',
      status: 'pending' as const,
      progress: 0,
    },
  ],
  categories: [
    { name: 'Management', label: 'Project Management' },
    { name: 'Design', label: 'Design Team' },
    { name: 'Development', label: 'Dev Team' },
    { name: 'QA', label: 'Quality Assurance' },
    { name: 'DevOps', label: 'DevOps Team' },
  ],
};

// Sprint planning data
const sprintData = {
  tasks: [
    {
      id: 'story1',
      name: 'User Authentication',
      category: 'Sprint 1',
      startTime: '2024-02-01',
      endTime: '2024-02-07',
      status: 'completed' as const,
      progress: 100,
    },
    {
      id: 'story2',
      name: 'Dashboard Layout',
      category: 'Sprint 1',
      startTime: '2024-02-05',
      endTime: '2024-02-12',
      status: 'completed' as const,
      progress: 100,
    },
    {
      id: 'story3',
      name: 'API Integration',
      category: 'Sprint 2',
      startTime: '2024-02-12',
      endTime: '2024-02-20',
      status: 'in-progress' as const,
      progress: 80,
    },
    {
      id: 'story4',
      name: 'Data Visualization',
      category: 'Sprint 2',
      startTime: '2024-02-15',
      endTime: '2024-02-25',
      status: 'in-progress' as const,
      progress: 45,
    },
    {
      id: 'story5',
      name: 'Export Features',
      category: 'Sprint 3',
      startTime: '2024-02-25',
      endTime: '2024-03-05',
      status: 'pending' as const,
      progress: 0,
    },
  ],
  categories: [
    { name: 'Sprint 1', label: 'Sprint 1 (Feb 1-14)' },
    { name: 'Sprint 2', label: 'Sprint 2 (Feb 15-28)' },
    { name: 'Sprint 3', label: 'Sprint 3 (Mar 1-14)' },
  ],
};

// Simple timeline
const simpleTimeline = {
  tasks: [
    {
      id: 'phase1',
      name: 'Research',
      category: 'Project',
      startTime: '2024-01-01',
      endTime: '2024-01-31',
      status: 'completed' as const,
    },
    {
      id: 'phase2',
      name: 'Development',
      category: 'Project',
      startTime: '2024-02-01',
      endTime: '2024-03-31',
      status: 'in-progress' as const,
    },
    {
      id: 'phase3',
      name: 'Launch',
      category: 'Project',
      startTime: '2024-04-01',
      endTime: '2024-04-15',
      status: 'pending' as const,
    },
  ],
  categories: [
    { name: 'Project', label: 'Product Launch' },
  ],
};

export function GanttChartExample({ theme, onInteraction }: GanttChartExampleProps) {
  const resolvedTheme = useResolvedTheme(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Project Timeline */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Project Timeline
        </h3>
        <GanttChart
          data={projectData}
          title="Software Development Project"
          theme={theme}
          height={400}
          showTaskProgress
          todayMarker
          onTaskClick={(task) => {
            onInteraction?.(`Task: ${task.name} (${task.status}) - ${task.progress || 0}% complete`);
          }}
        />
      </section>

      {/* Sprint Planning */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Sprint Planning
        </h3>
        <GanttChart
          data={sprintData}
          title="Agile Sprint Overview"
          theme={theme}
          height={350}
          showTaskProgress
          todayMarker
        />
      </section>

      {/* Simple Timeline */}
      <section>
        <h3 style={{ margin: '0 0 16px 0', color: resolvedTheme === 'dark' ? '#fff' : '#333' }}>
          Simple Project Phases
        </h3>
        <GanttChart
          data={simpleTimeline}
          title="Product Launch Timeline"
          theme={theme}
          height={200}
          todayMarker
        />
      </section>
    </div>
  );
}
