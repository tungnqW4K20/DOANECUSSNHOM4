import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

/**
 * Export báo cáo thanh khoản ra Excel
 * @param {Object} baoCaoData - Dữ liệu báo cáo
 * @param {string} fileName - Tên file (không cần extension)
 */
export const exportBaoCaoToExcel = (baoCaoData, fileName = 'BaoCaoThanhKhoan') => {
    try {
        // Tạo workbook mới
        const wb = XLSX.utils.book_new();
        
        // Sheet 1: Thông tin chung
        const thongTinData = [
            ['BÁO CÁO QUYẾT TOÁN HỢP ĐỒNG'],
            [],
            ['Tên tổ chức:', baoCaoData.thongTinChung?.ten_dn || ''],
            ['Mã số thuế:', baoCaoData.thongTinChung?.ma_so_thue || ''],
            ['Địa chỉ:', baoCaoData.thongTinChung?.dia_chi || ''],
            ['Số hợp đồng:', baoCaoData.kyBaoCao?.so_hd || ''],
            ['Kỳ báo cáo:', `Từ ${dayjs(baoCaoData.kyBaoCao?.tu_ngay).format('DD/MM/YYYY')} đến ${dayjs(baoCaoData.kyBaoCao?.den_ngay).format('DD/MM/YYYY')}`],
            []
        ];
        
        const wsThongTin = XLSX.utils.aoa_to_sheet(thongTinData);
        
        // Merge cells cho tiêu đề
        wsThongTin['!merges'] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } } // Merge tiêu đề
        ];
        
        // Set column widths
        wsThongTin['!cols'] = [
            { wch: 20 }, // Column A
            { wch: 50 }  // Column B
        ];
        
        // Apply borders to all cells
        const rangeThongTin = XLSX.utils.decode_range(wsThongTin['!ref']);
        for (let R = rangeThongTin.s.r; R <= rangeThongTin.e.r; ++R) {
            for (let C = rangeThongTin.s.c; C <= rangeThongTin.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!wsThongTin[cellAddress]) continue;
                if (!wsThongTin[cellAddress].s) wsThongTin[cellAddress].s = {};
                wsThongTin[cellAddress].s.border = {
                    top: { style: 'thin', color: { rgb: '000000' } },
                    bottom: { style: 'thin', color: { rgb: '000000' } },
                    left: { style: 'thin', color: { rgb: '000000' } },
                    right: { style: 'thin', color: { rgb: '000000' } }
                };
            }
        }
        
        XLSX.utils.book_append_sheet(wb, wsThongTin, 'Thông tin chung');
        
        // Sheet 2: Mẫu 15a - N-X-T Sản phẩm
        if (baoCaoData.baoCaoNXT_SP && baoCaoData.baoCaoNXT_SP.length > 0) {
            const nxtSPData = [
                ['BÁO CÁO QUYẾT TOÁN NHẬP - XUẤT - TỒN KHO SẢN PHẨM'],
                ['(Mẫu 15a)'],
                [],
                // Header nhóm
                [
                    '(1) STT',
                    '(2) Mã SP',
                    '(3) Tên sản phẩm',
                    '(4) ĐVT',
                    '(5) Tồn đầu kỳ',
                    '(6) Nhập trong kỳ',
                    'Xuất kho trong kỳ',
                    '',
                    '',
                    '(10) Tồn cuối kỳ',
                    '(11) Ghi chú'
                ],
                // Header chi tiết
                [
                    '(1) STT',
                    '(2) Mã SP',
                    '(3) Tên sản phẩm',
                    '(4) ĐVT',
                    '(5) Tồn đầu kỳ',
                    '(6) Nhập trong kỳ',
                    '(7) Chuyển MĐ',
                    '(8) Xuất khẩu',
                    '(9) Xuất khác',
                    '(10) Tồn cuối kỳ',
                    '(11) Ghi chú'
                ]
            ];
            
            // Thêm dữ liệu
            baoCaoData.baoCaoNXT_SP.forEach(item => {
                nxtSPData.push([
                    item.stt,
                    item.ma_sp,
                    item.ten_sp,
                    item.don_vi_tinh,
                    item.ton_dau_ky,
                    item.nhap_kho_trong_ky,
                    item.chuyen_muc_dich,
                    item.xuat_khau,
                    item.xuat_khac,
                    item.ton_cuoi_ky,
                    item.ghi_chu || ''
                ]);
            });
            
            const wsNXTSP = XLSX.utils.aoa_to_sheet(nxtSPData);
            
            // Merge cells cho tiêu đề
            wsNXTSP['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }, // Tiêu đề chính
                { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } }, // Mẫu 15a
                { s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }, // STT
                { s: { r: 3, c: 1 }, e: { r: 4, c: 1 } }, // Mã SP
                { s: { r: 3, c: 2 }, e: { r: 4, c: 2 } }, // Tên SP
                { s: { r: 3, c: 3 }, e: { r: 4, c: 3 } }, // ĐVT
                { s: { r: 3, c: 4 }, e: { r: 4, c: 4 } }, // Tồn đầu
                { s: { r: 3, c: 5 }, e: { r: 4, c: 5 } }, // Nhập trong kỳ
                { s: { r: 3, c: 6 }, e: { r: 3, c: 8 } }, // Xuất kho trong kỳ (gom 3 cột)
                { s: { r: 3, c: 9 }, e: { r: 4, c: 9 } }, // Tồn cuối
                { s: { r: 3, c: 10 }, e: { r: 4, c: 10 } } // Ghi chú
            ];
            
            // Set column widths
            wsNXTSP['!cols'] = [
                { wch: 6 },  // STT
                { wch: 10 }, // Mã SP
                { wch: 30 }, // Tên SP
                { wch: 8 },  // ĐVT
                { wch: 12 }, // Tồn đầu
                { wch: 12 }, // Nhập
                { wch: 12 }, // Chuyển MĐ
                { wch: 12 }, // Xuất khẩu
                { wch: 12 }, // Xuất khác
                { wch: 12 }, // Tồn cuối
                { wch: 30 }  // Ghi chú
            ];
            
            // Apply borders to all cells
            const rangeNXTSP = XLSX.utils.decode_range(wsNXTSP['!ref']);
            for (let R = rangeNXTSP.s.r; R <= rangeNXTSP.e.r; ++R) {
                for (let C = rangeNXTSP.s.c; C <= rangeNXTSP.e.c; ++C) {
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                    if (!wsNXTSP[cellAddress]) continue;
                    if (!wsNXTSP[cellAddress].s) wsNXTSP[cellAddress].s = {};
                    wsNXTSP[cellAddress].s.border = {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } }
                    };
                    // Style cho header nhóm và header chi tiết
                    if (R === 3 || R === 4) {
                        wsNXTSP[cellAddress].s.font = { bold: true };
                        wsNXTSP[cellAddress].s.fill = { fgColor: { rgb: 'D3D3D3' } };
                        wsNXTSP[cellAddress].s.alignment = { horizontal: 'center', vertical: 'center' };
                    }
                }
            }
            
            XLSX.utils.book_append_sheet(wb, wsNXTSP, 'Mẫu 15a - NXT SP');
        }
        
        // Sheet 3: Mẫu 15b - Sử dụng NPL
        if (baoCaoData.baoCaoSD_NPL && baoCaoData.baoCaoSD_NPL.length > 0) {
            const sdNPLData = [
                ['BÁO CÁO QUYẾT TOÁN TÌNH HÌNH SỬ DỤNG NGUYÊN LIỆU, VẬT TƯ'],
                ['(Mẫu 15b)'],
                [],
                // Header nhóm
                [
                    '(1) STT',
                    '(2) Mã NPL',
                    '(3) Tên NPL, VT',
                    '(4) ĐVT',
                    '(5) Tồn đầu kỳ',
                    'Nhập trong kỳ',
                    '',
                    'Xuất trong kỳ',
                    '',
                    '(10) Tồn cuối kỳ',
                    '(11) Ghi chú'
                ],
                // Header chi tiết
                [
                    '(1) STT',
                    '(2) Mã NPL',
                    '(3) Tên NPL, VT',
                    '(4) ĐVT',
                    '(5) Tồn đầu kỳ',
                    '(6) Tái nhập',
                    '(7) Nhập khác',
                    '(8) Xuất SX',
                    '(9) Chuyển MĐ',
                    '(10) Tồn cuối kỳ',
                    '(11) Ghi chú'
                ]
            ];
            
            baoCaoData.baoCaoSD_NPL.forEach(item => {
                sdNPLData.push([
                    item.stt,
                    item.ma_npl,
                    item.ten_npl,
                    item.don_vi_tinh,
                    item.ton_dau_ky,
                    item.tai_nhap,
                    item.nhap_khac,
                    item.xuat_san_pham,
                    item.thay_doi_muc_dich,
                    item.ton_cuoi_ky,
                    item.ghi_chu || ''
                ]);
            });
            
            const wsSDNPL = XLSX.utils.aoa_to_sheet(sdNPLData);
            
            wsSDNPL['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }, // Tiêu đề chính
                { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } }, // Mẫu 15b
                { s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }, // STT
                { s: { r: 3, c: 1 }, e: { r: 4, c: 1 } }, // Mã NPL
                { s: { r: 3, c: 2 }, e: { r: 4, c: 2 } }, // Tên NPL
                { s: { r: 3, c: 3 }, e: { r: 4, c: 3 } }, // ĐVT
                { s: { r: 3, c: 4 }, e: { r: 4, c: 4 } }, // Tồn đầu
                { s: { r: 3, c: 5 }, e: { r: 3, c: 6 } }, // Nhập trong kỳ (gom 2 cột)
                { s: { r: 3, c: 7 }, e: { r: 3, c: 8 } }, // Xuất trong kỳ (gom 2 cột)
                { s: { r: 3, c: 9 }, e: { r: 4, c: 9 } }, // Tồn cuối
                { s: { r: 3, c: 10 }, e: { r: 4, c: 10 } } // Ghi chú
            ];
            
            wsSDNPL['!cols'] = [
                { wch: 6 },  // STT
                { wch: 10 }, // Mã NPL
                { wch: 30 }, // Tên NPL
                { wch: 8 },  // ĐVT
                { wch: 12 }, // Tồn đầu
                { wch: 12 }, // Tái nhập
                { wch: 12 }, // Nhập khác
                { wch: 12 }, // Xuất SX
                { wch: 12 }, // Chuyển MĐ
                { wch: 12 }, // Tồn cuối
                { wch: 30 }  // Ghi chú
            ];
            
            // Apply borders to all cells
            const rangeSDNPL = XLSX.utils.decode_range(wsSDNPL['!ref']);
            for (let R = rangeSDNPL.s.r; R <= rangeSDNPL.e.r; ++R) {
                for (let C = rangeSDNPL.s.c; C <= rangeSDNPL.e.c; ++C) {
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                    if (!wsSDNPL[cellAddress]) continue;
                    if (!wsSDNPL[cellAddress].s) wsSDNPL[cellAddress].s = {};
                    wsSDNPL[cellAddress].s.border = {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } }
                    };
                    // Style cho header nhóm và header chi tiết
                    if (R === 3 || R === 4) {
                        wsSDNPL[cellAddress].s.font = { bold: true };
                        wsSDNPL[cellAddress].s.fill = { fgColor: { rgb: 'D3D3D3' } };
                        wsSDNPL[cellAddress].s.alignment = { horizontal: 'center', vertical: 'center' };
                    }
                }
            }
            
            XLSX.utils.book_append_sheet(wb, wsSDNPL, 'Mẫu 15b - SD NPL');
        }
        
        // Sheet 4: Mẫu 16 - Định mức
        if (baoCaoData.dinhMucThucTe && baoCaoData.dinhMucThucTe.length > 0) {
            const dinhMucData = [
                ['ĐỊNH MỨC THỰC TẾ SẢN XUẤT SẢN PHẨM XUẤT KHẨU'],
                ['(Mẫu 16)'],
                [],
                // Header nhóm
                [
                    '(1) STT',
                    '(2) Mã SP',
                    '(3) Tên sản phẩm',
                    '(4) ĐVT (SP)',
                    'Nguyên liệu, vật tư',
                    '',
                    '',
                    '(8) Định mức/1SP',
                    '(9) Ghi chú'
                ],
                // Header chi tiết
                [
                    '(1) STT',
                    '(2) Mã SP',
                    '(3) Tên sản phẩm',
                    '(4) ĐVT (SP)',
                    '(5) Mã NPL',
                    '(6) Tên NPL',
                    '(7) ĐVT (NPL)',
                    '(8) Định mức/1SP',
                    '(9) Ghi chú'
                ]
            ];
            
            baoCaoData.dinhMucThucTe.forEach(item => {
                dinhMucData.push([
                    item.stt,
                    item.ma_sp,
                    item.ten_sp,
                    item.don_vi_tinh_sp,
                    item.ma_npl,
                    item.ten_npl,
                    item.don_vi_tinh_npl,
                    item.luong_sd,
                    item.ghi_chu || ''
                ]);
            });
            
            const wsDinhMuc = XLSX.utils.aoa_to_sheet(dinhMucData);
            
            wsDinhMuc['!merges'] = [
                { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Tiêu đề chính
                { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }, // Mẫu 16
                { s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }, // STT
                { s: { r: 3, c: 1 }, e: { r: 4, c: 1 } }, // Mã SP
                { s: { r: 3, c: 2 }, e: { r: 4, c: 2 } }, // Tên SP
                { s: { r: 3, c: 3 }, e: { r: 4, c: 3 } }, // ĐVT SP
                { s: { r: 3, c: 4 }, e: { r: 3, c: 6 } }, // Nguyên liệu, vật tư (gom 3 cột)
                { s: { r: 3, c: 7 }, e: { r: 4, c: 7 } }, // Định mức
                { s: { r: 3, c: 8 }, e: { r: 4, c: 8 } }  // Ghi chú
            ];
            
            wsDinhMuc['!cols'] = [
                { wch: 6 },  // STT
                { wch: 10 }, // Mã SP
                { wch: 25 }, // Tên SP
                { wch: 10 }, // ĐVT SP
                { wch: 10 }, // Mã NPL
                { wch: 25 }, // Tên NPL
                { wch: 10 }, // ĐVT NPL
                { wch: 15 }, // Định mức
                { wch: 20 }  // Ghi chú
            ];
            
            // Apply borders to all cells
            const rangeDinhMuc = XLSX.utils.decode_range(wsDinhMuc['!ref']);
            for (let R = rangeDinhMuc.s.r; R <= rangeDinhMuc.e.r; ++R) {
                for (let C = rangeDinhMuc.s.c; C <= rangeDinhMuc.e.c; ++C) {
                    const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                    if (!wsDinhMuc[cellAddress]) continue;
                    if (!wsDinhMuc[cellAddress].s) wsDinhMuc[cellAddress].s = {};
                    wsDinhMuc[cellAddress].s.border = {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } }
                    };
                    // Style cho header nhóm và header chi tiết
                    if (R === 3 || R === 4) {
                        wsDinhMuc[cellAddress].s.font = { bold: true };
                        wsDinhMuc[cellAddress].s.fill = { fgColor: { rgb: 'D3D3D3' } };
                        wsDinhMuc[cellAddress].s.alignment = { horizontal: 'center', vertical: 'center' };
                    }
                }
            }
            
            XLSX.utils.book_append_sheet(wb, wsDinhMuc, 'Mẫu 16 - Định mức');
        }
        
        // Xuất file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}.xlsx`);
        
        return true;
    } catch (error) {
        console.error('Lỗi khi xuất Excel:', error);
        throw error;
    }
};

export default exportBaoCaoToExcel;
