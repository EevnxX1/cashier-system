"use client";

import { useEffect, useState } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Input from "../form/input/InputField";
import Image from "next/image";
import clsx from "clsx";
import Button from "../ui/button/Button";
import Link from "next/link";
import { PencilIcon, CloseLineIcon, InfoIcon } from "@/icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

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

// create handleInput function with modal

// handleCreate
const handleCreate = async () => {
  // Ambil token autentikasi dari localStorage
  const token = localStorage.getItem("token") || "";

  // Promise untuk menunggu hasil dari modal create (apakah user klik Create/Batal)
  let resolvePromise: (value: boolean) => void;
  const modalPromise = new Promise<boolean>((resolve) => {
    resolvePromise = resolve;
  });

  // Komponen form create yang akan ditampilkan di dalam modal SweetAlert2
  function CreateForm() {
    // State lokal untuk setiap input di modal
    const [namaSupplier, setNamaSupplier] = useState("");
    const [alamat, setAlamat] = useState("");
    const [kota, setKota] = useState("");
    const [syaratBayar, setSyaratBayar] = useState("");
    const [telepon, setTelepon] = useState("");
    const [namaKontak, setNamaKontak] = useState("");
    const [bank, setBank] = useState("");
    const [nomorRekening, setNomorRekening] = useState("");
    const [saldoHutang, setSaldoHutang] = useState("");
    // ... tambahkan field lainnya

    // Format Rupiah pada saat penginputan

    function formatRupiah(value: string | number) {
      const numberString = value.toString().replace(/\D/g, "");
      return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Return JSX form create yang akan muncul di modal
    return (
      <div>
        {/* Input Nama Supplier */}
        <div className="mb-5 text-left">
          <label>Nama Supplier</label>
          <Input
            value={namaSupplier}
            onChange={(e) => setNamaSupplier(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Alamat */}
        <div className="mb-5 text-left">
          <label>Alamat</label>
          <Input
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Kota */}
        <div className="mb-5 text-left">
          <label>Kota</label>
          <Input
            value={kota}
            onChange={(e) => setKota(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Syarat Bayar */}
        <div className="mb-5 text-left">
          <label>Syarat Bayar</label>
          <div className="flex w-full items-center gap-x-2">
            <Input
              value={syaratBayar}
              onChange={(e) => setSyaratBayar(e.target.value)}
              className="mt-1"
            />
            <span>Hari</span>
          </div>
        </div>
        {/* Input Telepon */}
        <div className="mb-5 text-left">
          <label>No. Hp</label>
          <Input
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Nama Kontak */}
        <div className="mb-5 text-left">
          <label>Nama Kontak</label>
          <Input
            value={namaKontak}
            onChange={(e) => setNamaKontak(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Bank */}
        <div className="mb-5 text-left">
          <label>Bank</label>
          <Input
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Nomor Rekening */}
        <div className="mb-5 text-left">
          <label>Nomor Rekening</label>
          <Input
            value={nomorRekening}
            onChange={(e) => setNomorRekening(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Saldo Hutang */}
        <div className="mb-5 text-left">
          <label>Saldo Hutang</label>
          <Input
            value={formatRupiah(saldoHutang)}
            onChange={(e) => setSaldoHutang(e.target.value.replace(/\D/g, ""))}
            className="mt-1"
          />
        </div>
        {/* ... tambahkan field lainnya */}
        {/* Tombol Create dan Batal */}
        <div className="flex justify-end gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={async () => {
              // Validasi: semua field wajib diisi
              if (
                !namaSupplier ||
                !alamat ||
                !telepon ||
                !kota ||
                !syaratBayar ||
                !namaKontak ||
                !bank ||
                !nomorRekening ||
                !saldoHutang
              ) {
                Swal.showValidationMessage("Semua field wajib diisi!");
                return;
              }
              // Kirim create ke API
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/supplier`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    nama_supplier: namaSupplier,
                    alamat: alamat,
                    kota: kota,
                    syarat_bayar: syaratBayar,
                    nomor_hp: telepon,
                    nama_kontak: namaKontak,
                    bank: bank,
                    nomor_rekening: nomorRekening,
                    saldo_hutang: saldoHutang,
                    // ... tambahkan field lainnya
                  }),
                },
              );
              // Jika create berhasil, resolve promise dan tutup modal
              if (res.ok) {
                resolvePromise(true);
                Swal.close();
              } else {
                Swal.showValidationMessage("Gagal create data");
              }
            }}
          >
            Create
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              // Jika batal, resolve promise dengan false dan tutup modal
              resolvePromise(false);
              Swal.close();
            }}
          >
            Batal
          </Button>
        </div>
      </div>
    );
  }

  // Tampilkan modal SweetAlert2 dengan form create di dalamnya
  await MySwal.fire({
    title: "Create Data Supplier",
    html: <CreateForm />,
    showConfirmButton: false,
    showCancelButton: false,
    background: "#23272a",
    color: "#fff",
    didOpen: () => {},
    willClose: () => {},
  });

  // Tunggu hasil dari modal (apakah user klik Create atau Batal)
  const result = await modalPromise;
  if (result) {
    // Jika create sukses, tampilkan notifikasi sukses
    Swal.fire({
      icon: "success",
      title: "Data berhasil dibuat",
      background: "#23272a",
      color: "#fff",
      timer: 2000,
      showConfirmButton: false,
    });
    // Refresh halaman setelah create (setelah 2 detik)
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};
// handleCreate

// handleEdit
const handleEdit = async (order: Order) => {
  // Ambil token autentikasi dari localStorage
  const token = localStorage.getItem("token");

  // Promise untuk menunggu hasil dari modal edit (apakah user klik Update/Batal)
  let resolvePromise: (value: boolean) => void;
  const modalPromise = new Promise<boolean>((resolve) => {
    resolvePromise = resolve;
  });

  // Komponen form edit yang akan ditampilkan di dalam modal SweetAlert2
  function EditForm() {
    // State lokal untuk setiap input di modal
    const [namaSupplier, setNamaSupplier] = useState(order.nama_supplier);
    const [alamat, setAlamat] = useState(order.alamat);
    const [kota, setKota] = useState(order.kota);
    const [syaratBayar, setSyaratBayar] = useState(order.syarat_bayar);
    const [telepon, setTelepon] = useState(order.nomor_hp);
    const [namaKontak, setNamaKontak] = useState(order.nama_kontak);
    const [bank, setBank] = useState(order.bank);
    const [nomorRekening, setNomorRekening] = useState(order.nomor_rekening);
    const [saldoHutang, setSaldoHutang] = useState(order.saldo_hutang);

    // Fungsi untuk format angka ke format rupiah (ribuan)
    function formatRupiah(value: string | number) {
      const numberString = value.toString().replace(/\D/g, "");
      return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Return JSX form edit yang akan muncul di modal
    return (
      <div>
        {/* Input Nama Supplier */}
        <div className="mb-5 text-left">
          <label>Nama Supplier</label>
          <Input
            value={namaSupplier}
            onChange={(e) => setNamaSupplier(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Alamat */}
        <div className="mb-5 text-left">
          <label>Alamat</label>
          <Input
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Kota */}
        <div className="mb-5 text-left">
          <label>Kota</label>
          <Input
            value={kota}
            onChange={(e) => setKota(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Syarat Bayar */}
        <div className="mb-5 text-left">
          <label>Syarat Bayar</label>
          <div className="flex w-full items-center gap-x-2">
            <Input
              value={syaratBayar}
              onChange={(e) => setSyaratBayar(e.target.value)}
              className="mt-1"
            />
            <span>Hari</span>
          </div>
        </div>
        {/* Input Telepon */}
        <div className="mb-5 text-left">
          <label>No. Hp</label>
          <Input
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Nama Kontak */}
        <div className="mb-5 text-left">
          <label>Nama Kontak</label>
          <Input
            value={namaKontak}
            onChange={(e) => setNamaKontak(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Bank */}
        <div className="mb-5 text-left">
          <label>Bank</label>
          <Input
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Nomor Rekening */}
        <div className="mb-5 text-left">
          <label>Nomor Rekening</label>
          <Input
            value={nomorRekening}
            onChange={(e) => setNomorRekening(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Saldo Hutang */}
        <div className="mb-5 text-left">
          <label>Saldo Hutang</label>
          <Input
            value={formatRupiah(saldoHutang)}
            onChange={(e) => setSaldoHutang(e.target.value.replace(/\D/g, ""))}
            className="mt-1"
          />
        </div>
        {/* ... tambahkan field lainnya */}
        {/* Tombol Create dan Batal */}
        <div className="flex justify-end gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={async () => {
              // Validasi: semua field wajib diisi
              console.log("Kode Supplier:");
              console.log("Nama Supplier:", namaSupplier);
              console.log("Alamat:", alamat);
              console.log("Kota:", kota);
              console.log("Syarat Bayar:", syaratBayar);
              console.log("Telepon:", telepon);
              console.log("Nama Kontak:", namaKontak);
              console.log("Bank:", bank);
              console.log("Nomor Rekening:", nomorRekening);
              console.log("Saldo Hutang:", saldoHutang);
              if (
                !namaSupplier ||
                !alamat ||
                !telepon ||
                !kota ||
                !syaratBayar ||
                !namaKontak ||
                !bank ||
                !nomorRekening ||
                !saldoHutang
              ) {
                Swal.showValidationMessage("Semua field wajib diisi!");
                return;
              }
              // Kirim Update ke API
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/supplier/${order.kode_supplier}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    nama_supplier: namaSupplier,
                    alamat: alamat,
                    kota: kota,
                    syarat_bayar: syaratBayar,
                    nomor_hp: telepon,
                    nama_kontak: namaKontak,
                    bank: bank,
                    nomor_rekening: nomorRekening,
                    saldo_hutang: saldoHutang,
                    // ... tambahkan field lainnya
                  }),
                },
              );
              // Jika create berhasil, resolve promise dan tutup modal
              if (res.ok) {
                resolvePromise(true);
                Swal.close();
              } else {
                Swal.showValidationMessage("Gagal create data");
              }
            }}
          >
            Update
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              // Jika batal, resolve promise dengan false dan tutup modal
              resolvePromise(false);
              Swal.close();
            }}
          >
            Batal
          </Button>
        </div>
      </div>
    );
  }
  // Tampilkan modal SweetAlert2 dengan form edit di dalamnya
  await MySwal.fire({
    title: "Edit Data Supplier",
    html: <EditForm />,
    showConfirmButton: false,
    showCancelButton: false,
    background: "#23272a",
    color: "#fff",
    didOpen: () => {},
    willClose: () => {},
  });

  // Tunggu hasil dari modal (apakah user klik Update atau Batal)
  const result = await modalPromise;
  if (result) {
    // Jika update sukses, tampilkan notifikasi sukses
    Swal.fire({
      icon: "success",
      title: "Data berhasil diupdate",
      background: "#23272a",
      color: "#fff",
      timer: 2000,
      showConfirmButton: false,
    });
    // Refresh halaman setelah update (setelah 2 detik)
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};
// handleEdit

// create handleInput function with modal

export default function DataSupplier() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [data, setData] = useState<Order[]>([]);

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
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // --- Pagination logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Format rupiah
  function formatRupiah(value: string | number) {
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return (
    <div className="flex flex-col">
      <div className="mb-5 flex justify-between">
        <div className="flex gap-x-2">
          <Input placeholder="Cari Data" className="w-[40%]"></Input>
          <Button size="sm">Cari</Button>
        </div>
        <div className="flex gap-x-3">
          <Button size="sm" onClick={handleCreate}>
            Tambah Supplier
          </Button>
          <Link href={"/supplier"}>
            <Button size="sm">Cetak Supplier</Button>
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    No
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Nama Supplier
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Kota
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Nomor Hp
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Saldo Hutang
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-9 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.nama_supplier}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.kota}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.nomor_hp}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      Rp. {formatRupiah(order.saldo_hutang)}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      <div className="flex">
                        <button
                          onClick={() => handleEdit(order)}
                          className="mt-1"
                        >
                          <PencilIcon />
                        </button>
                        <span className="mr-[4px] ml-[4px] border border-gray-500"></span>
                        <button
                          className={"cursor-pointer text-red-800"}
                          onClick={() => {
                            Swal.fire({
                              title: `Apakah Anda yakin Ingin Menghapus ${order.nama_supplier}?`,
                              text: "Data yang dihapus tidak dapat dikembalikan!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Ya, hapus!",
                              cancelButtonText: "Batal",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                const token = localStorage.getItem("token");
                                fetch(
                                  `${process.env.NEXT_PUBLIC_API_URL}/api/supplier/${order.id}`,
                                  {
                                    method: "DELETE",
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    },
                                  },
                                )
                                  .then((response) => {
                                    if (
                                      response.status === 200 ||
                                      response.status === 201
                                    ) {
                                      // Jika penghapusan berhasil, refresh data
                                      setData((prevData) =>
                                        prevData.filter(
                                          (item) => item.id !== order.id,
                                        ),
                                      );
                                      Swal.fire(
                                        "Dihapus!",
                                        "Data berhasil dihapus.",
                                        "success",
                                      );
                                    } else {
                                      Swal.fire(
                                        "Gagal!",
                                        "Terjadi kesalahan saat menghapus data.",
                                        "error",
                                      );
                                    }
                                  })
                                  .catch((error) => {
                                    console.error(
                                      "Error deleting data:",
                                      error,
                                    );
                                    Swal.fire(
                                      "Gagal!",
                                      "Terjadi kesalahan saat menghapus data.",
                                      "error",
                                    );
                                  });
                              }
                            });
                          }}
                        >
                          <CloseLineIcon />
                        </button>
                        <span className="mr-[4px] ml-[4px] border border-gray-500"></span>
                        <Link
                          href={`/supplier/detail?id_supplier=${order.id}`}
                          className="mt-2"
                        >
                          <button
                            className={
                              "text-brand-500 scale-[83%] cursor-pointer"
                            }
                          >
                            <InfoIcon />
                          </button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div className="dark:bg-brand-500 mt-5 flex items-center self-center rounded-xl bg-white text-black">
        <button
          className="flex h-10 w-12 cursor-pointer items-center justify-center disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <Image
            src={"/assets/__.png"}
            alt="arrow left"
            width={50}
            height={50}
            className="w-3"
          ></Image>
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={clsx(
              "flex h-10 w-10 cursor-pointer items-center justify-center border border-white/15",
              currentPage === i + 1 ? "bg-blue-500 text-white" : "",
            )}
            onClick={() => setCurrentPage(i + 1)}
          >
            <p>{i + 1}</p>
          </button>
        ))}
        <button
          className="flex h-10 w-12 cursor-pointer items-center justify-center disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <Image
            src={"/assets/__.png"}
            alt="arrow left"
            width={50}
            height={50}
            className="w-3 rotate-180"
          ></Image>
        </button>
      </div>
    </div>
  );
}
