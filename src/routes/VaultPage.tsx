import { useTranslation } from "react-i18next";
import { useVaultStore } from "@/stores/vaultStore";
import type { Credential } from "@/lib/credential";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Plus, Search } from "lucide-react";

export function VaultPage() {
  const { t } = useTranslation();
  const { credentials, setSearch } = useVaultStore();

  return (
    <div className="flex flex-col mt-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("vault-page.title")}</h1>
          <p className="text-sm">{t("vault-page.description")}</p>
        </div>

        <div className="flex gap-2 items-center">
          <InputGroup className="max-w-xs">
            <InputGroupInput
              placeholder={t("common.search") + "..."}
              onChange={(e) => setSearch(e.target.value)}
            />

            <InputGroupAddon>
              <Search />
            </InputGroupAddon>

            {credentials.length > 0 && (
              <InputGroupAddon align="inline-end">
                {credentials.length}
              </InputGroupAddon>
            )}
          </InputGroup>
          <Button>
            <Plus /> <span>{t("vault-page.create")}</span>
          </Button>
        </div>
      </div>

      <CredentialList credentials={credentials} />
    </div>
  );
}

function CredentialList({ credentials }: { credentials: Credential[] }) {
  if (credentials.length !== 0) {
    return (
      <div>
        {credentials.map((c) => {
          return (
            <div className="h-32 w-full bg-muted">
              <h1>{c.name}</h1>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] justify-center items-center">
      Nenhuma senha adicionada.
    </div>
  );
}
