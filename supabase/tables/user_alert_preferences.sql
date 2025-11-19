CREATE TABLE user_alert_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    telegram_chat_id TEXT,
    min_profit_percentage NUMERIC DEFAULT 10,
    categories TEXT[] DEFAULT ARRAY['crypto',
    'politics'],
    min_confidence TEXT DEFAULT 'medium' CHECK (min_confidence IN ('low',
    'medium',
    'high')),
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);