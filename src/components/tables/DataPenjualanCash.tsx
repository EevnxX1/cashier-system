"use client";
import React, { useEffect, useState } from "react";
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
import Input from "../form/input/InputField";
import SearchableSelect from "../form/SearchableSelect";

const MySwal = withReactContent(Swal);

interface PembelianTunai {
  kode_produk: string;
  qty: number;
  diskon: number;
}

interface produk {
  kode_produk: string;
  nama_produk: string;
  harga_customer: number;
}

export default function DataPenjualanCash() {
  // Membuat fungsi Sistem menyimpan data ke data sementara
  // (Sistem data sementara) 1. buat state lokal untuk menyimpan data sejumlah barang
  const [dataPembelian, setDataPembelian] = useState({
    tanggal: "",
    items: [] as PembelianTunai[],
  });
  // (sistem data sementara)

  //   buat state lokal data produk
  const [produk, setProduk] = useState<produk[]>([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [totalBayar, setTotalBayar] = useState("");
  const [totalKembalian, setTotalKembalian] = useState(0);

  //   untuk tanggal kita isi valuenya dengan tanggal saat ini
  useEffect(() => {
    setDataPembelian((prevData) => ({
      ...prevData,
      tanggal: new Date().toISOString().split("T")[0],
    }));
  }, []);

  // liat data pengeluaran apakah dia bertambah atau tidak
  useEffect(() => {
    console.log("dataPengeluaran:", dataPembelian);
  }, [dataPembelian]);

  // handleCreate
  const handleCreate = async () => {
    // Promise untuk menunggu hasil dari modal create (apakah user klik Create/Batal)
    let resolvePromise: (value: boolean) => void;
    const modalPromise = new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });

    // Komponen form create yang akan ditampilkan di dalam modal SweetAlert2
    function CreateForm() {
      // State lokal untuk setiap input di modal
      const [kodeProduk, setKodeProduk] = useState("");
      const [qty, setQty] = useState("0");
      const [diskon, setDiskon] = useState("0");
      const [harga, setHarga] = useState("0");
      const [total, setTotal] = useState("0");
      const token = localStorage.getItem("token");

      // Fungsi Fetch option list barang dari API
      const [options, setOptions] = useState<
        {
          value: string;
          label: string;
        }[]
      >([]);

      useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            const options = data.map((item: produk) => ({
              value: item.kode_produk,
              label: `${item.kode_produk} - ${item.nama_produk}`,
            }));
            setOptions(options);
          });
      }, [token]);

      // Jika User sudah memilih barang, keluarkan data barang itu dari option list
      useEffect(() => {
        const selectedOption = options.find(
          (option) => option.value === kodeProduk,
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
                  item.kode_produk === kodeProduk,
              );
              if (selectedData) {
                setHarga(selectedData.harga_customer.toString());
              }
            });
        }
      }, [kodeProduk, options, token]);
      // Jika User sudah memilih barang keluarkan data barang itu dari option list

      // jika user mengetik qty, maka kalikan dengan harga barang itu
      useEffect(() => {
        if (qty && harga && diskon) {
          const persen = parseInt(diskon) / 100;
          const total =
            (Number(harga) - Number(harga) * persen) * parseInt(qty);
          setTotal(total.toString());
        }
      }, [qty, harga, diskon]);

      // Format Rupiah pada saat penginputan
      function formatRupiah(value: string | number) {
        const numberString = value.toString().replace(/\D/g, "");
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      // Fungsi untuk menyimpan data ke data sementara
      const handleAddItem = () => {
        if (kodeProduk && qty && diskon && harga && total) {
          const newItem: PembelianTunai = {
            kode_produk: kodeProduk,
            qty: parseInt(qty),
            diskon: parseInt(diskon),
          };
          //   Menyimpan data ke data sementara
          setDataPembelian((prevData) => ({
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
            <label>Cari Barang</label>
            <SearchableSelect
              onChange={(e) => setKodeProduk(e)}
              options={options}
              className="mt-1"
              placeholder="Pilih Barang"
            />
          </div>
          <div className="mb-5 text-left">
            <label>Jumlah</label>
            <Input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="mb-5 text-left">
            <label>Diskon</label>
            <div className="flex items-center gap-x-2">
              <Input
                value={diskon}
                type="number"
                onChange={(e) => setDiskon(e.target.value)}
                className="mt-1"
              />
              <span className="text-2xl">%</span>
            </div>
          </div>
          <div className="mb-5 text-left">
            <label>Harga Barang</label>
            <Input value={formatRupiah(harga)} className="mt-1" disabled />
          </div>
          <div className="mb-5 text-left">
            <label>Total Harga</label>
            <Input value={formatRupiah(total)} className="mt-1" disabled />
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
      title: "Tambah Barang",
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
        title: "Barang berhasil ditambahkan",
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
      title: "Anda yakin ingin menghapus Barang ini?",
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
        const updatedItems = [...dataPembelian.items];
        updatedItems.splice(index, 1);
        // hapus data sementara
        setDataPembelian((prevData) => ({
          ...prevData,
          items: updatedItems,
        }));
        Swal.fire("Deleted!", "Barang berhasil dihapus.", "success");
      }
    });
  };

  // jika supplier dan barang sudah di tentukan maka data bisa langsung disimpan ke fetch api
  const handleSave = () => {
    // apakah data sudah lengkap
    const data = dataPembelian;
    if (data.items.length !== 0) {
      console.log("perlihatkan Data: ", data);
      const token = localStorage.getItem("token");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pembelian-tunai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
        .then(async (res) => {
          // Periksa apakah respons berhasil (status 2xx)
          if (res.ok) {
            // Jika berhasil, tampilkan notifikasi sukses
            Swal.fire({
              icon: "success",
              title: "Transaksi berhasil disimpan",
              background: "#23272a",
              color: "#fff",
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              window.location.reload();
            });
            return;
          }

          // Jika respons gagal (status 400, 500, dll.), baca body-nya
          const errorData = await res.json();

          // Tampilkan pesan error dari server
          Swal.fire({
            icon: "error",
            title: "Terjadi Kesalahan",
            text: errorData.message || "Gagal menyimpan data.",
            background: "#23272a",
            color: "#fff",
            showConfirmButton: true,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      Swal.fire({
        icon: "error",
        title: "Barang belum lengkap",
        background: "#23272a",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  //   tangkap total harga dari beberapa data yang sudah masuk
  useEffect(() => {
    const totalHarga = dataPembelian.items.reduce(
      (total, items) =>
        total +
        items.qty *
          ((produk.find((item) => item.kode_produk === items.kode_produk)
            ?.harga_customer as number) -
            (produk.find((item) => item.kode_produk === items.kode_produk)
              ?.harga_customer as number) *
              (items.diskon / 100)),
      0,
    );
    setTotalHarga(totalHarga);
  }, [dataPembelian.items, produk]);

  //   masukkan total bayar dan kembalian
  useEffect(() => {
    if (totalBayar && totalHarga) {
      const kembalian = Number(totalBayar) - totalHarga;
      console.log("kembalian:", kembalian);
      if (kembalian > 0) {
        setTotalKembalian(kembalian);
      } else {
        setTotalKembalian(0);
      }
    }
  }, [totalHarga, totalBayar]);
  return (
    <div className="flex flex-col">
      <div className="mb-5 flex justify-between gap-x-5">
        <Button onClick={handleCreate}>Tambah Barang +</Button>
        <div className="flex items-center gap-x-2 text-gray-400">
          <label className="text-lg">Tanggal</label>
          <div className="rounded-sm border border-white/[0.03] bg-white/[0.03] px-3 text-lg">
            {dataPembelian.tanggal}
          </div>
        </div>
      </div>
      <div className="mb-5 flex justify-end gap-x-10 rounded-sm border border-white/[0.03] bg-white/[0.03] px-5 py-5 text-5xl text-gray-400">
        <span>Total :</span>
        <div>Rp. {formatRupiah(String(totalHarga))}</div>
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
                    Harga
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
                    Diskon
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Sub. Total
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
                dataPembelian.items.length === 0 ? (
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
                    {dataPembelian.items.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          {order.kode_produk}
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          {
                            produk.find(
                              (item) => item.kode_produk === order.kode_produk,
                            )?.nama_produk
                          }
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          Rp.{" "}
                          {formatRupiah(
                            String(
                              produk.find(
                                (item) =>
                                  item.kode_produk === order.kode_produk,
                              )?.harga_customer as number,
                            ),
                          )}
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          {order.qty}
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          {order.diskon}%
                        </TableCell>
                        <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                          Rp.{" "}
                          {formatRupiah(
                            String(
                              //   disini jumlahkan total harga dari seluruh data
                              order.qty *
                                ((produk.find(
                                  (item) =>
                                    item.kode_produk === order.kode_produk,
                                )?.harga_customer as number) -
                                  (produk.find(
                                    (item) =>
                                      item.kode_produk === order.kode_produk,
                                  )?.harga_customer as number) *
                                    (order.diskon / 100)),
                            ),
                          )}
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
      <div className="mt-5 flex items-center justify-end">
        <div className="flex w-[550px] flex-col gap-y-5 text-gray-400">
          <div className="flex w-full items-center justify-between gap-x-3 text-xl">
            <p>Total Belanja</p>
            <div className="flex items-center gap-x-2">
              <span>Rp.</span>
              <input
                value={formatRupiah(totalHarga)}
                disabled
                className="rounded-sm border border-white/[0.10] bg-white/[0.03] px-3 py-2"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-x-3 text-xl">
            <p>Total Bayar</p>
            <div className="flex items-center gap-x-2">
              <span>Rp.</span>
              <input
                value={formatRupiah(totalBayar)}
                onChange={(e) =>
                  setTotalBayar(e.target.value.replace(/\D/g, ""))
                }
                className="active:border-brand-500 focus:border-brand-500 dark:focus:border-brand-500 rounded-sm border border-white/[0.10] bg-white/[0.03] px-3 py-2 focus:outline-none dark:border-white/[0.10] dark:bg-white/[0.03]"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-x-3 text-xl">
            <p>Total Pengembalian</p>
            <div className="flex items-center gap-x-2">
              <span>Rp.</span>
              <input
                value={formatRupiah(totalKembalian)}
                disabled
                className="rounded-sm border border-white/[0.10] bg-white/[0.03] px-3 py-2"
              />
            </div>
          </div>
          <Button
            className="w-[53%] self-end hover:bg-green-500"
            onClick={() => {
              // apakah user yakin ingin menyimpan data
              Swal.fire({
                title: "Yakin Transaksi sudah benar?",
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
            Simpan Transaksi
          </Button>
        </div>
      </div>
    </div>
  );
}
