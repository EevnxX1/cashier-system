"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import SearchableSelect from "@/components/form/SearchableSelect";
import DataPembelian from "@/components/tables/DataPembelian";
import Link from "next/link";
import Select from "@/components/form/Select";
import clsx from "clsx";
import Swal from "sweetalert2";

export default function Pembelian() {
  const [tanggal, setTanggal] = useState("");
  const [kodeSupplier, setkodeSupplier] = useState("");
  const [nama_supplier, setNamaSupplier] = useState("");
  const [saldo_hutang, setSaldoHutang] = useState("");
  const [selectedKet, setSelectedKet] = useState("");
  const [termin, setTermin] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState("");
  const [options, setOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const options2 = [
    { value: "Kredit", label: "Kredit" },
    { value: "Cash", label: "Cash" },
  ];

  // list data yang akan terkirim di file dataPembelian
  const [tanggalFix, setTanggalFix] = useState("");
  const [kodeSupplierFix, setKodeSupplierFix] = useState("");
  const [namaSupplierFix, setNamaSupplierFix] = useState("");
  const [selectedKetFix, setSelectedKetFix] = useState("");
  const [terminFix, setTerminFix] = useState("");
  const [jatuhTempoFix, setJatuhTempoFix] = useState("");

  const formatRupiah = (value: string | number) => {
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // const simpan semua data ke array dan kirim ke dataPembelian

  // handle simpan data ke array
  const handleClick = () => {
    if (!tanggal || !kodeSupplier || !nama_supplier || !selectedKet) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data belum lengkap!",
      });
      return;
    }
    // simpan data ke halaman dataPembelian
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Pembelian Berhasil Ditambahkan",
      background: "#23272a", // warna gelap
      color: "#fff", // teks putih
    });
    setTimeout(() => {
      setTanggalFix(tanggal);
      setKodeSupplierFix(kodeSupplier);
      setNamaSupplierFix(nama_supplier);
      setSelectedKetFix(selectedKet);
      setTerminFix(termin);
      setJatuhTempoFix(jatuhTempo);
    }, 300);
  };

  // fetch supplier
  useEffect(() => {
    // Fetch jenis options from API
    const fetchSupplierOptions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/supplier`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        const formattedOptions = data.map(
          (item: { kode_supplier: string; nama_supplier: string }) => ({
            value: item.kode_supplier,
            label: item.nama_supplier,
          }),
        );
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching Supplier options:", error);
      }
    };
    fetchSupplierOptions();
  }, []);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setTanggal(formatted);
    setJatuhTempo(formatted);
  }, []);

  // jika supplier sudah di pilih get nama supplier dan saldo hutangnya
  useEffect(() => {
    const supplier = options.find((item) => item.value === kodeSupplier);
    if (supplier) {
      setNamaSupplier(supplier.label);
      const token = localStorage.getItem("token");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/supplier`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const supplier = data.find(
            (item: { kode_supplier: string }) =>
              item.kode_supplier === kodeSupplier,
          );
          if (supplier) {
            setSaldoHutang(supplier.saldo_hutang);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [kodeSupplier, options]);

  useEffect(() => {
    if (selectedKet === "Cash") {
      setTermin("");
      setJatuhTempo("");
    }
  }, [selectedKet]);

  // tanggal jatuh tempo bertambah harinya sesuai jumlah termin
  useEffect(() => {
    if (termin !== "") {
      const now = new Date();
      now.setDate(now.getDate() + parseInt(termin));
      const formatted = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      setJatuhTempo(formatted);
    } else {
      setJatuhTempo(tanggal);
    }
  }, [termin, tanggal]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Pembelian Barang" />
      <ComponentCard
        title="Input Pembelian"
        className={clsx("mb-5", {
          hidden: tanggalFix && kodeSupplierFix && selectedKetFix,
          block: !tanggalFix && !kodeSupplierFix && !selectedKetFix,
        })}
      >
        <form className="space-y-6">
          <div className=" ">
            <DatePicker
              id="tanggal"
              label="Tanggal"
              placeholder="Select a date"
              defaultDate={tanggal}
              onChange={(dates, currentDateString) => {
                // Handle your logic
                console.log({ dates, currentDateString });
                setTanggal(currentDateString);
              }}
            />
          </div>
          <div className="flex justify-between">
            <div className="w-[70%]">
              <Label>Supplier</Label>
              <SearchableSelect
                options={options}
                placeholder="Pilih Supplier"
                onChange={(e) => {
                  setkodeSupplier(e);
                }}
                className="dark:bg-dark-900"
              />
            </div>
            <div className="w-[28%]">
              <Label>Saldo Hutang</Label>
              <Input defaultValue={formatRupiah(saldo_hutang)} disabled></Input>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-[23%]">
              <Label>Ket Pembelian</Label>
              <Select
                options={options2}
                placeholder="Pilih Ket Pembelian"
                onChange={(e) => {
                  setSelectedKet(e);
                }}
                className="dark:bg-dark-900"
              />
            </div>
            <div
              className={clsx("invisible w-[23%]", {
                visible: selectedKet === "Kredit",
              })}
            >
              <Label>Termin</Label>
              <Input
                type="number"
                defaultValue={termin}
                onChange={(e) => {
                  setTermin(e.target.value);
                }}
              ></Input>
            </div>
            <div
              className={clsx("pointer-events-none invisible w-[50%]", {
                visible: selectedKet === "Kredit",
              })}
            >
              <DatePicker
                id="jatuhTempo"
                label="Tanggal Jatuh Tempo"
                placeholder="Select a date"
                defaultDate={jatuhTempo}
                onChange={(dates, currentDateString) => {
                  // Handle your logic
                  console.log({ dates, currentDateString });
                  setJatuhTempo(currentDateString);
                }}
              />
            </div>
          </div>
          <div>
            <Button
              size="md"
              variant="primary"
              onClick={handleClick}
              type="button"
            >
              Tambah Pembelian
            </Button>
          </div>
        </form>
      </ComponentCard>
      <ComponentCard
        title="Tabel Data Pembelian"
        className={clsx({
          block: tanggalFix && kodeSupplierFix && selectedKetFix,
          hidden: !tanggalFix && !kodeSupplierFix && !selectedKetFix,
        })}
      >
        <DataPembelian
          tanggal={tanggalFix}
          kodeSupplier={kodeSupplierFix}
          namaSupplier={namaSupplierFix}
          ket={selectedKetFix}
          termin={terminFix}
          tgl_jth_tempo={jatuhTempoFix}
        />
      </ComponentCard>
      <ComponentCard title="More Options" className="mt-5">
        <div className="flex gap-x-5">
          <Link href={"/pembelian/laporan"}>
            <Button size="md">Daftar Pembelian Supplier</Button>
          </Link>
          <Link href={"/pembelian/ReturPembelian"}>
            <Button size="md">Retur Pembelian</Button>
          </Link>
        </div>
      </ComponentCard>
    </div>
  );
}
