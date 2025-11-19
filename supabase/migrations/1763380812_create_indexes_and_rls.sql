-- Migration: create_indexes_and_rls
-- Created at: 1763380812

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_markets_platform_status ON markets(platform, status, category);
CREATE INDEX IF NOT EXISTS idx_markets_last_updated ON markets(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_arbitrage_status_detected ON arbitrage_opportunities(status, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_arbitrage_category ON arbitrage_opportunities(category, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_prefs_user_enabled ON user_alert_preferences(user_id, enabled);
CREATE INDEX IF NOT EXISTS idx_alert_history_user_sent ON alert_history(user_id, sent_at DESC);

-- Enable RLS
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE arbitrage_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alert_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for markets (public read)
CREATE POLICY "Public read access for markets"
  ON markets FOR SELECT
  USING (true);

-- RLS Policies for arbitrage_opportunities (public read)
CREATE POLICY "Public read access for arbitrage opportunities"
  ON arbitrage_opportunities FOR SELECT
  USING (true);

-- RLS Policies for user_alert_preferences
CREATE POLICY "Users can view own preferences"
  ON user_alert_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_alert_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_alert_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_alert_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for alert_history
CREATE POLICY "Users can view own alert history"
  ON alert_history FOR SELECT
  USING (auth.uid() = user_id);;