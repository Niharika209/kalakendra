import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Artist from '../models/Artist.js';
import Learner from '../models/Learner.js';
import { generateTokens } from '../utils/generateTokens.js';

async function register(req, res) {
  try {
    console.log('Registration attempt received:', { 
      name: req.body.name, 
      email: req.body.email, 
      role: req.body.role 
    });

    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({ message: 'Missing required fields: name, email, and password are required' });
    }

    const existingArtist = await Artist.findOne({ email });
    const existingLearner = await Learner.findOne({ email });
    if (existingArtist || existingLearner) {
      console.log('Registration failed: Email already exists -', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    console.log('Hashing password...');
    const hashed = await bcrypt.hash(password, 10);
    
    let profile;
    const userRole = role || 'learner';
    if (userRole === 'artist') {
      console.log('Creating Artist profile...');
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const timestamp = Date.now().toString().slice(-6);
      profile = await Artist.create({
        name,
        slug: `${slug}-${timestamp}`,
        email,
        password: hashed,
        category: 'General',
        location: 'Not specified',
        pricePerHour: 0,
        bio: '',
        specialties: [],
        featured: false
      });
      console.log('Artist created successfully:', {
        id: profile._id,
        name: profile.name,
        email: profile.email,
        createdAt: profile.createdAt
      });
    } else {
      console.log('Creating Learner profile...');
      profile = await Learner.create({
        name,
        email,
        password: hashed,
        location: 'Not specified'
      });
      console.log('Learner created successfully:', {
        id: profile._id,
        name: profile.name,
        email: profile.email,
        createdAt: profile.createdAt
      });
    }

    console.log('Generating authentication tokens...');
    const tokenPayload = { id: profile._id, role: userRole };
    const { accessToken, refreshToken } = generateTokens(tokenPayload);
    profile.refreshTokens.push(refreshToken);
    await profile.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('Registration completed successfully for:', profile.email);
    
    res.json({ 
      accessToken, 
      user: { 
        id: profile._id, 
        name: profile.name, 
        email: profile.email, 
        role: userRole,
        ...(userRole === 'artist' ? { imageUrl: profile.imageUrl } : { profileImage: profile.profileImage })
      } 
    });
  } catch (err) {
    console.error('Registration error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
}

async function login(req, res) {
  try {
    console.log('Login attempt received for:', req.body.email);
    
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ message: 'Email and password required' });
    }

    let profile = await Artist.findOne({ email });
    let userRole = 'artist';
    
    if (!profile) {
      profile = await Learner.findOne({ email });
      userRole = 'learner';
    }
    
    if (!profile) {
      console.log('Login failed: Account not found -', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, profile.password);
    if (!isValid) {
      console.log('Login failed: Invalid password for -', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`Login successful for ${userRole}:`, email);
    
    const tokenPayload = { id: profile._id, role: userRole };
    const { accessToken, refreshToken } = generateTokens(tokenPayload);
    profile.refreshTokens.push(refreshToken);
    if (userRole === 'artist' && profile.gallery) {
      const validGalleryItems = profile.gallery.filter(item => item && item.url);
      await Artist.findByIdAndUpdate(
        profile._id,
        { 
          gallery: validGalleryItems,
          $push: { refreshTokens: refreshToken }
        },
        { runValidators: false }
      );
      profile.gallery = validGalleryItems;
    } else {
      await profile.save();
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('Login completed successfully for:', profile.email);

    res.json({ 
      accessToken, 
      user: { 
        id: profile._id, 
        name: profile.name, 
        email: profile.email, 
        role: userRole,
        ...(userRole === 'artist' ? { imageUrl: profile.imageUrl } : { profileImage: profile.profileImage })
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'refresh-secret');
    let profile = await Artist.findById(decoded.id);
    let userRole = 'artist';
    
    if (!profile) {
      profile = await Learner.findById(decoded.id);
      userRole = 'learner';
    }
    
    if (!profile || !profile.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const tokenPayload = { id: profile._id, role: userRole };
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(tokenPayload);
    profile.refreshTokens = profile.refreshTokens.filter(t => t !== refreshToken);
    profile.refreshTokens.push(newRefreshToken);
    
    // Clean up gallery array if it's an artist - remove any items with undefined/null URLs
    if (userRole === 'artist' && profile.gallery) {
      profile.gallery = profile.gallery.filter(item => item && item.url);
    }
    
    await profile.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    res.json({ 
      accessToken, 
      user: { 
        id: profile._id, 
        name: profile.name, 
        email: profile.email, 
        role: userRole,
        ...(userRole === 'artist' ? { imageUrl: profile.imageUrl } : { profileImage: profile.profileImage })
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
}

async function logout(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'refresh-secret');
      let profile = await Artist.findById(decoded.id);
      if (!profile) {
        profile = await Learner.findById(decoded.id);
      }
      
      if (profile) {
        profile.refreshTokens = profile.refreshTokens.filter(t => t !== refreshToken);
        await profile.save();
      }
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  }
}

async function getMe(req, res) {
  try {
    const userWithRole = { ...req.user.toObject(), role: req.userRole };
    res.json({ user: userWithRole });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export { register, login, refresh, logout, getMe };
