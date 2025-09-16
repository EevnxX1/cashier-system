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
import SearchableSelect from "../form/SearchableSelect";
import clsx from "clsx";

const MySwal = withReactContent(Swal);

interface PembelianItem {
  kode_produk: string;
  qty: number;
  harga_customer: number;
  harga_supplier: number;
}

interface produk {
  kode_produk: string;
  nama_produk: string;
}

export default function DataPembelian({
  tanggal,
  kodeSupplier,
  namaSupplier,
  ket,
  termin,
  tgl_jth_tempo,
}: {
  tanggal: string;
  kodeSupplier: string;
  namaSupplier: string;
  ket: string;
  termin: string;
  tgl_jth_tempo: string;
}) {
  // Membuat fungsi Sistem menyimpan data ke data sementara
  // (Sistem data sementara) 1. buat state lokal untuk menyimpan data supplier dan data produk
  const [pembelianItems, setPembelianItems] = useState({
    tanggal: "",
    termin: "",
    tempo: "",
    kode_supplier: "",
    items: [] as PembelianItem[],
  });
  // (sistem data sementara)
  const [produk, setProduk] = useState<produk[]>([]);

  // jika data dari halaman sebelum sudah terkirim ke sini maka simpan ke data pembelianItems
  useEffect(() => {
    setPembelianItems((prevData) => ({
      ...prevData,
      tanggal: tanggal,
      termin: termin,
      tempo: tgl_jth_tempo,
      kode_supplier: kodeSupplier,
    }));
  }, [tanggal, termin, tgl_jth_tempo, kodeSupplier]);

  // liat data pembelian items apakah dia bertambah atau tidak
  useEffect(() => {
    console.log("data pembelian:", pembelianItems);
  }, [pembelianItems]);

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
      const token = localStorage.getItem("token");
      const [kodeBarang, setKodeBarang] = useState("");
      const [jumlah, setJumlah] = useState("");
      const [hargaCustomer, setHargaCustomer] = useState("");
      const [hargaSupplier, setHargaSupplier] = useState("");
      const [tot_hrg, setTot_hrg] = useState("");
      const [stok, setStok] = useState("");

      // Fungsi Fetch option list barang dari API
      const [options, setOptions] = useState<
        {
          value: string;
          label: string;
        }[]
      >([]);

      React.useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            const options = data.map(
              (item: { kode_produk: string; nama_produk: string }) => ({
                value: item.kode_produk,
                label: item.nama_produk,
              }),
            );
            setOptions(options);
          });
      }, [token]);
      // fungsi fetch option list barang dari API

      // Jika User sudah memilih barang, keluarkan data barang itu dari option list
      useEffect(() => {
        const selectedOption = options.find(
          (option) => option.value === kodeBarang,
        );
        if (selectedOption) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              const selectedData = data.find(
                (item: { kode_produk: string }) =>
                  item.kode_produk === kodeBarang,
              );
              if (selectedData) {
                setStok(selectedData.stok);
                setHargaCustomer(selectedData.harga_customer);
                setHargaSupplier(selectedData.harga_suplier);
              }
            });
        }
      }, [kodeBarang, options, token]);
      // Jika User sudah memilih barang keluarkan data barang itu dari option list

      // jika user mengetik qty, maka kalikan dengan harga barang itu
      useEffect(() => {
        if (jumlah && hargaSupplier) {
          setTot_hrg((parseInt(jumlah) * parseInt(hargaSupplier)).toString());
        }
      }, [jumlah, hargaSupplier]);

      // ... tambahkan field lainnya

      // Format Rupiah pada saat penginputan

      function formatRupiah(value: string | number) {
        const numberString = value.toString().replace(/\D/g, "");
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      // Fungsi untuk menyimpan data ke data sementara
      const handleAddItem = () => {
        if (kodeBarang && jumlah && hargaSupplier && hargaCustomer) {
          const newItem: PembelianItem = {
            kode_produk: kodeBarang,
            qty: parseInt(jumlah),
            harga_customer: parseInt(hargaCustomer),
            harga_supplier: parseInt(hargaSupplier),
          };
          setPembelianItems((prevData) => ({
            ...prevData,
            items: [...prevData.items, newItem],
          }));
          // Jika create berhasil, resolve promise dengan true dan tutup modal
          resolvePromise(true);
          Swal.close();
        } else {
          // jika belum mengisi semua field, tampilkan pesan error
          Swal.showValidationMessage("Semua field wajib diisi!");
        }
      };

      // Return JSX form create yang akan muncul di modal
      return (
        <div>
          <div className="mb-5 text-left">
            <label>Nama Barang</label>
            <SearchableSelect
              onChange={(e) => setKodeBarang(e)}
              options={options}
              className="mt-1"
              placeholder="Pilih Nama Barang"
            />
          </div>
          <div className="mb-5 text-left">
            <label>Stok Barang Saat Ini</label>
            <Input value={stok} className="mt-1" disabled />
          </div>
          <div className="mb-5 text-left">
            <label>Harga Barang Satuan</label>
            <Input
              value={formatRupiah(hargaSupplier)}
              onChange={(e) =>
                setHargaSupplier(e.target.value.replace(/\D/g, ""))
              }
              className="mt-1"
            />
          </div>
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
          <div className="mb-5 text-left">
            <label>Jumlah Barang</label>
            <Input
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="mb-5 text-left">
            <label>Total Harga</label>
            <Input value={formatRupiah(tot_hrg)} disabled className="mt-1" />
          </div>

          {/* ... tambahkan field lainnya */}
          {/* Tombol Create dan Batal */}
          <div className="flex justify-end gap-2">
            <Button variant="primary" size="sm" onClick={handleAddItem}>
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
    }
  };
  // handleCreate

  // tampilkan data produk dari fetch API
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProduk)
      .catch((err) => console.error(err));
  }, []);

  // Format Rupiah function
  function formatRupiah(value: string | number) {
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // fungsi hapus data sementara
  const handleDelete = (index: number) => {
    Swal.fire({
      title: "Anda yakin ingin menghapus data ini?",
      text: "Data yang telah dihapus tidak dapat dikembalikan!",
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
        const updatedItems = [...pembelianItems.items];
        updatedItems.splice(index, 1);
        setPembelianItems((prevData) => ({
          ...prevData,
          items: updatedItems,
        }));
        Swal.fire("Deleted!", "Data berhasil dihapus.", "success");
      }
    });
  };

  // jika supplier dan barang sudah di tentukan maka data bisa langsung disimpan ke fetch api
  const handleSave = () => {
    // apakah data sudah lengkap
    const data = pembelianItems;
    if (data.items.length !== 0) {
      const token = localStorage.getItem("token");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pembelian-supplier`, {
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
      <div
        className={clsx("mb-5 w-full text-white", {
          flex: tanggal && namaSupplier && ket,
          hidden: !tanggal || !namaSupplier || !ket,
        })}
      >
        <div className="flex w-full flex-col gap-y-5">
          <div className="flex w-full justify-between">
            <h3>Tanggal</h3>
            <div className="w-[70%]">
              <p className="text-start">: {tanggal}</p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <h3>Nama Supplier</h3>
            <div className="w-[70%]">
              <p className="text-start">: {namaSupplier}</p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <h3>Keterangan</h3>
            <div className="w-[70%]">
              <p className="text-start">: {ket}</p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <h3>Termin</h3>
            <div className="w-[70%]">
              <p className="text-start">
                : {termin ? `${termin} Hari` : "Tidak Ada Termin"}
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <h3>Tanggal Jatuh Tempo</h3>
            <div className="w-[70%]">
              <p className="text-start">
                :{" "}
                {tgl_jth_tempo
                  ? tgl_jth_tempo
                  : "Tidak Ada Tanggal Jatuh Tempo"}
              </p>
            </div>
          </div>
        </div>
        <Button
          className="h-10 bg-red-600 hover:bg-red-800"
          onClick={() => {
            window.location.reload();
          }}
        >
          X
        </Button>
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
                    Kode Brg
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
                    Jumlah
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
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Total
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
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {pembelianItems.items.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.kode_produk}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {
                        // menampilkan nama produk dari kode produk
                        produk.find(
                          (item) => item.kode_produk === order.kode_produk,
                        )?.nama_produk
                      }
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.qty}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      Rp. {formatRupiah(order.harga_supplier)}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      Rp. {formatRupiah(order.harga_customer)}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      Rp.{" "}
                      {
                        // menghitung total harga
                        formatRupiah(order.qty * order.harga_supplier)
                      }
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
            </Table>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-x-5">
          <Button onClick={handleCreate}>Tambah Barang +</Button>
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
        </div>
        <div className="flex gap-x-10 text-gray-400">
          <div className="flex gap-x-3">
            <p>Jumlah Item</p>
            <div className="rounded-sm border border-white/[0.03] bg-white/[0.03] px-3">
              {
                // menampilkan total jumlah barang
                pembelianItems.items.reduce(
                  (total, item) => total + item.qty,
                  0,
                )
              }
            </div>
          </div>
          <div className="flex gap-x-3">
            <p>Total</p>
            <div className="rounded-sm border border-white/[0.03] bg-white/[0.03] px-3">
              {/* menampilkan total harga yang sudah di hitung qty * harga lalu hitung seluruh total harga barang */}
              Rp.{" "}
              {formatRupiah(
                pembelianItems.items.reduce(
                  (total, item) => total + item.qty * item.harga_supplier,
                  0,
                ),
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
