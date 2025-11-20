import { useState, useEffect } from 'react';
import { supabase, UserAlertPreferences } from '../lib/supabase';
import { Bell, Save, CheckCircle } from 'lucide-react';

export default function Settings() {
  const [preferences, setPreferences] = useState<UserAlertPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [telegramChatId, setTelegramChatId] = useState('');
  const [minProfitPercentage, setMinProfitPercentage] = useState(10);
  const [categories, setCategories] = useState<string[]>(['crypto', 'politics']);
  const [minConfidence, setMinConfidence] = useState<'low' | 'medium' | 'high'>('medium');
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Using maybeSingle() instead of single() to avoid HTTP 406 errors
      // maybeSingle() returns null if no rows found, without throwing error
      const { data, error } = await supabase
        .from('user_alert_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching preferences:', error);
        // Don't throw, just log and continue with default values
      }

      if (data) {
        setPreferences(data);
        setTelegramChatId(data.telegram_chat_id || '');
        setMinProfitPercentage(data.min_profit_percentage);
        setCategories(data.categories);
        setMinConfidence(data.min_confidence);
        setEnabled(data.enabled);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('No user found');

      const preferencesData = {
        user_id: user.id,
        telegram_chat_id: telegramChatId || null,
        min_profit_percentage: minProfitPercentage,
        categories: categories,
        min_confidence: minConfidence,
        enabled: enabled,
        updated_at: new Date().toISOString(),
      };

      if (preferences) {
        // Update existing
        const { error } = await supabase
          .from('user_alert_preferences')
          .update(preferencesData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase.from('user_alert_preferences').insert([preferencesData]);

        if (error) throw error;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      fetchPreferences();
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      alert('Error saving preferences: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your alert preferences and notifications</p>
      </div>

      <div className="bg-teal-900/50 backdrop-blur-sm rounded-xl p-6 border border-teal-700 max-w-2xl">
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="w-6 h-6 text-teal-400" />
          <h2 className="text-xl font-semibold text-white">Alert Preferences</h2>
        </div>

        <div className="space-y-6">
          {/* Enable Alerts */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Enable Alerts</label>
              <p className="text-gray-400 text-sm">Receive notifications for arbitrage opportunities</p>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? 'bg-teal-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Telegram Chat ID */}
          <div>
            <label className="block text-white font-medium mb-2">Telegram Chat ID</label>
            <p className="text-gray-400 text-sm mb-2">
              To get your chat ID, message @userinfobot on Telegram
            </p>
            <input
              type="text"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              placeholder="123456789"
              className="w-full px-4 py-3 bg-teal-950/50 border border-teal-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Minimum Profit */}
          <div>
            <label className="block text-white font-medium mb-2">
              Minimum Profit Percentage: {minProfitPercentage}%
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={minProfitPercentage}
              onChange={(e) => setMinProfitPercentage(parseInt(e.target.value))}
              className="w-full h-2 bg-teal-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
            <div className="flex justify-between text-gray-500 text-xs mt-1">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-white font-medium mb-2">Categories</label>
            <div className="flex space-x-4">
              <button
                onClick={() => toggleCategory('crypto')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  categories.includes('crypto')
                    ? 'bg-teal-500 border-teal-500 text-white'
                    : 'bg-teal-800/50 border-teal-600 text-gray-300 hover:bg-teal-800'
                }`}
              >
                Crypto
              </button>
              <button
                onClick={() => toggleCategory('politics')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  categories.includes('politics')
                    ? 'bg-teal-500 border-teal-500 text-white'
                    : 'bg-teal-800/50 border-teal-600 text-gray-300 hover:bg-teal-800'
                }`}
              >
                Politics
              </button>
            </div>
          </div>

          {/* Minimum Confidence */}
          <div>
            <label className="block text-white font-medium mb-2">Minimum Confidence Level</label>
            <div className="flex space-x-4">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setMinConfidence(level)}
                  className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                    minConfidence === level
                      ? 'bg-teal-500 border-teal-500 text-white'
                      : 'bg-teal-800/50 border-teal-600 text-gray-300 hover:bg-teal-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-2"
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
