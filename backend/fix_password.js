const pool = require('./config/database');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
    try {
        const password = 'password';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Generated hash:', hashedPassword);

        await pool.query('UPDATE customers SET password = ? WHERE username = ?', [hashedPassword, 'admin']);
        console.log('admin password updated');

        await pool.query('UPDATE customers SET password = ? WHERE username IN (?, ?, ?, ?)', 
            [hashedPassword, 'user1', 'user2', 'zhangsan', 'lisi']);
        console.log('Other users password updated');

        const [rows] = await pool.query('SELECT username, password FROM customers');
        console.log('\nAll users:');
        rows.forEach(r => console.log(r.username, '->', r.password.substring(0, 20) + '...'));

        const [admin] = await pool.query('SELECT * FROM customers WHERE username = ?', ['admin']);
        const isValid = await bcrypt.compare('password', admin[0].password);
        console.log('\nPassword verification test:', isValid);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fixPasswords();
