"use client";
import React, { useState, useEffect } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Link from "next/link";
import { ChevronLeftIcon } from "@/icons";
import DataHistoriPembelian from "@/components/tables/DataPembelianDariSupplier";
import DataHistoriPembayaranHutang from "@/components/tables/DataPembayaranHutang";

interface Order {
  id: number;
  kode_supplier: string;
  nama_supplier: string;
  alamat: string;
  kota: string;
  syarat_bayar: string;
  nomor_hp: string;
  nama_kontak: string;
  bank: string;
  nomor_rekening: string;
  saldo_hutang: string;
}

export default function DetailSupplier() {
  const [data, setData] = useState<Order[]>([]);
  const [kodeSupplier, setKodeSupplier] = useState("");
  const [namaSupplier, setNamaSupplier] = useState("");
  const [alamat, setAlamat] = useState("");
  const [kota, setKota] = useState("");
  const [syaratBayar, setSyaratBayar] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [namaKontak, setNamaKontak] = useState("");
  const [bank, setBank] = useState("");
  const [nomorRekening, setNomorRekening] = useState("");
  const [saldoHutang, setSaldoHutang] = useState("");
  const [id, setId] = useState("");
  // nerima id dari link secara real-time
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cekId = params.get("id_supplier");
    if (cekId) {
      setId(cekId);
    }
  }, [id]);

  // fetch data supplier from api
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/supplier`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Data fetched successfully!");
        }
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  // Tangkap data dan masukkan data ke variabel useState secara realtime
  useEffect(() => {
    const supplier = data.find((item) => item.id === Number(id));
    if (supplier) {
      setKodeSupplier(supplier.kode_supplier);
      setNamaSupplier(supplier.nama_supplier);
      setAlamat(supplier.alamat);
      setKota(supplier.kota);
      setSyaratBayar(supplier.syarat_bayar);
      setNomorHp(supplier.nomor_hp);
      setNamaKontak(supplier.nama_kontak);
      setBank(supplier.bank);
      setNomorRekening(supplier.nomor_rekening);
      setSaldoHutang(supplier.saldo_hutang);
    }
  }, [data, id]);

  // Format Rupiah
  function formatRupiah(value: string | number) {
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold text-white">Detail Supplier</h1>
        <div className="mb-5">
          <Link
            href="/supplier"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Kembali Ke Halaman Data Supplier
          </Link>
        </div>
      </div>
      <ComponentCard title={`Nama Supplier`} className="mb-5">
        <form className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Kode Supplier</Label>
            <div className="w-[78%]">
              <Input defaultValue={kodeSupplier} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Nama Supplier</Label>
            <div className="w-[78%]">
              <Input value={namaSupplier} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Alamat</Label>
            <div className="w-[78%]">
              <Input value={alamat} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Kota</Label>
            <div className="w-[78%]">
              <Input value={kota} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Syarat Bayar</Label>
            <div className="w-[78%]">
              <Input value={`${syaratBayar} Hari`} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Nomor Hp</Label>
            <div className="w-[78%]">
              <Input value={nomorHp} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Nama Kontak</Label>
            <div className="w-[78%]">
              <Input value={namaKontak} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Bank</Label>
            <div className="w-[78%]">
              <Input value={bank} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Nomor Rekening</Label>
            <div className="w-[78%]">
              <Input value={nomorRekening} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Saldo Hutang</Label>
            <div className="w-[78%]">
              <Input
                value={`Rp. ${formatRupiah(saldoHutang)}`}
                disabled
              ></Input>
            </div>
          </div>
        </form>
      </ComponentCard>
      <ComponentCard title={`Histori Pembelian Dari Supplier`} className="mb-5">
        <DataHistoriPembelian kode_supplier={kodeSupplier} />
      </ComponentCard>
      <ComponentCard title={`Histori Pembayaran Hutang`} className="mb-5">
        <DataHistoriPembayaranHutang kode_supplier={kodeSupplier} />
      </ComponentCard>
    </div>
  );
}
