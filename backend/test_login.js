const axios = require('axios');

const testLogin = async () => {
    try {
        const res = await axios.post('http://localhost:3000/api/users/login', {
            username: 'admin',
            password: 'admin'
        });
        console.log('登录成功:', res.data);
    } catch (error) {
        console.error('登录失败:', error.response?.data || error.message);
    }
};

testLogin();