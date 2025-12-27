const profileService = require('../services/profile.service');

// Lấy thông tin profile
const getProfile = async (req, res) => {
  try {
    const id_dn = req.user.id_dn; // Lấy từ middleware auth
    
    const profile = await profileService.getProfile(id_dn, req);
    
    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin profile'
    });
  }
};

// Cập nhật thông tin profile
const updateProfile = async (req, res) => {
  try {
    const id_dn = req.user.id_dn;
    const updateData = req.body;
    
    const updatedProfile = await profileService.updateProfile(id_dn, updateData);
    
    return res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật thông tin'
    });
  }
};

// Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const id_dn = req.user.id_dn;
    const { mat_khau_cu, mat_khau_moi } = req.body;
    
    if (!mat_khau_cu || !mat_khau_moi) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới'
      });
    }
    
    const result = await profileService.changePassword(id_dn, { mat_khau_cu, mat_khau_moi });
    
    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Error in changePassword:', error);
    
    if (error.message === 'Mật khẩu cũ không chính xác') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi đổi mật khẩu'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
