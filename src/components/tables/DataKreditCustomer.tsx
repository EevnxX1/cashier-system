"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { InfoIcon, PencilIcon, FileIcon } from "@/icons";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import clsx from "clsx";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";

const MySwal = withReactContent(Swal);

interface Order {
  id: number;
  kode_pembelian: string;
  tanggal: string;
  termin: string;
  tempo: string;
  total_harga: string;
  customer: {
    nama_customer: string;
    kode_customer: string;
    saldo_hutang: number;
  };
  items: {
    id: number;
    qty: number;
    subtotal: number;
    produk: {
      kode_produk: string;
      nama_produk: string;
      satuan: string;
      harga_customer: number;
    };
  }[];
}

// modal detail barang yang di beli ke supplier
const handleProduk = (order: Order) => {
  console.log("data = ", order);

  MySwal.fire({
    background: "#23272a",
    color: "#fff",
    backdrop: "rgba(0, 0, 0, 0.5)",
    theme: "dark",
    html: (
      <div className="flex w-full flex-col">
        <div className="mb-5 flex flex-col items-start gap-y-1">
          <h1 className="text-3xl">Detail Penjualan Kredit</h1>
          <p>Informasi detail produk dibeli Customer</p>
        </div>
        {order.items.map((item) => (
          <section
            key={item.id}
            className="mb-5 flex w-full flex-col gap-y-1 rounded-2xl bg-black/50 p-5"
          >
            <div className="mb-5 flex border-b border-b-gray-600 py-4">
              <h1 className="text-2xl">{item.produk.nama_produk}</h1>
            </div>
            <div className="mb-3 flex w-full items-center justify-between">
              <h2>Kode Produk</h2>
              <p>{item.produk.kode_produk}</p>
            </div>
            <div className="mb-3 flex w-full items-center justify-between">
              <h2>Nama Produk</h2>
              <p>{item.produk.nama_produk}</p>
            </div>
            <div className="mb-3 flex w-full items-center justify-between">
              <h2>Satuan</h2>
              <p>{item.produk.satuan}</p>
            </div>
            <div className="mb-3 flex w-full items-center justify-between">
              <h2>Qty</h2>
              <p>{item.qty}</p>
            </div>
          </section>
        ))}
      </div>
    ),
    showCloseButton: true,
  });
};

// modal detail barang yang di beli ke supplier

// modal detail hutang yang sudah dibayar
const handleDetail = (order: Order) => {
  // format rupiah
  function formatRupiah(value: string | number) {
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  //   fetch data pembayaran untuk menangkap pembayaran-hutang-customer
  const fetchPembayaran = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/pembayaran-hutang-customer`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    const data = await res.json();
    return data;
  };

  //   filter data pembayaran sesuai dengan kode_pembayaran
  const dataPembayaran = fetchPembayaran().then((data) => {
    return data.filter(
      (item: { kode_pembelian: string }) =>
        item.kode_pembelian === order.kode_pembelian,
    );
  });

  console.log("data = ", order);

  MySwal.fire({
    background: "#23272a",
    color: "#fff",
    backdrop: "rgba(0, 0, 0, 0.5)",
    theme: "dark",
    html: (
      <div className="flex w-full flex-col">
        <div className="mb-5 flex flex-col items-start gap-y-1">
          <h1 className="mb-2 text-3xl">Detail Pembayaran Hutang</h1>
          <p className="text-left">
            Informasi detail Pembayaran Hutang yang sudah dibayar
          </p>
        </div>
        {dataPembayaran.then((data) => {
          return data.map(
            (item: {
              id: number;
              tanggal: string;
              jumlah_bayar: number;
              kode_pembayaran: string;
            }) => (
              <section
                key={item.id}
                className="mb-5 flex w-full flex-col gap-y-1 rounded-2xl bg-black/50 p-5"
              >
                <div className="mb-5 flex border-b border-b-gray-600 py-4">
                  <h1 className="text-2xl">{item.kode_pembayaran}</h1>
                </div>
                <div className="mb-3 flex w-full items-center justify-between">
                  <h2>Tanggal Pembayaran</h2>
                  <p>{item.tanggal}</p>
                </div>
                <div className="mb-3 flex w-full items-center justify-between">
                  <h2>Jumlah Pembayaran</h2>
                  <p>Rp. {formatRupiah(String(item.jumlah_bayar))}</p>
                </div>
              </section>
            ),
          );
        })}
      </div>
    ),
    showCloseButton: true,
  });
};
// modal detail barang yang di beli ke supplier

// handleCreate
const handleBayar = async (order: Order) => {
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
    const [tanggal, setTanggal] = useState("");
    const [via, setVia] = useState("");
    const [jumlahBayar, setJumlahBayar] = useState("");
    const [bank, setBank] = useState("");
    const [nomorRekening, setNomorRekening] = useState("");
    const [nomorGiro, setNomorGiro] = useState("");
    const [giroTempo, setGiroTempo] = useState("");
    const [dataPembayaran, setDataPembayaran] = useState<
      {
        kode_pembelian: string;
        jumlah_bayar: number;
      }[]
    >([]);
    // ... tambahkan field lainnya

    const options = [
      { value: "Transfer", label: "Transfer" },
      { value: "Giro", label: "Giro" },
      { value: "Tunai", label: "Tunai" },
      { value: "Retur", label: "Retur" },
      { value: "Pajak", label: "Pajak" },
      { value: "Disc", label: "Disc" },
    ];

    // Format Rupiah pada saat penginputan

    function formatRupiah(value: string | number) {
      const numberString = value.toString().replace(/\D/g, "");
      return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // atur tanggal untuk sekarang
    useEffect(() => {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      setTanggal(formattedDate);
    }, []);

    // fetch data pembayaran hutang customer
    useEffect(() => {
      const token = localStorage.getItem("token");
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pembayaran-hutang-customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then((res) => res.json())
        .then(setDataPembayaran)
        .catch((err) => console.error(err));
    }, []);

    // Return JSX form create yang akan muncul di modal
    return (
      <div>
        <div className="mb-5 flex flex-col gap-y-1 text-left">
          <label>Tanggal</label>
          <DatePicker
            id="tanggal"
            placeholder="Pilih Tanggal"
            defaultDate={tanggal}
            onChange={(dates, currentDateString) => {
              // Handle your logic
              console.log({ dates, currentDateString });
              setTanggal(currentDateString);
            }}
          />
        </div>
        <div className="mb-5 text-left">
          <label>Nama Customer</label>
          <Input
            value={
              order.customer == null
                ? "Customer Tidak Ditemukan"
                : order.customer.nama_customer
            }
            className="mt-1"
            disabled
          />
        </div>
        <div className="mb-5 text-left">
          <label>Kode Pembelian</label>
          <Input value={order.kode_pembelian} className="mt-1" disabled />
        </div>
        <div className="mb-5 text-left">
          <label>SIsa Hutang</label>
          <Input
            value={formatRupiah(
              Number(order.total_harga) -
                (dataPembayaran.reduce((total, pembayaran) => {
                  if (pembayaran.kode_pembelian === order.kode_pembelian) {
                    return total + pembayaran.jumlah_bayar;
                  }
                  return total;
                }, 0) || 0),
            )}
            className="mt-1"
            disabled
          />
        </div>
        <div className="mb-5 flex flex-col gap-y-1 text-left">
          <label>Pembayaran Via</label>
          <Select
            options={options}
            placeholder="Pilih Via Pembayaran"
            onChange={(e) => {
              setVia(e);
            }}
            className="dark:bg-dark-900"
          />
        </div>
        <div
          className={clsx("mb-5 text-left", {
            block: via === "Giro",
            hidden: via !== "Giro",
          })}
        >
          <label>Bank</label>
          <Input
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="mt-1"
          />
        </div>
        <div
          className={clsx("mb-5 text-left", {
            block: via === "Giro",
            hidden: via !== "Giro",
          })}
        >
          <label>Nomor Rekening</label>
          <Input
            value={nomorRekening}
            onChange={(e) => setNomorRekening(e.target.value)}
            className="mt-1"
          />
        </div>
        <div
          className={clsx("mb-5 text-left", {
            block: via === "Giro",
            hidden: via !== "Giro",
          })}
        >
          <label>Nomor Giro</label>
          <Input
            value={nomorGiro}
            onChange={(e) => setNomorGiro(e.target.value)}
            className="mt-1"
          />
        </div>
        <div
          className={clsx("mb-5 flex-col gap-y-1 text-left", {
            flex: via === "Giro",
            hidden: via !== "Giro",
          })}
        >
          <label>Giro Tempo</label>
          <DatePicker
            id="giroTempo"
            placeholder="Pilih Tanggal"
            defaultDate={giroTempo}
            onChange={(dates, currentDateString) => {
              // Handle your logic
              console.log({ dates, currentDateString });
              setGiroTempo(currentDateString);
            }}
          />
        </div>
        <div className="mb-5 text-left">
          <label>Jumlah Bayar</label>
          <Input
            value={formatRupiah(jumlahBayar)}
            onChange={(e) => setJumlahBayar(e.target.value.replace(/\D/g, ""))}
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
              if (!tanggal || !via || !jumlahBayar) {
                Swal.showValidationMessage("Semua field wajib diisi!");
                return;
              }
              console.log("kode_customer", order.customer.kode_customer);
              console.log("tanggal", tanggal);
              console.log("kode_pembelian", order.kode_pembelian);
              console.log("via_pembayaran", via);
              console.log("jumlah_bayar", jumlahBayar);
              console.log("bank", bank);
              console.log("nomor_rekening", nomorRekening);
              console.log("nomor_giro", nomorGiro);
              console.log("giro_tempo", giroTempo);
              // Kirim create ke API
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/pembayaran-hutang-customer`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    kode_customer: order.customer.kode_customer,
                    tanggal: tanggal,
                    kode_pembelian: order.kode_pembelian,
                    via: via,
                    jumlah_bayar: jumlahBayar,
                    bank: bank,
                    nomor_rekening: nomorRekening,
                    nomor_giro: nomorGiro,
                    giro_tempo: giroTempo,
                    // ... tambahkan field lainnya
                  }),
                },
              );
              // Jika create berhasil, resolve promise dan tutup modal
              if (res.ok) {
                resolvePromise(true);
                Swal.close();
              } else {
                Swal.showValidationMessage("Gagal Melakaukan Pembayaran");
              }
            }}
          >
            Bayar Hutang
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
    title: "Pembayaran Hutang Customer",
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
      title: "Pembayaran Hutang Customer Berhasil Dilakukan",
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

export default function DataKreditCustomer() {
  const [data, setData] = useState<Order[]>([]);
  const [dataPembayaran, setDataPembayaran] = useState<
    {
      id: number;
      kode_pembelian: string;
      jumlah_bayar: number;
    }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //   fetch data pembayaran untuk menangkap pembayaran-hutang-customer
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pembayaran-hutang-customer`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(setDataPembayaran)
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // fetch data pembelian dari customer
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pembelian-kredit`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(setData)
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Format Rupiah function
  function formatRupiah(value: string | number) {
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  // Format Rupiah function

  // --- Pagination logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  // --- Pagination logic ---

  console.log(dataPembayaran);
  return (
    <div className="flex flex-col">
      <div className="mb-5 flex justify-between">
        <div className="flex gap-x-2">
          <Input placeholder="Cari Data" className="w-[40%]"></Input>
          <Button size="sm">Cari</Button>
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
                    Kode Pembelian
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Customer
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Termin
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Tempo
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Total Hutang
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    Status
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
                {currentItems.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.kode_pembelian}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.customer == null
                        ? "Customer Tidak Ditemukan"
                        : order.customer.nama_customer}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.tanggal}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.tempo === null ? "-" : order.tempo}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      Rp. {formatRupiah(order.total_harga)}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {Number(order.total_harga) -
                        (dataPembayaran.reduce((total, pembayaran) => {
                          if (
                            pembayaran.kode_pembelian === order.kode_pembelian
                          ) {
                            return total + pembayaran.jumlah_bayar;
                          }
                          return total;
                        }, 0) || 0) >
                      0 ? (
                        <Badge color="error" size="sm" variant="solid">
                          Belum Lunas
                        </Badge>
                      ) : (
                        <Badge color="success" size="sm" variant="solid">
                          Lunas
                        </Badge>
                      )}
                    </TableCell>
                    {Number(order.total_harga) -
                      (dataPembayaran.reduce((total, pembayaran) => {
                        if (
                          pembayaran.kode_pembelian === order.kode_pembelian
                        ) {
                          return total + pembayaran.jumlah_bayar;
                        }
                        return total;
                      }, 0) || 0) >
                    0 ? (
                      <div className="mt-2 flex">
                        <button
                          title="Detail Produk"
                          className={
                            "text-brand-500 scale-[85%] cursor-pointer"
                          }
                          onClick={() => handleProduk(order)}
                        >
                          <InfoIcon />
                        </button>
                        <span className="mr-[4px] ml-[3px] border border-gray-500"></span>
                        <button
                          title="Detail Pembayaran"
                          className={
                            "text-brand-500 scale-[85%] cursor-pointer"
                          }
                          onClick={() => handleDetail(order)}
                        >
                          <FileIcon />
                        </button>
                        <span className="mr-[4px] ml-[3px] border border-gray-500"></span>
                        <button
                          className="text-white"
                          title="Pembayaran Hutang Customer"
                          onClick={() => handleBayar(order)}
                        >
                          <PencilIcon />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 flex">
                        <button
                          title="Detail Produk"
                          className={
                            "text-brand-500 scale-[85%] cursor-pointer"
                          }
                          onClick={() => handleProduk(order)}
                        >
                          <InfoIcon />
                        </button>
                        <span className="mr-[4px] ml-[3px] border border-gray-500"></span>
                        <button
                          title="Detail Pembayaran"
                          className={
                            "text-brand-500 scale-[85%] cursor-pointer"
                          }
                          onClick={() => handleDetail(order)}
                        >
                          <FileIcon />
                        </button>
                      </div>
                    )}
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
