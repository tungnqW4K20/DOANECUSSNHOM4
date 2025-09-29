const authService = require('../services/auth.service');

const registerBusiness = async (req, res, next) => {
    try {
        const requiredFields = ['ten_dn', 'ma_so_thue', 'dia_chi', 'email', 'sdt', 'mat_khau', 'file_giay_phep'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
             return res.status(400).json({
                 success: false,
                 message: `Thiếu các trường bắt buộc: ${missingFields.join(', ')}`
             });
        }

        const businessData = req.body;
        const newBusiness = await authService.registerBusiness(businessData);

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công!',
            data: newBusiness
        });
        
    } catch (error) {
        console.error("Register Error:", error.message);
        if (error.message.includes('đã được sử dụng')) {
            return res.status(409).json({ success: false, message: error.message }); 
        }
        if (error.message.includes('Vui lòng điền đủ')) {
             return res.status(400).json({ success: false, message: error.message }); 
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi đăng ký.' });        
    }
};



const loginBusiness = async (req, res, next) => {
    try {
        const { ma_so_thue, mat_khau } = req.body;
         if (!ma_so_thue || !mat_khau) {
             return res.status(400).json({
                 success: false,
                 message: 'Vui lòng nhập mã số thuế và mật khẩu.'
             });
        }

        const loginData = { ma_so_thue, mat_khau };
        const result = await authService.loginBussiness(loginData);
        

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: result 
        });
    } catch (error) {
         console.error("Login Error:", error.message);
        if (error.message.includes('không chính xác')) {
            return res.status(401).json({ success: false, message: error.message }); 
        }
         if (error.message.includes('Vui lòng nhập')) {
             return res.status(400).json({ success: false, message: error.message }); 
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi đăng nhập.' });
        
    }
};




const loginHaiQuan = async (req, res, next) => {
    try {
        const { tai_khoan, mat_khau } = req.body;
         if (!tai_khoan || !mat_khau) {
             return res.status(400).json({
                 success: false,
                 message: 'Vui lòng nhập tài khoản và mật khẩu.'
             });
        }

        const loginData = { 
            tai_khoan, 
            mat_khau 
        };
        const result = await authService.loginHQ(loginData);

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: result 
        });
    } catch (error) {
         console.error("Login Error:", error.message);
        if (error.message.includes('không chính xác')) {
            return res.status(401).json({ success: false, message: error.message }); 
        }
         if (error.message.includes('Vui lòng nhập')) {
             return res.status(400).json({ success: false, message: error.message }); 
        }
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ khi đăng nhập.' });
        
    }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Missing refresh token" })
    }

    const result = await authService.generateNewTokens(refreshToken)

    return res.status(200).json({
      success: true,
      message: 'Refresh token thành công!',
      data: result 
    })
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Refresh token failed', error: error.message })
  }
}


module.exports = {
    registerBusiness,
    loginBusiness,
    loginHaiQuan,
    refreshToken,
};



