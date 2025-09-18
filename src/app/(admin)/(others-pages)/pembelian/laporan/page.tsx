"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DataKreditSupplier from "@/components/tables/DataKreditSupplier";

export default function LaporanKredit() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Pembelian Supplier" />
      <ComponentCard title="Tabel Data Pembelian">
        <DataKreditSupplier />
      </ComponentCard>
    </div>
  );
}
