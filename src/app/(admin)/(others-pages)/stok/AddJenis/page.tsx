"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { ChevronLeftIcon } from "@/icons";
import DataJenis from "@/components/tables/DataJenis";
import Swal from "sweetalert2";

export default function Jenis() {
  const [ket, setKet] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/kategori`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ nama_kategori: ket }),
        },
      );
      if (res.status === 201 || res.status === 200) {
        Swal.fire({
          title: "Berhasil",
          text: "Jenis Barang Berhasil Ditambahkan",
          icon: "success",
          background: "#23272a", // warna gelap
          color: "#fff", // teks putih
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          title: "Gagal",
          text: "Gagal Menambahkan Jenis Barang",
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
        title: "Terjadi Kesalahan Teknis",
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
      <div className="flex justify-between">
        <h1 className="text-xl font-bold text-white">Jenis</h1>
        <div className="mb-5">
          <Link
            href="/stok"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Kembali Ke Halaman Stok
          </Link>
        </div>
      </div>
      <ComponentCard title="Input Jenis" className="mb-5">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label>Keterangan Jenis</Label>
            <Input
              defaultValue={ket}
              onChange={(e) => setKet(e.target.value)}
            ></Input>
          </div>
          <div>
            <Button size="md" variant="primary">
              Tambah Jenis
            </Button>
          </div>
        </form>
      </ComponentCard>
      <ComponentCard title="Tabel Data Jenis">
        <DataJenis />
      </ComponentCard>
    </div>
  );
}
