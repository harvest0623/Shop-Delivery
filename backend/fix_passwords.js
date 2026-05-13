const bcrypt = require('bcryptjs');
const pool = require('./config/database');

const fixPasswords = async () => {
    try {
        const password = 'admin';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await pool.query('UPDATE customers SET password = ? WHERE username = ?', [hashedPassword, 'admin']);
        await pool.query('UPDATE customers SET password = ? WHERE username = ?', [hashedPassword, 'user1']);
        await pool.query('UPDATE customers SET password = ? WHERE username = ?', [hashedPassword, 'user2']);
        
        console.log('密码已更新成功！');
        process.exit(0);
    } catch (error) {
        console.error('更新密码失败:', error);
        process.exit(1);
    }
};

fixPasswords();