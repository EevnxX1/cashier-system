"use client";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import DataPengeluaran from "@/components/tables/DataPengeluaran";
import Link from "next/link";
import Button from "@/components/ui/button/Button";

export default function PengeluaranLain() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Biaya Pengeluaran Lain" />
      <ComponentCard title="Input Pengeluaran">
        <DataPengeluaran />
      </ComponentCard>
      <ComponentCard title="More Options" className="mt-5">
        <div className="flex gap-x-5">
          <Link href={"/pembelian/laporan"}>
            <Button size="md">Data Pengeluaran</Button>
          </Link>
          <Link href={"/pembelian/ReturPembelian"}>
            <Button size="md">Retur Pembelian</Button>
          </Link>
        </div>
      </ComponentCard>
    </div>
  );
}
