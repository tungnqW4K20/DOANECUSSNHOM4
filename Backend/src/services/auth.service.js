const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.utils');
const db = require('../models');
const DoanhNghiep = db.DoanhNghiep;
const HaiQuan = db.HaiQuan;

// const JWT_SECRET = process.env.JWT_SECRET;
// const SALT_ROUNDS = 10;

const registerBusiness = async (DoanhNghiepData) => {
    const { ten_dn, ma_so_thue, dia_chi, email, sdt, mat_khau, file_giay_phep } = DoanhNghiepData;

    if (!ten_dn || !ma_so_thue || !dia_chi || !email || !sdt || !mat_khau || !file_giay_phep) {
        throw new Error('Vui lòng điền đủ thông tin bắt buộc !');
    }

    const existingBusiness = await DoanhNghiep.findOne({
        where: {
            [db.Sequelize.Op.or]: [{ email: email }, { ma_so_thue: ma_so_thue }]
        }
    });

    if (existingBusiness) {
        if (existingBusiness.email === email) {
            throw new Error('Email đã được sử dụng.');
        }
        if (existingBusiness.ma_so_thue === ma_so_thue) {
            throw new Error('Mã số thuế đã được sử dụng.');
        }
    }

    const business = await DoanhNghiep.create({
        ten_dn,
        ma_so_thue,
        dia_chi,
        email,
        sdt,
        mat_khau,
        file_giay_phep,
        status: "PENDING"
    });

    const { mat_khau: _, ...businessWithoutPassword } = business.toJSON();
    return businessWithoutPassword;
};


const loginBussiness = async (loginData) => {
    const { ma_so_thue, mat_khau } = loginData;

    if (!ma_so_thue || !mat_khau) {
        throw new Error('Vui lòng nhập email/username và mật khẩu.');
    }

    const doanhnghiep = await DoanhNghiep.findOne({
        where: {
            [db.Sequelize.Op.and]: [
                { ma_so_thue: ma_so_thue },
                { mat_khau: mat_khau }
            ]
        },
        attributes: { exclude: ['mat_khau'] }

    });

    if (!doanhnghiep) {
        throw new Error('Thông tin đăng nhập của doanh nghiệp không chính xác!');
    }



    console.log("payload", doanhnghiep)
    if (doanhnghiep?.status === 'PENDING') {
        throw new Error('Tài khoản chưa được duyệt!');
    }
    const payload = {
        id: doanhnghiep.id_dn,
        id_dn: doanhnghiep.id_dn,  // Thêm id_dn để các controller có thể sử dụng
        email: doanhnghiep.email,
        ten: doanhnghiep.ten_dn,
        role: "business"
    };
    console.log("payload", payload)

    const token = generateToken(payload, 'business');
    const refreshToken = generateRefreshToken(payload, 'business')
    const { password: _, ...DoanhNghiepInfo } = doanhnghiep.toJSON();

    return { token, refreshToken, DoanhNghiep: DoanhNghiepInfo };
};



const loginHQ = async (loginData) => {
    const { tai_khoan, mat_khau } = loginData;

    if (!tai_khoan || !mat_khau) {
        throw new Error('Vui lòng nhập tài khoản và mật khẩu.');
    }


    const haiquan = await HaiQuan.findOne({
        where: {
            [db.Sequelize.Op.or]: [{ tai_khoan: tai_khoan }]
        }
    });
    if (!haiquan) {
        throw new Error('Không tìm thấy tài khoản');
    }

    const isPasswordMatch = mat_khau === haiquan.mat_khau;

    if (!isPasswordMatch) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    const payload = {
        id: haiquan.id_hq,
        ten_hq: haiquan.ten_hq,
        role: "Admin"
    };

    const token = generateToken(payload, 'Admin');
    const refreshToken = generateRefreshToken(payload, 'Admin')

    const { password: _, ...HaiQuanInfo } = haiquan.toJSON();
    return { token, refreshToken, HaiQuan: HaiQuanInfo };
};

const newRefreshToken = async () => {
    try {
        const decoded = verifyRefreshToken(token);
        const { iat, exp, ...payload } = decoded

        const newAccessToken = generateToken(payload, payload.role)
        const newRefreshToken = generateRefreshToken(payload, payload.role)

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: payload
        }
    } catch (error) {

    }
}

const generateNewTokens = async (refreshToken) => {
    try {
        const decoded = verifyRefreshToken(refreshToken)
        const { iat, exp, ...payload } = decoded

        const newAccessToken = generateToken(payload, payload.role)
        const newRefreshToken = generateRefreshToken(payload, payload.role)

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: payload
        }
    } catch (error) {
        throw error
    }
}


module.exports = {
    registerBusiness,
    loginBussiness,
    loginHQ,
    newRefreshToken,
    generateNewTokens,
};



