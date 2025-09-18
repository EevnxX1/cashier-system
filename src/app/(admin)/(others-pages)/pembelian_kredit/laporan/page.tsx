"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DataKreditCustomer from "@/components/tables/DataKreditCustomer";

export default function LaporanKredit() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Kredit Customer" />
      <ComponentCard title="Tabel Data Kredit">
        <DataKreditCustomer />
      </ComponentCard>
    </div>
  );
}
