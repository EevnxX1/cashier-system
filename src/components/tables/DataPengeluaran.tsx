"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { CloseLineIcon } from "@/icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useState } from "react";
import Input from "../form/input/InputField";
import DatePicker from "../form/date-picker";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";

const MySwal = withReactContent(Swal);

interface pengeluaran {
  tanggal: string;
  keterangan: string;
  sumber_dana: string;
  jumlah: number;
}

export default function DataPengeluaran() {
  // Membuat fungsi Sistem menyimpan data ke data sementara
  // (Sistem data sementara) 1. buat state lokal untuk menyimpan data sejumlah pengeluaran
  const [dataPengeluaran, setDataPengeluaran] = useState([] as pengeluaran[]);
  // (sistem data sementara)

  // liat data pengeluaran apakah dia bertambah atau tidak
  useEffect(() => {
    console.log("dataPengeluaran:", dataPengeluaran);
  }, [dataPengeluaran]);

  // handleCreate
  const handleCreate = async () => {
    // Ambil token autentikasi dari localStorage

    // Promise untuk menunggu hasil dari modal create (apakah user klik Create/Batal)
    let resolvePromise: (value: boolean) => void;
    const modalPromise = new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });

    // Komponen form create yang akan ditampilkan di dalam modal SweetAlert2
    function CreateForm() {
      // State lokal untuk setiap input di modal
      const [tanggal, setTanggal] = useState("");
      const [keterangan, setKeterangan] = useState("");
      const [sumberDana, setSumberDana] = useState("");
      const [jumlah, setJumlah] = useState("");

      // Format Rupiah pada saat penginputan
      function formatRupiah(value: string | number) {
        const numberString = value.toString().replace(/\D/g, "");
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      // Fungsi untuk menyimpan data ke data sementara
      const handleAddItem = () => {
        if (tanggal && keterangan && sumberDana && jumlah) {
          const newItem: pengeluaran = {
            tanggal: tanggal,
            keterangan: keterangan,
            sumber_dana: sumberDana,
            jumlah: parseInt(jumlah),
          };
          //   Menyimpan data ke data sementara
          setDataPengeluaran((prevData) => [...prevData, newItem]);
          // Jika create berhasil, resolve promise dengan true dan tutup modal
          resolvePromise(true);
          Swal.close();
        } else {
          // jika belum mengisi semua field, tampilkan pesan error
          Swal.showValidationMessage("Semua field wajib diisi!");
        }
      };

      //   atur default value dengan tanggal sekarang
      useEffect(() => {
        const now = new Date();
        const formatted = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        setTanggal(formatted);
      }, []);

      const options = [
        { value: "kas", label: "Kas" },
        { value: "bank", label: "Bank" },
      ];

      // Return JSX form create yang akan muncul di modal
      return (
        <div>
          <div className="mb-5 text-left">
            <label>Tanggal</label>
            <div className="mt-1">
              <DatePicker
                id="tanggal"
                placeholder="Select a date"
                defaultDate={tanggal}
                onChange={(dates, currentDateString) => {
                  // Handle your logic
                  console.log({ dates, currentDateString });
                  setTanggal(currentDateString);
                }}
              />
            </div>
          </div>
          <div className="mb-5 text-left">
            <label>Keterangan</label>
            <TextArea
              value={keterangan}
              placeholder="Keterangan"
              onChange={(value) => setKeterangan(value)}
              rows={6}
              className="mt-1"
            />
          </div>
          <div className="mb-5 text-left">
            <label>Sumber Dana</label>
            <Select
              options={options}
              placeholder="Pilih Sumber Dana"
              onChange={(value) => setSumberDana(value)}
              className="dark:bg-dark-900 mt-1"
            />
          </div>
          <div className="mb-5 text-left">
            <label>Jumlah</label>
            <Input
              value={formatRupiah(jumlah)}
              onChange={(e) => setJumlah(e.target.value.replace(/\D/g, ""))}
              className="mt-1"
            />
          </div>
          {/* Tombol Create dan Batal */}
          <div className="flex justify-end gap-2">
            <Button variant="primary" size="sm" onClick={handleAddItem}>
              Tambah
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
      title: "Tambah Data Pengeluaran",
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
        title: "Data berhasil ditambahkan",
        background: "#23272a",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  // handleCreate

  // Format Rupiah function
  function formatRupiah(value: string | number) {
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // fungsi hapus data sementara
  const handleDelete = (index: number) => {
    Swal.fire({
      title: "Anda yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      background: "#23272a",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedItems = [...dataPengeluaran];
        updatedItems.splice(index, 1);
        // hapus data sementara
        setDataPengeluaran(updatedItems);
        Swal.fire("Deleted!", "Data berhasil dihapus.", "success");
      }
    });
  };

  // jika supplier dan barang sudah di tentukan maka data bisa langsung disimpan ke fetch api
  const handleSave = () => {
    // apakah data sudah lengkap
    const data = dataPengeluaran;
    if (dataPengeluaran.length !== 0) {
      const token = localStorage.getItem("token");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pengeluaran`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Data berhasil disimpan",
            background: "#23272a",
            color: "#fff",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload();
          });
        })
        .catch((err) => console.error(err));
    } else {
      Swal.fire({
        icon: "error",
        title: "Data belum lengkap",
        background: "#23272a",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };
  return (
    <div className="flex flex-col">
      <div className="mb-5 flex gap-x-5">
        <Button onClick={handleCreate}>Tambah Data +</Button>
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
                    Tanggal
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Keterangan
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Jumlah
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Kas/Bank
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              {
                // jika data belum ada
                dataPengeluaran.length === 0 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-center text-gray-500 dark:text-gray-400">
                        -
                      </TableCell>
                      <TableCell className="text-center text-gray-500 dark:text-gray-400">
                        -
                      </TableCell>
                      <TableCell className="text-center text-gray-500 dark:text-gray-400">
                        -
                      </TableCell>
                      <TableCell className="text-center text-gray-500 dark:text-gray-400">
                        -
                      </TableCell>
                      <TableCell className="text-center text-gray-500 dark:text-gray-400">
                        -
                      </TableCell>
                      <TableCell className="text-center text-gray-500 dark:text-gray-400">
                        -
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  // jika data sudah ada
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {dataPengeluaran.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          {order.tanggal}
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          {order.keterangan}
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          Rp. {formatRupiah(order.jumlah)}
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          {order.sumber_dana}
                        </TableCell>
                        <div className="mt-3 pl-7">
                          <button
                            className={"scale-150 cursor-pointer text-red-800"}
                            onClick={() => handleDelete(index)}
                          >
                            <CloseLineIcon />
                          </button>
                        </div>
                      </TableRow>
                    ))}
                  </TableBody>
                )
              }
            </Table>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <Button
          className="hover:bg-green-500"
          onClick={() => {
            // apakah user yakin ingin menyimpan data
            Swal.fire({
              title: "Yakin Simpan Data ?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ya",
              cancelButtonText: "Tidak",
            }).then((result) => {
              if (result.isConfirmed) {
                // jika user yakin, maka simpan data
                handleSave();
              }
            });
          }}
        >
          Simpan Data
        </Button>
        <div className="flex gap-x-10 text-gray-400">
          <div className="flex gap-x-3">
            <p>Total</p>
            <div className="rounded-sm border border-white/[0.03] bg-white/[0.03] px-3">
              {/* menampilkan total harga yang sudah di hitung qty * harga lalu hitung seluruh total harga barang */}
              Rp.{" "}
              {formatRupiah(
                dataPengeluaran.reduce((total, item) => total + item.jumlah, 0),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
