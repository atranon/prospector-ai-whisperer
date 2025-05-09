
export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  frequency: {
    interval: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  created_at: string;
  updated_at: string;
  user_id: string;
  is_active: boolean;
}

export interface AgentTask {
  id: string;
  agent_id: string;
  task_type: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  description: string;
  created_at: string;
  completed_at?: string;
  result?: string;
}

export interface AgentLog {
  id: string;
  agent_id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  created_at: string;
  metadata?: Record<string, any>;
}
