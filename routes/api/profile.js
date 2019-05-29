const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const { check, validationResult } = require('express-validator/check');
//middleware for auth token
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

//@route  GET api/profile/me
//@desc   Gets only the current user profile
//@access Private
router.get('/me', auth, async (req, res) => {
  try {
    //user in findOne is a ref point to the user model which is only an ID.
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );
    //checking if they have a profile - if not return message
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    //if profile found send json data
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  POST api/profile
//@desc   Create or update user profile
//@access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
      github
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      //taking string from field and making array and spliting the string at the , and trimming each item
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    //build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (github) profileFields.social.github = github;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //create profile
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    json.send(profileFields);
  }
);

//@route  GET api/profile
//@desc   Get all profiles
//@access Public
router.get('/', async (req, res) => {
  try {
    let profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  GET api/profile/user/:user_id
//@desc   Get profile by user id
//@access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.params.user_id }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) return res.status(400).send({ msg: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).send({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

//@route  DELETE api/profile/user/:user_id
//@desc   Delete profile, user & posts
//@access Private
router.delete('/', auth, async (req, res) => {
  try {
    //remove users posts
    await Post.findOneAndRemove({ user: req.user.id });
    //remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  PUT api/profile/experience
//@desc   Add Profile experience
//@access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From Date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);

      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
//@route  DELETE api/profile/experience/:exp_id
//@desc   Delete a profile experience
//@access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    //getting profile
    const profile = await Profile.findOne({ user: req.user.id });
    //Get index for need experience mapping over all exp
    const removeIndex = profile.experience
      .map(exp => exp.id)
      //getting the id from url
      .indexOf(req.params.exp_id);
    //splice to remove the item from the array and only 1
    profile.experience.splice(removeIndex, 1);
    //saving profile
    await profile.save();
    //returning profile information with removed exp
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  PUT api/profile/education
//@desc   Add Profile education
//@access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
      check('from', 'From Date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);

      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);
//@route  DELETE api/profile/education/:edu_id
//@desc   Delete a profile education
//@access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    //getting profile
    const profile = await Profile.findOne({ user: req.user.id });
    //Get index for need education mapping over all edu
    const removeIndex = profile.education
      .map(edu => edu.id)
      //getting the id from url
      .indexOf(req.params.exp_id);
    //splice to remove the item from the array and only 1
    profile.education.splice(removeIndex, 1);
    //saving profile
    await profile.save();
    //returning profile information with removed edu
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//@route  Get api/profile/github/:username
//@desc   Get user repos from github
//@access Public
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubClientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200)
        return res.status(404).json({ msg: 'No Github profile found' });
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
