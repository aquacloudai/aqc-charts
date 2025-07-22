import React from 'react';
import { GanttChart } from 'aqc-charts';

// Sample project data for Gantt chart demonstrations
const projectTasks = [
  {
    id: 'task1',
    name: 'Project Planning',
    category: 'Management',
    startTime: '2024-01-01',
    endTime: '2024-01-10',
    status: 'completed',
    progress: 100,
    assignee: 'Project Manager',
    priority: 'high'
  },
  {
    id: 'task2',
    name: 'Requirements Gathering',
    category: 'Analysis',
    startTime: '2024-01-05',
    endTime: '2024-01-20',
    status: 'completed',
    progress: 100,
    assignee: 'Business Analyst',
    priority: 'high'
  },
  {
    id: 'task3',
    name: 'System Design',
    category: 'Design',
    startTime: '2024-01-15',
    endTime: '2024-02-05',
    status: 'completed',
    progress: 100,
    assignee: 'Lead Architect',
    priority: 'high'
  },
  {
    id: 'task4',
    name: 'UI/UX Design',
    category: 'Design',
    startTime: '2024-01-25',
    endTime: '2024-02-15',
    status: 'in-progress',
    progress: 85,
    assignee: 'UX Designer',
    priority: 'medium'
  },
  {
    id: 'task5',
    name: 'Backend Development',
    category: 'Development',
    startTime: '2024-02-01',
    endTime: '2024-03-15',
    status: 'in-progress',
    progress: 60,
    assignee: 'Backend Team',
    priority: 'high'
  },
  {
    id: 'task6',
    name: 'Frontend Development',
    category: 'Development',
    startTime: '2024-02-10',
    endTime: '2024-03-20',
    status: 'in-progress',
    progress: 45,
    assignee: 'Frontend Team',
    priority: 'high'
  },
  {
    id: 'task7',
    name: 'Database Setup',
    category: 'Infrastructure',
    startTime: '2024-02-15',
    endTime: '2024-02-25',
    status: 'pending',
    progress: 0,
    assignee: 'DevOps Engineer',
    priority: 'medium'
  },
  {
    id: 'task8',
    name: 'Testing & QA',
    category: 'Quality Assurance',
    startTime: '2024-03-10',
    endTime: '2024-04-05',
    status: 'pending',
    progress: 0,
    assignee: 'QA Team',
    priority: 'high'
  },
  {
    id: 'task9',
    name: 'Deployment',
    category: 'Infrastructure',
    startTime: '2024-04-01',
    endTime: '2024-04-10',
    status: 'pending',
    progress: 0,
    assignee: 'DevOps Engineer',
    priority: 'high'
  }
];

const productLaunchTasks = [
  {
    id: 'market1',
    name: 'Market Research',
    category: 'Marketing',
    startTime: '2024-01-15',
    endTime: '2024-02-01',
    status: 'completed',
    progress: 100,
    assignee: 'Marketing Team',
    priority: 'high'
  },
  {
    id: 'content1',
    name: 'Content Creation',
    category: 'Marketing',
    startTime: '2024-02-05',
    endTime: '2024-03-01',
    status: 'in-progress',
    progress: 70,
    assignee: 'Content Team',
    priority: 'medium'
  },
  {
    id: 'social1',
    name: 'Social Media Campaign',
    category: 'Marketing',
    startTime: '2024-02-20',
    endTime: '2024-04-15',
    status: 'pending',
    progress: 15,
    assignee: 'Social Media Manager',
    priority: 'medium'
  },
  {
    id: 'pr1',
    name: 'Press Release',
    category: 'PR',
    startTime: '2024-03-20',
    endTime: '2024-04-05',
    status: 'pending',
    progress: 0,
    assignee: 'PR Manager',
    priority: 'low'
  }
];

const categories = [
  { name: 'Management', label: 'Project Management' },
  { name: 'Analysis', label: 'Business Analysis' },
  { name: 'Design', label: 'Design & Architecture' },
  { name: 'Development', label: 'Software Development' },
  { name: 'Infrastructure', label: 'Infrastructure & DevOps' },
  { name: 'Quality Assurance', label: 'Testing & QA' },
  { name: 'Marketing', label: 'Marketing & Sales' },
  { name: 'PR', label: 'Public Relations' }
];

interface GanttChartExampleProps {
  theme: 'light' | 'dark';
  colorPalette: readonly string[];
  onInteraction?: (data: string) => void;
}

export function GanttChartExample({ theme, colorPalette, onInteraction }: GanttChartExampleProps) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px', marginBottom: '25px' }}>
        {/* Project Timeline */}
        <div>
          <h5 style={{
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            🗓️ Software Development Project Timeline
          </h5>
          <GanttChart
            tasks={projectTasks}
            categories={categories}
            title="Q1-Q2 Development Schedule"
            subtitle="Complete software development lifecycle with progress tracking"
            height={400}
            theme={theme}
            colorPalette={colorPalette}
            showTaskProgress={true}
            todayMarker={true}
            categoryWidth={140}
            taskHeight={0.7}
            statusStyles={{
              'completed': { backgroundColor: colorPalette[1] || '#4CAF50' },
              'in-progress': { backgroundColor: colorPalette[0] || '#2196F3' },
              'pending': { backgroundColor: colorPalette[2] || '#FFC107' },
            }}
            taskBarStyle={{
              borderRadius: 6,
              showProgress: true,
            }}
            dataZoom={true}
            legend={{ show: true, position: 'top' }}
            tooltip={{
              show: true,
              format: (params: any) => `
                <div style="padding: 12px; max-width: 300px;">
                  <strong style="font-size: 14px;">${params.value[3]}</strong><br/>
                  <div style="margin: 8px 0; padding: 4px 0; border-top: 1px solid #eee;">
                    <div>📅 <strong>Duration:</strong> ${new Date(params.value[1]).toLocaleDateString()} - ${new Date(params.value[2]).toLocaleDateString()}</div>
                    <div>📋 <strong>Category:</strong> ${params.seriesName}</div>
                    <div>👤 <strong>Assignee:</strong> ${projectTasks.find(t => t.id === params.value[4])?.assignee || 'Unassigned'}</div>
                    <div>📊 <strong>Progress:</strong> ${projectTasks.find(t => t.id === params.value[4])?.progress || 0}%</div>
                    <div>⚡ <strong>Priority:</strong> ${projectTasks.find(t => t.id === params.value[4])?.priority || 'normal'}</div>
                  </div>
                </div>
              `
            }}
            onTaskClick={(task, params) => {
              const taskDetail = projectTasks.find(t => t.id === task.id);
              onInteraction?.(`Task: ${task.name} | Status: ${taskDetail?.status} | Progress: ${taskDetail?.progress}% | Assignee: ${taskDetail?.assignee}`);
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
        {/* Marketing Campaign Timeline */}
        <div>
          <h5 style={{
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📢 Product Launch Campaign
          </h5>
          <GanttChart
            tasks={productLaunchTasks}
            categories={categories.filter(c => c.name === 'Marketing' || c.name === 'PR')}
            title="Marketing Timeline"
            height={280}
            theme={theme}
            colorPalette={colorPalette.slice(3, 6)}
            showTaskProgress={true}
            categoryWidth={100}
            taskHeight={0.8}
            groupByCategory={true}
            statusStyles={{
              'completed': { backgroundColor: colorPalette[3] || '#8BC34A' },
              'in-progress': { backgroundColor: colorPalette[4] || '#FF9800' },
              'pending': { backgroundColor: colorPalette[5] || '#9E9E9E' },
            }}
            taskBarStyle={{
              borderRadius: 4,
              textStyle: { position: 'inside' }
            }}
            onTaskClick={(task) => {
              const taskDetail = productLaunchTasks.find(t => t.id === task.id);
              onInteraction?.(`Marketing Task: ${task.name} | Assignee: ${taskDetail?.assignee}`);
            }}
          />
        </div>

        {/* Compact Overview */}
        <div>
          <h5 style={{
            color: theme === 'dark' ? '#fff' : '#333',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📋 Development Phases Overview
          </h5>
          <GanttChart
            tasks={projectTasks.filter(task => ['Management', 'Analysis', 'Design', 'Development', 'Quality Assurance'].includes(task.category))}
            categories={categories.filter(c => ['Management', 'Analysis', 'Design', 'Development', 'Quality Assurance'].includes(c.name))}
            title="Core Development Phases"
            height={280}
            theme={theme}
            colorPalette={colorPalette.slice(0, 3)}
            showTaskProgress={false}
            categoryWidth={120}
            taskHeight={0.6}
            sortBy="startTime"
            priorityStyles={{
              'high': { backgroundColor: colorPalette[0] || '#FF5722', opacity: 1.0 },
              'medium': { backgroundColor: colorPalette[1] || '#FF9800', opacity: 0.8 },
              'low': { backgroundColor: colorPalette[2] || '#4CAF50', opacity: 0.6 },
            }}
            taskBarStyle={{
              borderRadius: 8,
            }}
            legend={{ show: true, position: 'bottom' }}
            onTaskClick={(task) => {
              const taskDetail = projectTasks.find(t => t.id === task.id);
              onInteraction?.(`Phase: ${task.name} | Priority: ${taskDetail?.priority} | Days: ${Math.ceil((new Date(task.endTime).getTime() - new Date(task.startTime).getTime()) / (1000 * 60 * 60 * 24))}`);
            }}
          />
        </div>
      </div>

      {/* Resource Allocation View */}
      <div>
        <h5 style={{
          color: theme === 'dark' ? '#fff' : '#333',
          marginBottom: '15px',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          👥 Resource Allocation Timeline
        </h5>
        <GanttChart
          tasks={projectTasks}
          categories={categories}
          title="Team Resource Planning"
          subtitle="Visualizing team workload and task assignments across the project timeline"
          height={450}
          theme={theme}
          colorPalette={colorPalette}
          showTaskProgress={true}
          todayMarker={true}
          categoryWidth={160}
          taskHeight={0.75}
          groupByAssignee={true}
          dataZoom={{ type: 'both' }}
          taskBarStyle={{
            borderRadius: 5,
            showProgress: true,
            textStyle: { 
              position: 'inside',
              showDuration: true,
              fontSize: 11
            }
          }}
          categoryLabelStyle={{
            backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f8f9fa',
            textColor: theme === 'dark' ? '#ffffff' : '#333333',
            shape: 'pill'
          }}
          legend={{ 
            show: true, 
            position: 'top',
            orient: 'horizontal'
          }}
          tooltip={{
            show: true,
            trigger: 'item'
          }}
          onTaskClick={(task, params) => {
            const taskDetail = projectTasks.find(t => t.id === task.id);
            const duration = Math.ceil((new Date(task.endTime).getTime() - new Date(task.startTime).getTime()) / (1000 * 60 * 60 * 24));
            onInteraction?.(`Resource View - ${task.name}: ${taskDetail?.assignee} working for ${duration} days (${taskDetail?.progress}% complete)`);
          }}
          onCategoryClick={(category) => {
            const categoryTasks = projectTasks.filter(t => t.category === category.name);
            onInteraction?.(`Category: ${category.label} has ${categoryTasks.length} tasks`);
          }}
        />
      </div>
    </>
  );
}