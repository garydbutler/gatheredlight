export interface Tribute {
  id: string;
  creator_id: string;
  name: string;
  born_date?: string;
  passed_date?: string;
  cover_photo_url?: string;
  bio?: string;
  privacy: 'public' | 'private' | 'family';
  invite_code: string;
  theme_config?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Contributor {
  id: string;
  tribute_id: string;
  user_id?: string;
  name: string;
  email?: string;
  relationship?: string;
  invited_by?: string;
  status: 'invited' | 'active' | 'removed';
  created_at: string;
}

export interface Memory {
  id: string;
  tribute_id: string;
  contributor_id?: string;
  type: 'story' | 'photo' | 'voice' | 'video';
  title?: string;
  content?: string;
  media_url?: string;
  memory_date?: string;
  location?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  contributor?: Contributor;
  reactions?: Reaction[];
}

export interface Reaction {
  id: string;
  memory_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface Slideshow {
  id: string;
  tribute_id: string;
  title: string;
  config_json: Record<string, unknown>;
  generated_url?: string;
  status: 'draft' | 'generating' | 'ready';
  created_at: string;
}
