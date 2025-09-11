"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon } from "@/icons";
import Select from "@/components/form/Select";
import SearchableSelect from "@/components/form/SearchableSelect";
import Switch from "@/components/form/switch/Switch";

const handleSwitchChange = (checked: boolean) => {
  console.log("Switch is now:", checked ? "ON" : "OFF");
};

const options = [
  { value: "PCS", label: "PCS" },
  { value: "UNIT", label: "UNIT" },
  { value: "RIM", label: "RIM" },
];
const options2 = [
  { value: "00001", label: "SUPPORTER" },
  { value: "00002", label: "AKSESORIS TENIS" },
  { value: "00003", label: "BAJU + KAOS" },
];
const handleSelectChange = (value: string) => {
  console.log("Selected value:", value);
};

export default function DetailStok() {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold text-white">Detail Stok</h1>
        <div className="mb-5">
          <Link
            href="/stok"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Kembali Ke Halaman Stok
          </Link>
        </div>
      </div>
      <ComponentCard title="ABDOMINAL BAND / KORSET AGNESIS">
        <form className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Kode Barang</Label>
            <div className="w-[78%]">
              <Input defaultValue={"0002"} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Nama Barang*</Label>
            <div className="w-[78%]">
              <Input
                defaultValue={"ABDOMINAL BAND / KORSET AGNESIS"}
                disabled
              ></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Satuan*</Label>
            <div className="w-[78%]">
              <Input defaultValue={"PCS"} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Jenis*</Label>
            <div className="w-[78%]">
              <SearchableSelect
                disabled={true}
                options={options2}
                defaultValue="00002"
                onChange={handleSelectChange}
                className="dark:bg-dark-900"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Stok Awal</Label>
            <div className="w-[78%]">
              <Input defaultValue={"0"} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Barang Masuk</Label>
            <div className="w-[78%]">
              <Input defaultValue={"20"} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Barang Keluar</Label>
            <div className="w-[78%]">
              <Input defaultValue={"5"} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Stok Akhir</Label>
            <div className="w-[78%]">
              <Input defaultValue={"15"} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Stok Minim Gudang*</Label>
            <div className="w-[78%]">
              <Input defaultValue={"10"} disabled></Input>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Harga Barang*</Label>
            <div className="flex w-[78%] items-center gap-x-2">
              <p className="text-gray-400">Rp.</p>
              <div className="w-full">
                <Input defaultValue={"50.000"} disabled></Input>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Total Harga Barang</Label>
            <div className="flex w-[78%] items-center gap-x-2">
              <p className="text-gray-400">Rp.</p>
              <div className="w-full">
                <Input defaultValue={"750.000"} disabled></Input>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Harga Jual*</Label>
            <div className="flex w-[78%] items-center gap-x-2">
              <p className="text-gray-400">Rp.</p>
              <div className="w-full">
                <Input defaultValue={"60.000"} disabled></Input>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-md w-[20%]">Harga Label</Label>
            <div className="flex w-[78%] items-center gap-x-2">
              <p className="text-gray-400">Rp.</p>
              <div className="w-full">
                <Input defaultValue={"65.000"} disabled></Input>
              </div>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div>
              <Switch
                label="Aktifkan Jika Ingin Mengubah Data"
                defaultChecked={false}
                onChange={handleSwitchChange}
              />
            </div>
            <div>
              <Button type="submit" disabled>
                Ubah Data
              </Button>
            </div>
          </div>
        </form>
      </ComponentCard>
      {/* <ComponentCard title="Ubah Data Stok" className="mb-5">
        <form className="space-y-6">
          <div>
            <Label>Kode Barang</Label>
            <Input defaultValue={"000001"} disabled></Input>
          </div>
          <div className="flex justify-between">
            <div className="w-[70%]">
              <Label>Nama Barang</Label>
              <Input></Input>
            </div>
            <div className="w-[28%]">
              <Label>Satuan</Label>
              <Select
                options={options}
                placeholder="Pilih Satuan"
                onChange={handleSelectChange}
                className="dark:bg-dark-900"
              />
            </div>
          </div>
          <div>
            <Label>Jenis</Label>
            <SearchableSelect
              options={options2}
              placeholder="Pilih Satuan"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
            />
          </div>
          <div>
            <Label>Stok Minim Gudang</Label>
            <Input type="number"></Input>
          </div>
          <div>
            <Label>Harga Jual</Label>
            <Input></Input>
          </div>
          <div>
            <Label>Harga Label</Label>
            <Input></Input>
          </div>
          <div>
            <Button size="md" variant="primary">
              Ubah Data
            </Button>
          </div>
        </form>
      </ComponentCard> */}
    </div>
  );
}
