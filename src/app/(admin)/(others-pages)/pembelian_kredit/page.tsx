"use client";
import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/button/Button";
import SearchableSelect from "@/components/form/SearchableSelect";
import DataPembelianKredit from "@/components/tables/DataPembelianKredit";
import Link from "next/link";
import clsx from "clsx";
import Swal from "sweetalert2";

export default function PembelianKredit() {
  const [tanggal, setTanggal] = useState("");
  const [kodeCustomer, setkodeCustomer] = useState("");
  const [namaCustomer, setNamaCustomer] = useState("");
  const [saldo_hutang, setSaldoHutang] = useState("");
  const [termin, setTermin] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState("");
  const [options, setOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  // list data yang akan terkirim di file dataPembelian
  const [tanggalFix, setTanggalFix] = useState("");
  const [kodeCustomerFix, setKodeCustomerFix] = useState("");
  const [namaCustomerFix, setNamaCustomerFix] = useState("");
  const [terminFix, setTerminFix] = useState("");
  const [jatuhTempoFix, setJatuhTempoFix] = useState("");

  const formatRupiah = (value: string | number) => {
    const numberString = value.toString().replace(/\D/g, "");
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // const simpan semua data ke array dan kirim ke dataPembelian

  // handle simpan data ke array
  const handleClick = () => {
    if (!tanggal || !kodeCustomer || !namaCustomer) {
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
      setKodeCustomerFix(kodeCustomer);
      setNamaCustomerFix(namaCustomer);
      setTerminFix(termin);
      setJatuhTempoFix(jatuhTempo);

      // hilangkan formPembelian jika sudah menginput
      const formPembelian = document.getElementById("formPembelian");
      if (formPembelian) {
        formPembelian.style.display = "none";
      }
    }, 300);
  };

  // fetch supplier
  useEffect(() => {
    // Fetch jenis options from API
    const fetchCustomerOptions = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/customer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        const formattedOptions = data.map(
          (item: { kode_customer: string; nama_customer: string }) => ({
            value: item.kode_customer,
            label: item.nama_customer,
          }),
        );
        setOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching Customer options:", error);
      }
    };
    fetchCustomerOptions();
  }, []);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setTanggal(formatted);
    setJatuhTempo(formatted);
  }, []);

  // jika customer sudah di pilih get nama customer dan saldo hutangnya
  useEffect(() => {
    const customer = options.find((item) => item.value === kodeCustomer);
    if (customer) {
      setNamaCustomer(customer.label);
      const token = localStorage.getItem("token");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const customer = data.find(
            (item: { kode_customer: string }) =>
              item.kode_customer === kodeCustomer,
          );
          if (customer) {
            setSaldoHutang(customer.saldo_hutang);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [kodeCustomer, options]);

  // tanggal jatuh tempo bertambah harinya sesuai jumlah termin
  useEffect(() => {
    if (termin !== "") {
      const now = new Date(tanggal);
      now.setDate(now.getDate() + parseInt(termin));
      const formatted = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      setJatuhTempo(formatted);
    } else {
      setJatuhTempo(tanggal);
    }
  }, [termin, tanggal]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Penjualan Kredit Barang" />
      <ComponentCard title="Input Pembelian" className="mb-5">
        <form className="space-y-6" id="formPembelian">
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
              <Label>Customer</Label>
              <SearchableSelect
                options={options}
                placeholder="Pilih Supplier"
                onChange={(e) => {
                  setkodeCustomer(e);
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
            <div className={"w-[49%]"}>
              <Label>Termin</Label>
              <Input
                type="number"
                defaultValue={termin}
                onChange={(e) => {
                  setTermin(e.target.value);
                }}
              ></Input>
            </div>
            <div className={clsx("pointer-events-none w-[49%]")}>
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
      <ComponentCard title="Tabel Data Pembelian">
        <DataPembelianKredit
          tanggal={tanggalFix}
          kodeCustomer={kodeCustomerFix}
          namaCustomer={namaCustomerFix}
          termin={Number(terminFix)}
          tgl_jth_tempo={jatuhTempoFix}
        />
      </ComponentCard>
      <ComponentCard title="More Options" className="mt-5">
        <div className="flex gap-x-5">
          <Link href={"/pembelian/ReturPembelian"}>
            <Button size="md">Retur Pembelian</Button>
          </Link>
          <Link href={"/pembelian/DaftarHutang"}>
            <Button size="md">Daftar Hutang</Button>
          </Link>
          <Link href={"/pembelian/DaftarHutang"}>
            <Button size="md">Pembayaran Hutang</Button>
          </Link>
          <Link href={"/pembelian/DaftarHutang"}>
            <Button size="md">Laporan Pembelian</Button>
          </Link>
        </div>
      </ComponentCard>
    </div>
  );
}
