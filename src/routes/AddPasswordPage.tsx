import { useTranslation } from "react-i18next";
import { useVaultStore } from "@/stores/vaultStore";

export function AddPasswordPage() {
  const { t } = useTranslation();
  const { credentials, addCredential } = useVaultStore();

  return (
    <div className="flex flex-col mt-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("add-password-page.title")}</h1>
          <p className="text-sm">{t("add-password-page.description")}</p>
        </div>
      </div>
    </div>
  );
}
