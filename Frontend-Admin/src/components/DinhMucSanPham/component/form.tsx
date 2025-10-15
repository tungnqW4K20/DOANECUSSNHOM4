// components/DinhMucSanPham/form.tsx
"use client"

import { RULES_FORM } from "@/utils/validator"
import { Form, InputNumber, Select } from "antd"
import React from "react"

interface Props {
  formdata: any
  isEditing: boolean
}

export const DinhMucSanPham_Form: React.FC<Props> = ({ formdata }) => {
  return (
    <Form
      layout="vertical"
      form={formdata}
      initialValues={{
        id_sp: undefined,
        id_npl: undefined,
        so_luong: undefined,
      }}
      autoComplete="off"
    >
      {/* ---- ID sản phẩm ---- */}
      <Form.Item
        label="Sản phẩm (ID)"
        name="id_sp"
        rules={RULES_FORM.required} // ✅ dùng rule chuẩn
      >
        <Select
          placeholder="Chọn sản phẩm"
          options={[
            { label: "Áo phông", value: 101 },
            { label: "Quần jeans", value: 102 },
            { label: "Áo khoác", value: 103 },
          ]}
        />
      </Form.Item>

      {/* ---- ID nguyên phụ liệu ---- */}
      <Form.Item
        label="Nguyên phụ liệu (ID)"
        name="id_npl"
        rules={RULES_FORM.required} // ✅ dùng rule chuẩn
      >
        <Select
          placeholder="Chọn nguyên phụ liệu"
          options={[
            { label: "Vải", value: 201 },
            { label: "Chỉ may", value: 202 },
            { label: "Khóa kéo", value: 203 },
          ]}
        />
      </Form.Item>

      {/* ---- Số lượng ---- */}
      <Form.Item
        label="Số lượng NPL cần"
        name="so_luong"
        rules={RULES_FORM.number} // ✅ dùng rule chuẩn cho số
      >
        <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
      </Form.Item>
    </Form>
  )
}
