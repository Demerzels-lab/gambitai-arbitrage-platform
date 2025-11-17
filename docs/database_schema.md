# GambitAI Database Schema

## Tables

### 1. markets
Stores market data from Polymarket and Kalshi platforms.

```sql
- id: UUID (primary key)
- platform: TEXT (polymarket/kalshi)
- market_id: TEXT (platform-specific ID)
- event_name: TEXT
- category: TEXT (crypto/politics)
- current_price: NUMERIC
- volume_24h: NUMERIC
- open_interest: NUMERIC
- last_updated: TIMESTAMPTZ
- status: TEXT (active/closed/settled)
- metadata: JSONB (platform-specific data)
- created_at: TIMESTAMPTZ
```

### 2. arbitrage_opportunities
Stores detected arbitrage opportunities between platforms.

```sql
- id: UUID (primary key)
- event_name: TEXT
- category: TEXT
- polymarket_price: NUMERIC
- kalshi_price: NUMERIC
- spread: NUMERIC
- arbitrage_percentage: NUMERIC
- profit_percentage: NUMERIC
- optimal_bet_amount: NUMERIC
- expected_profit: NUMERIC
- confidence_level: TEXT (low/medium/high)
- risk_assessment: TEXT (low/medium/high)
- polymarket_market_id: TEXT
- kalshi_market_id: TEXT
- detected_at: TIMESTAMPTZ
- expires_at: TIMESTAMPTZ
- status: TEXT (active/expired/executed)
- created_at: TIMESTAMPTZ
```

### 3. user_alert_preferences
User preferences for arbitrage alerts.

```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- telegram_chat_id: TEXT
- min_profit_percentage: NUMERIC (default 10)
- categories: TEXT[] (crypto, politics)
- min_confidence: TEXT (low/medium/high)
- enabled: BOOLEAN (default true)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### 4. alert_history
History of sent alerts to users.

```sql
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- arbitrage_opportunity_id: UUID (references arbitrage_opportunities)
- sent_at: TIMESTAMPTZ
- delivery_status: TEXT (success/failed)
- error_message: TEXT (nullable)
- created_at: TIMESTAMPTZ
```

## Indexes
- markets: (platform, status, category)
- arbitrage_opportunities: (status, detected_at, category)
- user_alert_preferences: (user_id, enabled)
- alert_history: (user_id, sent_at)

## RLS (Row Level Security)
- users table: Users can only read/update their own data
- markets: Public read access
- arbitrage_opportunities: Public read access
- user_alert_preferences: Users can only CRUD their own preferences
- alert_history: Users can only read their own alert history
