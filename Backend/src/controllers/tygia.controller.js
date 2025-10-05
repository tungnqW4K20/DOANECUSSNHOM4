const tygiaService = require('../services/tygia.service');

const updateFromAPI = async (req, res) => {
  try {
    const result = await tygiaService.updateTyGiaFromAPI();
    res.status(200).json({
      success: true,
      message: 'Đã cập nhật tỷ giá thành công',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { updateFromAPI };