"use client";

import * as React from "react";
import { storage } from "@/lib/storage";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useLocalData } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BankAddressForm } from "@/components/member/bank-address-form";

export function OnboardingModal() {
  const { user } = useAuthStore();
  const [needsOnboarding] = useLocalData(
    () => (user ? !storage.isOnboarded(user.id) : false),
    user?.id
  );
  const [dismissed, setDismissed] = React.useState(false);
  const open = (needsOnboarding ?? false) && !dismissed;

  if (!user) return null;

  function dismiss() {
    if (user) storage.setOnboarded(user.id);
    setDismissed(true);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && dismiss()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lengkapi Data Anda</DialogTitle>
          <DialogDescription>
            Data rekening dan alamat digunakan untuk pencairan komisi serta
            pengiriman produk. Anda bisa melewati langkah ini dan mengisinya
            nanti di Pengaturan Profile.
          </DialogDescription>
        </DialogHeader>

        <BankAddressForm
          onSave={(values) => {
            if (!user) return;
            storage.saveBankAccount(user.id, values);
            dismiss();
          }}
          secondaryAction={
            <Button type="button" variant="ghost" onClick={dismiss}>
              Lewati
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
