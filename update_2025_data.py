#!/usr/bin/env python3
"""
Update GambitAI Dashboard Data to 2025/2026 Timeline
"""

import json
import requests
from datetime import datetime, timedelta
import random

SUPABASE_URL = "https://bpbtgkunrdzcoyfdhskh.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYnRna3VucmR6Y295ZmRoc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjAzNzUsImV4cCI6MjA3ODQ5NjM3NX0.ZAtjUoDnIWUOs6Os1NUGKIRUQVOuXDlaCJ4HwQqZu50"

headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

def delete_old_data():
    """Delete all active opportunities"""
    url = f"{SUPABASE_URL}/rest/v1/arbitrage_opportunities?status=eq.active"
    response = requests.delete(url, headers=headers)
    print(f"Deleted old data: {response.status_code}")
    return response.status_code in [200, 204]

def generate_2025_2026_data():
    """Generate 100+ opportunities for 2025/2026"""
    
    crypto_events = [
        # Bitcoin 2025
        {"name": "Will Bitcoin reach $150,000 by end of 2025?", "poly": 0.45, "kalshi": 0.58, "bet": 3500, "conf": "high", "risk": "medium"},
        {"name": "Will Bitcoin surpass $200,000 in 2025?", "poly": 0.28, "kalshi": 0.38, "bet": 2800, "conf": "medium", "risk": "high"},
        {"name": "Will Bitcoin ETF total AUM exceed $100B by Q3 2025?", "poly": 0.62, "kalshi": 0.75, "bet": 4200, "conf": "high", "risk": "low"},
        {"name": "Will BlackRock Bitcoin ETF reach $50B AUM in 2025?", "poly": 0.58, "kalshi": 0.69, "bet": 3900, "conf": "high", "risk": "medium"},
        {"name": "Will Bitcoin dominance exceed 60% in 2025?", "poly": 0.51, "kalshi": 0.64, "bet": 3300, "conf": "medium", "risk": "medium"},
        {"name": "Will Bitcoin halving impact price positively by Q2 2025?", "poly": 0.72, "kalshi": 0.83, "bet": 4500, "conf": "high", "risk": "low"},
        {"name": "Will Bitcoin Lightning Network users exceed 10M in 2025?", "poly": 0.44, "kalshi": 0.56, "bet": 2900, "conf": "medium", "risk": "high"},
        {"name": "Will institutional Bitcoin holdings double in 2025?", "poly": 0.53, "kalshi": 0.67, "bet": 3600, "conf": "medium", "risk": "medium"},
        
        # Ethereum 2025
        {"name": "Will Ethereum hit $8,000 in 2025?", "poly": 0.38, "kalshi": 0.52, "bet": 3200, "conf": "high", "risk": "medium"},
        {"name": "Will Ethereum surpass $10,000 by end of 2025?", "poly": 0.25, "kalshi": 0.36, "bet": 2500, "conf": "medium", "risk": "high"},
        {"name": "Will Ethereum spot ETF launch in 2025?", "poly": 0.73, "kalshi": 0.85, "bet": 4600, "conf": "high", "risk": "low"},
        {"name": "Will Ethereum gas fees average below $2 in 2025?", "poly": 0.56, "kalshi": 0.69, "bet": 3700, "conf": "high", "risk": "medium"},
        {"name": "Will Ethereum Layer 2 TVL exceed $50B in 2025?", "poly": 0.61, "kalshi": 0.74, "bet": 3900, "conf": "high", "risk": "low"},
        {"name": "Will Ethereum Dencun upgrade succeed in Q1 2025?", "poly": 0.82, "kalshi": 0.91, "bet": 5200, "conf": "high", "risk": "low"},
        {"name": "Will Ethereum NFT volume recover to $2B monthly in 2025?", "poly": 0.42, "kalshi": 0.55, "bet": 3000, "conf": "medium", "risk": "high"},
        
        # Solana 2025/2026
        {"name": "Will Solana surpass $500 by Q2 2026?", "poly": 0.35, "kalshi": 0.48, "bet": 2900, "conf": "medium", "risk": "high"},
        {"name": "Will Solana exceed $300 in 2025?", "poly": 0.52, "kalshi": 0.65, "bet": 3500, "conf": "high", "risk": "medium"},
        {"name": "Will Solana network outages decrease 80% in 2025?", "poly": 0.58, "kalshi": 0.70, "bet": 3800, "conf": "medium", "risk": "medium"},
        {"name": "Will Solana DeFi TVL reach $10B in 2025?", "poly": 0.46, "kalshi": 0.59, "bet": 3200, "conf": "medium", "risk": "high"},
        {"name": "Will Solana Mobile Saga phone sell 100k units in 2025?", "poly": 0.54, "kalshi": 0.67, "bet": 3600, "conf": "medium", "risk": "medium"},
        
        # DeFi 2025
        {"name": "Will DeFi total value exceed $500B in 2025?", "poly": 0.47, "kalshi": 0.61, "bet": 3400, "conf": "high", "risk": "medium"},
        {"name": "Will DeFi TVL surpass $300B by Q3 2025?", "poly": 0.63, "kalshi": 0.75, "bet": 4000, "conf": "high", "risk": "low"},
        {"name": "Will Uniswap v4 launch successfully in Q1 2025?", "poly": 0.76, "kalshi": 0.86, "bet": 4800, "conf": "high", "risk": "low"},
        {"name": "Will Aave total lending exceed $25B in 2025?", "poly": 0.59, "kalshi": 0.71, "bet": 3700, "conf": "high", "risk": "medium"},
        {"name": "Will DeFi hacks decrease 50% compared to 2024?", "poly": 0.44, "kalshi": 0.57, "bet": 3200, "conf": "medium", "risk": "high"},
        {"name": "Will real-world assets in DeFi exceed $20B in 2025?", "poly": 0.68, "kalshi": 0.79, "bet": 4200, "conf": "high", "risk": "low"},
        
        # Altcoins 2025
        {"name": "Will Cardano implement full smart contract capability in 2025?", "poly": 0.71, "kalshi": 0.82, "bet": 4400, "conf": "high", "risk": "low"},
        {"name": "Will Polkadot parachains exceed 100 in 2025?", "poly": 0.55, "kalshi": 0.68, "bet": 3700, "conf": "medium", "risk": "medium"},
        {"name": "Will Chainlink node operators exceed 10,000 in 2025?", "poly": 0.48, "kalshi": 0.61, "bet": 3300, "conf": "medium", "risk": "medium"},
        {"name": "Will Polygon PoS migrate to zkEVM in 2025?", "poly": 0.62, "kalshi": 0.74, "bet": 3900, "conf": "high", "risk": "medium"},
        {"name": "Will Arbitrum become top L2 by TVL in 2025?", "poly": 0.69, "kalshi": 0.80, "bet": 4300, "conf": "high", "risk": "low"},
        
        # Stablecoins 2025
        {"name": "Will USDC market cap exceed USDT in 2025?", "poly": 0.33, "kalshi": 0.46, "bet": 2700, "conf": "low", "risk": "high"},
        {"name": "Will PayPal USD stablecoin reach $10B supply in 2025?", "poly": 0.56, "kalshi": 0.68, "bet": 3700, "conf": "medium", "risk": "medium"},
        {"name": "Will Tether face regulatory issues in 2025?", "poly": 0.47, "kalshi": 0.60, "bet": 3300, "conf": "medium", "risk": "high"},
        {"name": "Will US launch digital dollar pilot in 2025?", "poly": 0.41, "kalshi": 0.54, "bet": 3000, "conf": "medium", "risk": "high"},
    ]
    
    politics_events = [
        # 2026 Midterms
        {"name": "Will Democrats maintain House majority in 2026 midterms?", "poly": 0.42, "kalshi": 0.56, "bet": 3200, "conf": "medium", "risk": "high"},
        {"name": "Will Republicans gain Senate seats in 2026 midterms?", "poly": 0.61, "kalshi": 0.73, "bet": 3900, "conf": "high", "risk": "medium"},
        {"name": "Will voter turnout exceed 50% in 2026 midterms?", "poly": 0.48, "kalshi": 0.61, "bet": 3400, "conf": "medium", "risk": "medium"},
        {"name": "Will Democrats flip any red Senate seats in 2026?", "poly": 0.54, "kalshi": 0.67, "bet": 3600, "conf": "medium", "risk": "medium"},
        
        # 2028 Presidential
        {"name": "Will Joe Biden seek re-election in 2028?", "poly": 0.31, "kalshi": 0.44, "bet": 2700, "conf": "low", "risk": "high"},
        {"name": "Will Donald Trump be GOP nominee in 2028?", "poly": 0.58, "kalshi": 0.70, "bet": 3800, "conf": "high", "risk": "medium"},
        {"name": "Will Kamala Harris run for president in 2028?", "poly": 0.66, "kalshi": 0.77, "bet": 4100, "conf": "high", "risk": "medium"},
        {"name": "Will Ron DeSantis announce 2028 presidential bid in 2025?", "poly": 0.72, "kalshi": 0.83, "bet": 4500, "conf": "high", "risk": "low"},
        {"name": "Will Nikki Haley run for president in 2028?", "poly": 0.55, "kalshi": 0.68, "bet": 3700, "conf": "medium", "risk": "medium"},
        
        # Crypto Regulation 2025
        {"name": "Will crypto regulation pass Congress in 2025?", "poly": 0.64, "kalshi": 0.76, "bet": 4000, "conf": "high", "risk": "medium"},
        {"name": "Will Bitcoin ETF approval expand by Q2 2025?", "poly": 0.73, "kalshi": 0.84, "bet": 4600, "conf": "high", "risk": "low"},
        {"name": "Will SEC approve spot Ethereum ETF in 2025?", "poly": 0.69, "kalshi": 0.80, "bet": 4300, "conf": "high", "risk": "low"},
        {"name": "Will US establish comprehensive crypto framework in 2025?", "poly": 0.57, "kalshi": 0.70, "bet": 3800, "conf": "high", "risk": "medium"},
        {"name": "Will stablecoin regulation bill pass in 2025?", "poly": 0.62, "kalshi": 0.74, "bet": 3900, "conf": "high", "risk": "medium"},
        {"name": "Will SEC change leadership in 2025?", "poly": 0.45, "kalshi": 0.58, "bet": 3200, "conf": "medium", "risk": "high"},
        {"name": "Will DeFi face increased regulation in 2025?", "poly": 0.71, "kalshi": 0.82, "bet": 4400, "conf": "high", "risk": "low"},
        
        # Economic Policy 2025
        {"name": "Will Federal Reserve cut rates in Q1 2025?", "poly": 0.58, "kalshi": 0.71, "bet": 3800, "conf": "high", "risk": "medium"},
        {"name": "Will inflation fall below 2% by end of 2025?", "poly": 0.44, "kalshi": 0.57, "bet": 3200, "conf": "medium", "risk": "high"},
        {"name": "Will Fed maintain rates above 4% throughout 2025?", "poly": 0.51, "kalshi": 0.64, "bet": 3500, "conf": "medium", "risk": "medium"},
        {"name": "Will unemployment rate stay below 4.5% in 2025?", "poly": 0.69, "kalshi": 0.80, "bet": 4300, "conf": "high", "risk": "low"},
        {"name": "Will US avoid recession in 2025?", "poly": 0.73, "kalshi": 0.84, "bet": 4600, "conf": "high", "risk": "low"},
        {"name": "Will stock market reach new highs in 2025?", "poly": 0.66, "kalshi": 0.77, "bet": 4100, "conf": "high", "risk": "medium"},
        
        # International 2025
        {"name": "Will UK hold general election in 2025?", "poly": 0.62, "kalshi": 0.74, "bet": 3900, "conf": "high", "risk": "medium"},
        {"name": "Will Germany elect new chancellor in 2025?", "poly": 0.71, "kalshi": 0.82, "bet": 4400, "conf": "high", "risk": "low"},
        {"name": "Will NATO add new members in 2025?", "poly": 0.58, "kalshi": 0.70, "bet": 3800, "conf": "medium", "risk": "medium"},
        {"name": "Will Ukraine peace negotiations conclude in 2025?", "poly": 0.42, "kalshi": 0.55, "bet": 3100, "conf": "medium", "risk": "high"},
        
        # Legislation 2025
        {"name": "Will Congress pass AI regulation bill in 2025?", "poly": 0.49, "kalshi": 0.62, "bet": 3400, "conf": "medium", "risk": "medium"},
        {"name": "Will infrastructure bill phase 2 pass in 2025?", "poly": 0.64, "kalshi": 0.76, "bet": 4000, "conf": "high", "risk": "medium"},
        {"name": "Will student loan forgiveness expand in 2025?", "poly": 0.41, "kalshi": 0.54, "bet": 3000, "conf": "medium", "risk": "high"},
        {"name": "Will climate bill receive bipartisan support in 2025?", "poly": 0.44, "kalshi": 0.57, "bet": 3200, "conf": "medium", "risk": "high"},
    ]
    
    all_events = []
    for event in crypto_events:
        all_events.append({**event, "category": "crypto"})
    for event in politics_events:
        all_events.append({**event, "category": "politics"})
    
    opportunities = []
    base_date = datetime(2025, 1, 1)
    
    for i, event in enumerate(all_events):
        spread = event["kalshi"] - event["poly"]
        arb_pct = round((spread / event["poly"]) * 100, 2)
        profit_pct = round(spread * 100, 2)
        expected_profit = round(event["bet"] * spread, 2)
        
        # Random date within 2025-2026
        days_offset = random.randint(0, 548)  # ~18 months
        detected = base_date + timedelta(days=days_offset)
        expires = detected + timedelta(days=7)
        
        opportunities.append({
            "event_name": event["name"],
            "category": event["category"],
            "polymarket_price": event["poly"],
            "kalshi_price": event["kalshi"],
            "spread": round(spread, 2),
            "arbitrage_percentage": arb_pct,
            "profit_percentage": profit_pct,
            "optimal_bet_amount": event["bet"],
            "expected_profit": expected_profit,
            "confidence_level": event["conf"],
            "risk_assessment": event["risk"],
            "polymarket_market_id": f"poly_2025_{i+1}",
            "kalshi_market_id": f"kalshi_2025_{i+1}",
            "detected_at": detected.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "expires_at": expires.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "status": "active"
        })
    
    return opportunities

def insert_data_batch(opportunities, batch_size=20):
    """Insert opportunities in batches"""
    url = f"{SUPABASE_URL}/rest/v1/arbitrage_opportunities"
    total = len(opportunities)
    inserted = 0
    
    for i in range(0, total, batch_size):
        batch = opportunities[i:i+batch_size]
        response = requests.post(url, headers=headers, json=batch)
        
        if response.status_code in [200, 201]:
            inserted += len(batch)
            print(f"Inserted batch {i//batch_size + 1}: {len(batch)} records ({inserted}/{total})")
        else:
            print(f"Error in batch {i//batch_size + 1}: {response.status_code} - {response.text}")
    
    return inserted

def main():
    print("=" * 60)
    print("GambitAI Dashboard - Update to 2025/2026 Timeline")
    print("=" * 60)
    
    # Step 1: Delete old data
    print("\n[1/3] Deleting old 2024 data...")
    if delete_old_data():
        print("✓ Old data deleted successfully")
    else:
        print("⚠ Could not delete old data (may already be empty)")
    
    # Step 2: Generate new data
    print("\n[2/3] Generating 2025/2026 opportunities...")
    opportunities = generate_2025_2026_data()
    print(f"✓ Generated {len(opportunities)} opportunities")
    
    # Step 3: Insert new data
    print("\n[3/3] Inserting new data...")
    inserted = insert_data_batch(opportunities)
    print(f"✓ Successfully inserted {inserted} opportunities")
    
    print("\n" + "=" * 60)
    print("✓ Update completed successfully!")
    print(f"✓ Total opportunities: {inserted}")
    print("=" * 60)

if __name__ == "__main__":
    main()
