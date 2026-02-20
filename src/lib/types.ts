export interface Tribute {
  id: string;
  creator_id: string;
  name: string;
  born_date: string | null;
  passed_date: string | null;
  cover_photo_url: string | null;
  bio: string | null;
  privacy: 'public' | 'private' | 'family';
  invite_code: string;
  theme_config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Contributor {
  id: string;
  tribute_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  relationship: string | null;
  invited_by: string | null;
  status: 'invited' | 'active' | 'removed';
  created_at: string;
}

export interface Memory {
  id: string;
  tribute_id: string;
  contributor_id: string | null;
  type: 'story' | 'photo' | 'voice' | 'video';
  title: string | null;
  content: string | null;
  media_url: string | null;
  memory_date: string | null;
  location: string | null;
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
  generated_url: string | null;
  status: 'draft' | 'generating' | 'ready';
  created_at: string;
  updated_at: string;
}
