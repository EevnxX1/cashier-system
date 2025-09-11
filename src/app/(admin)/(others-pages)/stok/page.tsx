"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import SearchableSelect from "@/components/form/SearchableSelect";
import DataStok from "@/components/tables/DataStok";
import Swal from "sweetalert2";

export default function Stok() {
  const [namaBarang, setNamaBarang] = useState("");
  const [satuan, setSatuan] = useState("");
  const [jenis, setJenis] = useState("");
  const [stokAwal, setStokAwal] = useState(0);
  const [hargaCustomer, setHargaCustomer] = useState("");
  const [formatHargaCustomer, setFormatHargaCustomer] = useState("");
  const [hargaSupplier, setHargaSupplier] = useState("");
  const [formatHargaSupplier, setFormatHargaSupplier] = useState("");

  const options = [
    { value: "PCS", label: "PCS" },
    { value: "UNIT", label: "UNIT" },
    { value: "RIM", label: "RIM" },
  ];

  const [jenisOptions, setJenisOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  // Format Rupiah function
  function formatRupiah(value: string) {
    // Hilangkan karakter selain angka
    const numberString = value.replace(/\D/g, "");
    // Format ke ribuan
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const handleHargaCustomerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    // Simpan angka asli tanpa titik
    setHargaCustomer(value.replace(/\D/g, ""));
    // Simpan tampilan dengan titik
    setFormatHargaCustomer(formatRupiah(value));
  };
  const handleHargaSupplierChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    // Simpan angka asli tanpa titik
    setHargaSupplier(value.replace(/\D/g, ""));
    // Simpan tampilan dengan titik
    setFormatHargaSupplier(formatRupiah(value));
  };

  useEffect(() => {
    // Fetch jenis options from API
    const fetchJenisOptions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/kategori`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        const formattedOptions = data.map(
          (item: { kode_kategori: string; nama_kategori: string }) => ({
            value: item.kode_kategori,
            label: item.nama_kategori,
          }),
        );
        setJenisOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching jenis options:", error);
      }
    };
    fetchJenisOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("namaBarang:", namaBarang);
    console.log("satuan:", satuan);
    console.log("jenis:", jenis);
    console.log("stokAwal:", stokAwal);
    console.log("hargaCustomer:", hargaCustomer);
    console.log("hargaSupplier:", hargaSupplier);

    Swal.fire({
      title: "Sedang Memproses",
      didOpen: () => {
        Swal.showLoading();
      },
      allowOutsideClick: false,
      background: "#23272a", // warna gelap
      color: "#fff", // teks putih
    });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          nama_produk: namaBarang,
          kode_kategori: jenis,
          satuan: satuan,
          stok: stokAwal,
          harga_suplier: hargaSupplier,
          harga_customer: hargaCustomer,
        }),
      });
      if (res.status === 201 || res.status === 200) {
        Swal.fire({
          title: "Berhasil",
          text: "Data Barang Berhasil Ditambahkan",
          icon: "success",
          background: "#23272a", // warna gelap
          color: "#fff", // teks putih
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.reload()
        }, 2000)
        setNamaBarang("");
        setSatuan("");
        setJenis("");
        setStokAwal(0);
        setHargaCustomer("");
        setFormatHargaCustomer("");
        setHargaSupplier("");
        setFormatHargaSupplier("");
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Gagal Menambahkan Data Barang",
          icon: "error",
          background: "#23272a", // warna gelap
          color: "#fff", // teks putih
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Terjadi Kesalahan",
        icon: "error",
        background: "#23272a", // warna gelap
        color: "#fff", // teks putih
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div>
      <PageBreadcrumb pageTitle="Stok" />
      <ComponentCard title="Input Stok" className="mb-5">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <div className="w-[70%]">
              <Label>Nama Barang</Label>
              <Input
                placeholder="Masukkan Nama Barang"
                defaultValue={namaBarang}
                onChange={(e) => setNamaBarang(e.target.value)}
              ></Input>
            </div>
            <div className="w-[28%]">
              <Label>Satuan</Label>
              <Select
                options={options}
                placeholder="Pilih Satuan"
                onChange={(value) => setSatuan(value)}
                className="dark:bg-dark-900"
              />
            </div>
          </div>
          <div>
            <Label>Jenis</Label>
            <SearchableSelect
              options={jenisOptions}
              placeholder="Pilih Jenis"
              onChange={(value) => setJenis(value)}
              className="dark:bg-dark-900"
            />
          </div>
          <div>
            <Label>Stok Awal</Label>
            <Input
              type="number"
              placeholder="Masukkan Stok Awal"
              onChange={(e) => setStokAwal(e.target.valueAsNumber)}
              defaultValue={stokAwal}
            ></Input>
          </div>
          <div>
            <Label>Harga Customer</Label>
            <Input
              type="text"
              placeholder="Masukkan Angka Nominal"
              value={formatHargaCustomer}
              onChange={handleHargaCustomerChange}
            ></Input>
          </div>
          <div>
            <Label>Harga Supplier</Label>
            <Input
              type="text"
              placeholder="Masukkan Angka Nominal"
              value={formatHargaSupplier}
              onChange={handleHargaSupplierChange}
            ></Input>
          </div>
          <div>
            <Button size="md" variant="primary">
              Tambah Data
            </Button>
          </div>
        </form>
      </ComponentCard>
      <ComponentCard title="Tabel Data Barang">
        <DataStok />
      </ComponentCard>
    </div>
  );
}
