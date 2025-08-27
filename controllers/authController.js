// controllers/authController.js

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Controller for user signup
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ user: data.user, session: data.session });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// Controller for user login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sign in the user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ user: data.user, session: data.session });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// Export the controller functions
module.exports = {
  signup,
  login,
};