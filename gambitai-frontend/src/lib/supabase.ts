import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bpbtgkunrdzcoyfdhskh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYnRna3VucmR6Y295ZmRoc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjAzNzUsImV4cCI6MjA3ODQ5NjM3NX0.ZAtjUoDnIWUOs6Os1NUGKIRUQVOuXDlaCJ4HwQqZu50";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface ArbitrageOpportunity {
  id: string;
  event_name: string;
  category: 'crypto' | 'politics';
  polymarket_price: number;
  kalshi_price: number;
  spread: number;
  arbitrage_percentage: number;
  profit_percentage: number;
  optimal_bet_amount: number;
  expected_profit: number;
  confidence_level: 'low' | 'medium' | 'high';
  risk_assessment: 'low' | 'medium' | 'high';
  polymarket_market_id: string;
  kalshi_market_id: string;
  detected_at: string;
  expires_at: string;
  status: 'active' | 'expired' | 'executed';
  created_at: string;
}

export interface Market {
  id: string;
  platform: 'polymarket' | 'kalshi';
  market_id: string;
  event_name: string;
  category: 'crypto' | 'politics';
  current_price: number;
  volume_24h: number;
  open_interest: number;
  last_updated: string;
  status: 'active' | 'closed' | 'settled';
  metadata: any;
  created_at: string;
}

export interface UserAlertPreferences {
  id: string;
  user_id: string;
  telegram_chat_id: string | null;
  min_profit_percentage: number;
  categories: string[];
  min_confidence: 'low' | 'medium' | 'high';
  enabled: boolean;
  created_at: string;
  updated_at: string;
}
