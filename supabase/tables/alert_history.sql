CREATE TABLE alert_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    arbitrage_opportunity_id UUID NOT NULL REFERENCES arbitrage_opportunities(id) ON DELETE CASCADE,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivery_status TEXT NOT NULL CHECK (delivery_status IN ('success',
    'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);