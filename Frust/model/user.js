const mongoose = require('mongoose');

let User;

try {
    // Kiểm tra xem model đã được biên dịch chưa
    User = mongoose.model('user');
} catch (error) {
    // Nếu chưa, định nghĩa model
    const UserSchema = new mongoose.Schema({
        username: { type: String, unique: true, maxLength: 255 },
        password: { type: String, maxLength: 255 },
        email: { type: String, unique: true },
        name: { type: String },
        avata: { type: String },
        available: { type: Boolean, default: false }
    }, {
        timestamps: true
    });

    User = mongoose.model('user', UserSchema);
}

module.exports = User;
