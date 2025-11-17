# 🔐 Stripe Payment Integration - Implementation Plan

## Status: WAITING FOR API KEYS

### 📋 Prerequisites

**Required Credentials:**
```
STRIPE_SECRET_KEY=sk_live_xxx (or sk_test_xxx for testing)
STRIPE_PUBLISHABLE_KEY=pk_live_xxx (or pk_test_xxx for testing)
```

**How to Get Stripe Keys:**
1. Visit https://dashboard.stripe.com/register
2. Create account or login
3. Go to Developers → API Keys
4. Copy both Secret Key and Publishable Key

---

## 🚀 Implementation Steps (Once Keys Available)

### Step 1: Initialize Stripe Infrastructure

```bash
# Run the init_stripe_subscribe tool
init_stripe_subscribe(
  table_prefix="",  # Empty prefix since plans/subscriptions don't exist yet
  plan_config={
    "pro": {
      "amount": 4900,  # $49.00 in cents
      "name": "Pro Plan",
      "currency": "usd",
      "interval": "month",
      "monthlyLimit": 50
    },
    "pro_annual": {
      "amount": 49900,  # $499.00 in cents
      "name": "Pro Annual",
      "currency": "usd",
      "interval": "year",
      "monthlyLimit": 50
    }
  }
)
```

This will:
- ✅ Create `plans` table with Pro pricing tiers
- ✅ Create `subscriptions` table for user subscriptions
- ✅ Deploy `create-subscription` edge function
- ✅ Deploy `stripe-webhook` edge function
- ✅ Set up Stripe webhook endpoint

---

### Step 2: Update Frontend - PricingPage.tsx

**Add Stripe Checkout Integration:**

```typescript
// Import Supabase client
import { supabase } from '../lib/supabase';

// Add state for user and loading
const [user, setUser] = useState(null);
const [loading, setLoading] = useState<string | null>(null);

// Fetch user on mount
useEffect(() => {
  supabase.auth.getUser().then(({ data: { user } }) => {
    setUser(user);
  });
}, []);

// Handle subscription
const handleSubscribe = async (planType: string) => {
  if (!user) {
    // Redirect to signup
    navigate('/signup');
    return;
  }

  setLoading(planType);

  try {
    const { data, error } = await supabase.functions.invoke('create-subscription', {
      body: {
        planType,
        customerEmail: user.email
      }
    });

    if (error) throw error;

    if (data.data?.checkoutUrl) {
      window.location.href = data.data.checkoutUrl;
    }
  } catch (error: any) {
    console.error('Subscription error:', error);
    alert('Failed to create subscription: ' + error.message);
  } finally {
    setLoading(null);
  }
};

// Update buttons
<button 
  onClick={() => handleSubscribe('pro')}
  disabled={loading === 'pro'}
>
  {loading === 'pro' ? 'Loading...' : 'Start Pro'}
</button>
```

---

### Step 3: Add Success/Cancel Handlers

**Success Handler (add to PricingPage useEffect):**

```typescript
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const subscriptionStatus = urlParams.get('subscription');

  if (subscriptionStatus === 'success') {
    // Show success message
    alert('🎉 Subscription activated successfully!');
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (subscriptionStatus === 'cancelled') {
    alert('Subscription cancelled. You can try again anytime!');
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, []);
```

---

### Step 4: Feature Gating in Dashboard

**Add subscription check in Dashboard.tsx:**

```typescript
const [subscription, setSubscription] = useState(null);

useEffect(() => {
  const fetchSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plans!price_id(
          plan_type,
          monthly_limit
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    setSubscription(data);
  };

  fetchSubscription();
}, []);

// Display subscription status
{subscription ? (
  <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
    <p className="text-blue-400">
      {subscription.plans.plan_type} Plan Active 
      - {subscription.plans.monthly_limit} alerts/day
    </p>
  </div>
) : (
  <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
    <p className="text-yellow-400">
      Free Plan - 3 alerts/day. 
      <Link to="/pricing" className="underline ml-2">Upgrade to Pro</Link>
    </p>
  </div>
)}
```

---

### Step 5: Test Payment Flow

**Testing Checklist:**
1. ✅ Click "Start Pro" on Pricing page
2. ✅ Redirect to Stripe checkout
3. ✅ Use test card: 4242 4242 4242 4242, any future date, any CVC
4. ✅ Complete payment
5. ✅ Verify redirect to success page
6. ✅ Check subscription appears in Dashboard
7. ✅ Verify subscription data in Supabase

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

---

## 📊 Database Schema

### Plans Table:
```sql
CREATE TABLE plans (
  id SERIAL PRIMARY KEY,
  price_id VARCHAR(255) UNIQUE NOT NULL,
  plan_type VARCHAR(50) NOT NULL,
  price INTEGER NOT NULL,
  monthly_limit INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Subscriptions Table:
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255) NOT NULL,
  price_id VARCHAR(255) NOT NULL REFERENCES plans(price_id),
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔄 Webhook Events Handled

The `stripe-webhook` edge function will handle:
- ✅ `checkout.session.completed` - Create subscription record
- ✅ `customer.subscription.updated` - Update subscription status
- ✅ `customer.subscription.deleted` - Cancel subscription
- ✅ `invoice.payment_succeeded` - Confirm payment
- ✅ `invoice.payment_failed` - Handle failed payment

---

## 📝 Next Steps

**Once Stripe API keys are provided:**
1. Run Step 1 to initialize Stripe infrastructure
2. Implement Step 2-4 frontend changes
3. Deploy updated frontend
4. Test with Stripe test cards (Step 5)
5. Switch to production keys for live environment

**Estimated Time:** 30-45 minutes after keys are provided

---

## ⚠️ Important Notes

1. **Webhook URL:** Will be automatically configured at:
   `https://bpbtgkunrdzcoyfdhskh.supabase.co/functions/v1/stripe-webhook`

2. **Test Mode:** Use `sk_test_` and `pk_test_` keys for testing
3. **Production Mode:** Switch to `sk_live_` and `pk_live_` for production

4. **Security:** Never commit Stripe secret keys to git!

---

## 🎯 Expected Result

After implementation:
- ✅ Users can purchase Pro plan from Pricing page
- ✅ Stripe handles payment processing securely
- ✅ Subscriptions automatically sync to database
- ✅ Dashboard shows subscription status
- ✅ Features are gated based on plan tier
- ✅ Webhook handles all subscription lifecycle events

**Status: READY TO IMPLEMENT - Waiting for Stripe API Keys**
