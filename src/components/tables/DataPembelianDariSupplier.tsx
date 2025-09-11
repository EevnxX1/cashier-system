"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import { InfoIcon } from "@/icons";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import clsx from "clsx";
import ComponentCard from "../common/ComponentCard";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "path";

const MySwal = withReactContent(Swal);

interface Order {
  id: number;
  kode_supplier: string;
  kode_pembelian: string;
  tanggal: string;
  termin: string;
  tempo: string;
  total_harga: string;
  items: {
    id: number;
    qty: number;
    subtotal: number;
    produk: {
      kode_produk: string;
      nama_produk: string;
      satuan: string;
      harga_suplier: number;
    };
  }[];
}

// modal detail barang yang di beli ke supplier
const handleDetail = (order: Order) => {
  // format rupiah
  function formatRupiah(value: string | number) {
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  console.log("data = ", order);

  MySwal.fire({
    background: "#23272a",
    color: "#fff",
    backdrop: "rgba(0, 0, 0, 0.5)",
    theme: "dark",
    html: (
      <div className="flex w-full flex-col">
        <div className="mb-5 flex flex-col items-start gap-y-1">
          <h1 className="text-3xl">Detail Pembelian</h1>
          <p>Informasi detail produk dibeli dari supplier</p>
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
              <h2>Harga Per Satuan</h2>
              <p>Rp. {formatRupiah(String(item.produk.harga_suplier))}</p>
            </div>
            <div className="mb-3 flex w-full items-center justify-between">
              <h2>Qty</h2>
              <p>{item.qty}</p>
            </div>
            <div className="mb-3 flex w-full items-center justify-between">
              <h2>Subtotal</h2>
              <p>Rp. {formatRupiah(String(item.subtotal))}</p>
            </div>

            {/* <p>Nama Produk: {item.produk.nama_produk}</p>
            <p>Kode Produk: {item.produk.kode_produk}</p>
            <p>Qty: {item.qty}</p>
            <p>Subtotal: {item.subtotal}</p> */}
          </section>
        ))}
      </div>
    ),
    showCloseButton: true,
  });
};
// modal detail barang yang di beli ke supplier

export default function DataHistoriPembelian({
  kode_supplier,
}: {
  kode_supplier: string;
}) {
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

  //   fetch data pembayaran untuk menangkap pembayaran
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pembayaran-hutang`, {
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

  // fetch data pembelian dari supplier
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pembelian-supplier`, {
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

  //   filter data pembelian berdasarkan kode supplier
  const filteredData = data.filter(
    (item) => item.kode_supplier === kode_supplier,
  );
  //   filter data pembelian berdasarkan kode supplier

  // --- Pagination logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // --- Pagination logic ---

  console.log(dataPembayaran);
  return (
    <div className="flex flex-col">
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
                    Tanggal
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
                    Total Harga
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
                      {order.tanggal}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.termin === null ? "Cash" : order.termin}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.tempo === null ? "-" : order.tempo}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      Rp. {formatRupiah(order.total_harga)}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.termin === null ? (
                        <Badge color="success" size="sm" variant="solid">
                          Lunas
                        </Badge>
                      ) : dataPembayaran.find(
                          (pembayaran) =>
                            pembayaran.kode_pembelian === order.kode_pembelian,
                        ) ? (
                        <div>
                          {Number(order.total_harga) -
                            (dataPembayaran.find(
                              (pembayaran) =>
                                pembayaran.kode_pembelian ===
                                order.kode_pembelian,
                            )?.jumlah_bayar || 0) >
                          0 ? (
                            <Badge color="error" size="sm" variant="solid">
                              Belum Lunas
                            </Badge>
                          ) : (
                            <Badge color="success" size="sm" variant="solid">
                              Lunas
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Badge color="error" size="sm" variant="solid">
                          Belum Lunas
                        </Badge>
                      )}
                    </TableCell>
                    <div className="mt-3 pl-6">
                      <button
                        className={"text-brand-500 scale-[85%] cursor-pointer"}
                        onClick={() => handleDetail(order)}
                      >
                        <InfoIcon />
                      </button>
                    </div>
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
