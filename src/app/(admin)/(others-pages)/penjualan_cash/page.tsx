"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DataPenjualanCash from "@/components/tables/DataPenjualanCash";

export default function PenjualanCash() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Penjualan Cash" />
      <ComponentCard title="Keranjang Transaksi">
        <DataPenjualanCash />
      </ComponentCard>
    </div>
  );
}
