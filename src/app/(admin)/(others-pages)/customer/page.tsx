"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DataCustomer from "@/components/tables/DataCustomer";

export default function Customer() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Customer" />
      <ComponentCard title="Tabel Data Customer">
        <DataCustomer />
      </ComponentCard>
    </div>
  );
}
