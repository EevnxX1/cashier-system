"use client";
import { useState, useEffect } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Input from "../form/input/InputField";
import SearchableSelect from "@/components/form/SearchableSelect";
import Select from "../form/Select";
import Image from "next/image";
import clsx from "clsx";
import Button from "../ui/button/Button";
import Link from "next/link";
import { InfoIcon } from "@/icons";
import { PencilIcon } from "@/icons";
import { CloseLineIcon } from "@/icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface Order {
  id: number;
  kode_produk: string;
  nama_produk: string;
  kode_kategori: string;
  satuan: string;
  stok: string;
  harga_customer: string;
  harga_suplier: string;
}

interface Kategori {
  kode_kategori: string;
  nama_kategori: string;
}

// Fetch kategori options for Select
async function fetchKategoriOptions(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kategori`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return (data || []).map((item: Kategori) => ({
    value: item.kode_kategori,
    label: item.nama_kategori,
  }));
}
// Fetch kategori options for Select

// handleEdit
const handleEdit = async (order: Order) => {
  // Ambil token autentikasi dari localStorage
  const token = localStorage.getItem("token") || "";
  // Ambil daftar kategori dari API untuk select kategori
  const kategoriOptions = await fetchKategoriOptions(token);

  // Promise untuk menunggu hasil dari modal edit (apakah user klik Update/Batal)
  let resolvePromise: (value: boolean) => void;
  const modalPromise = new Promise<boolean>((resolve) => {
    resolvePromise = resolve;
  });

  // Komponen form edit yang akan ditampilkan di dalam modal SweetAlert2
  function EditForm() {
    // State lokal untuk setiap input di modal
    const [namaProduk, setNamaProduk] = useState(order.nama_produk);
    const [kodeKategori, setKodeKategori] = useState(order.kode_kategori);
    const [satuan, setSatuan] = useState(order.satuan);
    const [stok, setStok] = useState(order.stok);
    const [hargaCustomer, setHargaCustomer] = useState(order.harga_customer);
    const [hargaSupplier, setHargaSupplier] = useState(order.harga_suplier);

    // Fungsi untuk format angka ke format rupiah (ribuan)
    function formatRupiah(value: string | number) {
      const numberString = value.toString().replace(/\D/g, "");
      return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Return JSX form edit yang akan muncul di modal
    return (
      <div>
        {/* Input Nama Produk */}
        <div className="mb-5 text-left">
          <label>Nama Produk</label>
          <Input
            value={namaProduk}
            onChange={(e) => setNamaProduk(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Select Kategori dengan fitur search */}
        <div className="mb-5 text-left">
          <label>Kategori</label>
          <SearchableSelect
            options={kategoriOptions}
            defaultValue={kodeKategori}
            onChange={(val) => setKodeKategori(val)}
            className="mt-1"
          />
        </div>
        {/* Select Satuan */}
        <div className="mb-5 text-left">
          <label>Satuan</label>
          <Select
            options={[
              { value: "PCS", label: "PCS" },
              { value: "UNIT", label: "UNIT" },
              { value: "RIM", label: "RIM" },
            ]}
            defaultValue={satuan}
            onChange={(val) => setSatuan(val)}
            className="mt-1"
          />
        </div>
        {/* Input Stok */}
        <div className="mb-5 text-left">
          <label>Stok</label>
          <Input
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            className="mt-1"
          />
        </div>
        {/* Input Harga Customer dengan format rupiah */}
        <div className="mb-5 text-left">
          <label>Harga Customer</label>
          <Input
            value={formatRupiah(hargaCustomer)}
            onChange={(e) =>
              setHargaCustomer(e.target.value.replace(/\D/g, ""))
            }
            className="mt-1"
          />
        </div>
        {/* Input Harga Supplier dengan format rupiah */}
        <div className="mb-5 text-left">
          <label>Harga Supplier</label>
          <Input
            value={formatRupiah(hargaSupplier)}
            onChange={(e) =>
              setHargaSupplier(e.target.value.replace(/\D/g, ""))
            }
            className="mt-1"
          />
        </div>
        {/* Tombol Update dan Batal */}
        <div className="flex justify-end gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={async () => {
              // Validasi: semua field wajib diisi
              if (
                !namaProduk ||
                !kodeKategori ||
                !satuan ||
                !stok ||
                !hargaCustomer ||
                !hargaSupplier
              ) {
                Swal.showValidationMessage("Semua field wajib diisi!");
                return;
              }
              // Kirim update ke API
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/produk/${order.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    nama_produk: namaProduk,
                    kode_kategori: kodeKategori,
                    satuan,
                    stok,
                    harga_customer: hargaCustomer,
                    harga_suplier: hargaSupplier,
                  }),
                },
              );
              // Jika update berhasil, resolve promise dan tutup modal
              if (res.ok) {
                resolvePromise(true);
                Swal.close();
              } else {
                Swal.showValidationMessage("Gagal update data");
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
    title: "Edit Data Produk",
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

export default function DataStok() {
  const [data, setData] = useState<Order[]>([]);
  const [kategoriList, setKategoriList] = useState<
    { kode_kategori: string; nama_kategori: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Format Rupiah function
  function formatRupiah(value: string | number) {
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  // Format Rupiah function

  // Fetch data produk from API
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) // endpoint dari Laravel
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error(err));
  }, []);
  // fetch data produk from API

  // Fetch kategori list from API
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kategori`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) // endpoint dari Laravel
      .then((res) => res.json())
      .then(setKategoriList)
      .catch((err) => console.error(err));
  }, []);
  // Fetch kategori list from API

  // Get nama kategori by kode_kategori
  function getNamaKategori(kode: string) {
    const kategori = kategoriList.find((k) => k.kode_kategori === kode);
    return kategori ? kategori.nama_kategori : kode; // fallback ke kode jika tidak ditemukan
  }
  // Get nama kategori by kode_kategori

  // --- Pagination logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  // --- Pagination logic ---

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex justify-between">
        <div className="flex gap-x-2">
          <Input placeholder="Cari Data" className="w-[40%]"></Input>
          <Button size="sm">Cari</Button>
        </div>
        <div className="flex gap-x-3">
          <Link href={"/stok/AddJenis"}>
            <Button size="sm">Tambah Jenis Barang</Button>
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Kode Barang
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Nama Barang
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Jenis
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Satuan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Stok
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Harga Supplier
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Harga Customer
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
                {currentItems.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.kode_produk}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.nama_produk}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {getNamaKategori(order.kode_kategori)}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.satuan}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.stok}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      Rp. {formatRupiah(order.harga_suplier)}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      Rp. {formatRupiah(order.harga_customer)}
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
                              title: `Apakah Anda yakin Ingin Menghapus ${order.nama_produk}?`,
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
                                  `${process.env.NEXT_PUBLIC_API_URL}/api/produk/${order.id}`,
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
                          href={`/stok/detail?id_stok=${order.id}`}
                          className="mt-2"
                        >
                          <button
                            className={
                              "text-brand-500 scale-[85%] cursor-pointer"
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
