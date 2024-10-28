// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // Để tạo token ngẫu nhiên

// Cấu hình transporter cho Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Hoặc dịch vụ email bạn đang sử dụng
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Đăng ký
exports.register = async (req, res) => {
    const { username, email, password, dateOfBirth } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Kiểm tra định dạng ngày sinh
        if (!dateOfBirth || isNaN(Date.parse(dateOfBirth))) {
            return res.status(400).json({ msg: 'Invalid date of birth' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword,
            dateOfBirth: new Date(dateOfBirth),
        });

        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).send('Server Error');
    }
};

// Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
      let user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Kiểm tra mật khẩu
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Tạo JWT
      const payload = {
          user: {
              id: user.id,
          },
      };

      jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 3600 }, // 1 giờ
          (err, token) => {
              if (err) throw err;
              res.json({ 
                msg: 'Successfully logged in', 
                token 
              });
          }
      );
  } catch (error) {
      console.error('Error in login:', error);
      res.status(500).send('Server Error');
  }
};

// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Người dùng không tồn tại' });
        }

        // Tạo token reset mật khẩu
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Cài đặt thời gian hết hạn (1 giờ)
        const resetPasswordExpires = Date.now() + 3600000; // 1 giờ từ thời điểm hiện tại

        // Cập nhật user với resetToken và resetPasswordExpires
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetPasswordExpires;
        await user.save();

        // Tạo liên kết reset mật khẩu
        const resetUrl = `${process.env.RESET_PASSWORD_URL}?token=${resetToken}`;

        // Cấu hình mail options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Đặt lại mật khẩu của bạn',
            text: `Xin chào ${user.username},\n\nBạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu của bạn.\n\nVui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu của bạn:\n\n${resetUrl}\n\nNếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.\n`,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            msg: 'Đã gửi liên kết đặt lại mật khẩu tới email của bạn' 
        });

    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).send('Server Error');
    }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Tìm người dùng với resetToken và chưa hết hạn
        let user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Token chưa hết hạn
        });

        if (!user) {
            return res.status(400).json({ msg: 'Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu và xóa resetToken và resetPasswordExpires
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ msg: 'Mật khẩu của bạn đã được đặt lại thành công' });

    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).send('Server Error');
    }
};

// Cập nhật thông tin người dùng
exports.updateProfile = async (req, res) => {
    const { username, email, password, dateOfBirth } = req.body;

    try {
        const userId = req.user.id; // Middleware auth đã thêm user vào req.user

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (dateOfBirth) {
            if (isNaN(Date.parse(dateOfBirth))) {
                return res.status(400).json({ msg: 'Invalid date of birth' });
            }
            user.dateOfBirth = new Date(dateOfBirth);
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({ 
            msg: 'Profile updated successfully', 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
            }
        });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(500).send('Server Error');
    }
};
