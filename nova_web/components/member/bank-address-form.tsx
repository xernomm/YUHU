"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Landmark } from "lucide-react";
import { banks, provinces } from "@/lib/data/content";
import type { BankAccount } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, FieldError } from "@/components/ui/input";
import { Select, SearchableSelect } from "@/components/ui/select";

const schema = z.object({
  bank: z.string().min(1, "Pilih bank Anda."),
  accountNumber: z.string().min(6, "Nomor rekening tidak valid."),
  accountHolder: z.string().min(2, "Nama pemilik rekening wajib diisi."),
  ktp: z.string().length(16, "No KTP harus 16 digit."),
  npwp: z.string().min(15, "No NPWP minimal 15 digit."),
  province: z.string().min(1, "Pilih provinsi."),
  regency: z.string().min(2, "Kabupaten/kota wajib diisi."),
  district: z.string().min(2, "Kecamatan wajib diisi."),
  village: z.string().min(2, "Kelurahan wajib diisi."),
  addressDetail: z.string().min(8, "Tuliskan alamat lengkap Anda."),
});

export type BankAddressValues = z.infer<typeof schema>;

export function BankAddressForm({
  initial,
  onSave,
  submitLabel = "Simpan",
  secondaryAction,
}: {
  initial?: BankAccount | null;
  onSave: (values: BankAddressValues) => void;
  submitLabel?: string;
  secondaryAction?: React.ReactNode;
}) {
  const [validated, setValidated] = React.useState(false);
  const [validating, setValidating] = React.useState(false);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<BankAddressValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { bank: "", province: "" },
  });

  function onValidate() {
    const { bank, accountNumber } = getValues();
    if (!bank || accountNumber.length < 6) return;
    setValidating(true);
    // Mock bank validation
    setTimeout(() => {
      setValidating(false);
      setValidated(true);
    }, 900);
  }

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate className="flex flex-col gap-4">
      <fieldset className="rounded-xl bg-canvas p-4">
        <legend className="flex items-center gap-2 px-1 text-sm font-bold text-brand">
          <Landmark className="size-4" /> Rekening Pencairan
        </legend>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="bank">Pilih Bank</Label>
            <Controller
              control={control}
              name="bank"
              render={({ field }) => (
                <SearchableSelect
                  id="bank"
                  options={banks}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Pilih bank"
                  searchPlaceholder="Cari nama bank…"
                />
              )}
            />
            <FieldError message={errors.bank?.message} />
          </div>
          <div>
            <Label htmlFor="accountNumber">Nomor Rekening</Label>
            <Input
              id="accountNumber"
              inputMode="numeric"
              placeholder="cth. 1234567890"
              aria-invalid={!!errors.accountNumber}
              {...register("accountNumber")}
            />
            <FieldError message={errors.accountNumber?.message} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="accountHolder">Pemilik Rekening</Label>
            <Input
              id="accountHolder"
              placeholder="Nama sesuai buku tabungan"
              aria-invalid={!!errors.accountHolder}
              {...register("accountHolder")}
            />
            <FieldError message={errors.accountHolder?.message} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onValidate}
            disabled={validating || validated}
          >
            {validating ? "Memvalidasi…" : "Validasi Rekening"}
          </Button>
          {validated && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              <CheckCircle2 className="size-4" /> Rekening tervalidasi
            </span>
          )}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ktp">No KTP</Label>
          <Input
            id="ktp"
            inputMode="numeric"
            maxLength={16}
            placeholder="16 digit NIK"
            aria-invalid={!!errors.ktp}
            {...register("ktp")}
          />
          <FieldError message={errors.ktp?.message} />
        </div>
        <div>
          <Label htmlFor="npwp">No NPWP</Label>
          <Input
            id="npwp"
            inputMode="numeric"
            placeholder="15–16 digit NPWP"
            aria-invalid={!!errors.npwp}
            {...register("npwp")}
          />
          <FieldError message={errors.npwp?.message} />
        </div>
        <div>
          <Label htmlFor="province">Provinsi</Label>
          <Select id="province" aria-invalid={!!errors.province} {...register("province")}>
            <option value="">Pilih provinsi</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
          <FieldError message={errors.province?.message} />
        </div>
        <div>
          <Label htmlFor="regency">Kabupaten / Kota</Label>
          <Input
            id="regency"
            placeholder="cth. Palembang"
            aria-invalid={!!errors.regency}
            {...register("regency")}
          />
          <FieldError message={errors.regency?.message} />
        </div>
        <div>
          <Label htmlFor="district">Kecamatan</Label>
          <Input
            id="district"
            placeholder="cth. Ilir Barat I"
            aria-invalid={!!errors.district}
            {...register("district")}
          />
          <FieldError message={errors.district?.message} />
        </div>
        <div>
          <Label htmlFor="village">Kelurahan</Label>
          <Input
            id="village"
            placeholder="cth. Lorok Pakjo"
            aria-invalid={!!errors.village}
            {...register("village")}
          />
          <FieldError message={errors.village?.message} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="addressDetail">Alamat Lengkap</Label>
          <Textarea
            id="addressDetail"
            placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
            aria-invalid={!!errors.addressDetail}
            {...register("addressDetail")}
          />
          <FieldError message={errors.addressDetail?.message} />
        </div>
      </div>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {secondaryAction}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
