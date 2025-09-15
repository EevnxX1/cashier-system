'use client'
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DataSupplier from "@/components/tables/DataSupplier";

export default function Supplier() {
  return (
    <div>
    <PageBreadcrumb pageTitle="Supplier"/>
        <ComponentCard title="Tabel Data Supplier">
            <DataSupplier/>
        </ComponentCard>
    </div>
  );
}
