"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import clsx from "clsx";
import { PencilIcon, CloseLineIcon } from "@/icons";
import Swal from "sweetalert2";

interface Order {
  id: number;
  kode_kategori: string;
  nama_kategori: string;
}

// Define the table data using the interface
// const tableData: Order[] = [
//   {
//     id: 1,
//     kd_jenis: "00001",
//     ket: "RAKET BADMINTON",
//   },
//   {
//     id: 2,
//     kd_jenis: "00002",
//     ket: "RAKET TENIS",
//   },
//   {
//     id: 3,
//     kd_jenis: "00003",
//     ket: "PIALA",
//   },
//   {
//     id: 4,
//     kd_jenis: "00004",
//     ket: "SEPATU + SANDAL",
//   },
// ];

export default function DataJenis() {
  const [data, setData] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data from API
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kategori`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }) // endpoint dari Laravel
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error(err));
  }, []);

  // --- Pagination logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleEdit = async (order: Order) => {
    const { value: ket } = await Swal.fire({
      background: "#23272a", // warna gelap
      color: "#fff", // teks putih
      title: "Edit Keterangan",
      input: "text",
      inputLabel: "Keterangan",
      inputValue: order.nama_kategori,
      inputPlaceholder: "Masukkan Keterangan",
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value) {
          return "Keterangan tidak boleh kosong!";
        }
        return null;
      },
    });

    if (ket) {
      const token = localStorage.getItem("token");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kategori/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama_kategori: ket }),
      })
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            // Jika update berhasil, refresh data
            setData((prevData) =>
              prevData.map((item) =>
                item.id === order.id ? { ...item, nama_kategori: ket } : item,
              ),
            );
            Swal.fire("Tersimpan!", "Data berhasil diperbarui.", "success");
          } else {
            Swal.fire(
              "Gagal!",
              "Terjadi kesalahan saat memperbarui data.",
              "error",
            );
          }
        })
        .catch((error) => {
          console.error("Error updating data:", error);
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat memperbarui data.",
            "error",
          );
        });
    }
  };

  return (
    <div className="flex flex-col">
      {/* <div className="mb-5 flex justify-between">
        <div className="flex gap-x-2">
          <Input placeholder="Cari Data" className="w-[40%]"></Input>
          <Button size="sm">Cari</Button>
        </div>
      </div> */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div>
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
                    Kode
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
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.kode_kategori}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      {order.nama_kategori}
                    </TableCell>
                    <TableCell className="text-theme-sm px-4 py-3 text-start text-gray-500 dark:text-gray-400">
                      <div className="flex">
                        <button onClick={() => handleEdit(order)}>
                          <PencilIcon />
                        </button>
                        <span className="mr-[6px] ml-[3px] border border-gray-500"></span>
                        <button
                          className={"cursor-pointer text-red-800"}
                          onClick={() => {
                            Swal.fire({
                              title: `Apakah Anda yakin Ingin Menghapus ${order.nama_kategori}?`,
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
                                  `${process.env.NEXT_PUBLIC_API_URL}/api/kategori/${order.id}`,
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
