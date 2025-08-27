import mongoose from 'mongoose'
import User from '../model/user.model.js'

//Getting userId , password using username.
export const getUser= async(req,res) => {
    try {
        const {username} = req.params
        const user = await User.find({username : username})
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}

//making new user in sign up

export const registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      
      const userExists = await User.findOne({ email }).select('+password');
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
  
      
      const newUser = await User.create({
        username,
        email,
        password
      });
  
      res.status(201).json({
        message: 'User registered successfully',
        userId: newUser._id,
        username: newUser.username,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
}

//deleting by asking for username and password

export const deleteUser = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username }).select('+password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const isMatch = password == user.password;
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      // 3. If the password matches, delete the user by their _id
      await User.findByIdAndDelete(user._id);
  
      res.status(200).json({
        message: 'User deleted successfully',
        userId: user._id,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  };



