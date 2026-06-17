import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVaultStore } from "@/stores/vaultStore";
import type { Credential } from "@/lib/credential";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Copy, EyeIcon, EyeOffIcon, Plus, Search } from "lucide-react";
import { getFaviconSrc } from "@/lib/favicon";

export function VaultPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { credentials, searchQuery, setSearch } = useVaultStore();

  const credentialsFiltered = credentials.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="mx-auto flex flex-col h-[calc(100vh-3rem)] overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 w-full flex-shrink-0 ">
        <div className="col-span-2">
          <h1 className="text-2xl font-bold">{t("vault-page.title")}</h1>
          <p className="text-sm">{t("vault-page.description")}</p>
        </div>
        <div className="flex gap-2 items-center col-span-2">
          <InputGroup className="max-w-xs w-full hidden lg:flex">
            <InputGroupInput
              placeholder={t("common.search") + "..."}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            {searchQuery && (
              <InputGroupAddon align="inline-end">
                {credentialsFiltered.length}
              </InputGroupAddon>
            )}
          </InputGroup>
          <Button onClick={() => navigate("/add-password", { replace: false })}>
            <Plus /> <span>{t("vault-page.create")}</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 mt-4 mb-12 w-full px-3 py-2 pr-3 rounded border">
        <div>
          <CredentialList credentials={credentialsFiltered} />
        </div>
      </ScrollArea>
    </div>
  );
}

function CredentialList({ credentials }: { credentials: Credential[] }) {
  if (credentials.length !== 0) {
    return (
      <div className="flex flex-col gap-2">
        {credentials.map((c) => {
          return <CredentialCard key={c.id} credential={c} />;
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col py-32 justify-center items-center text-muted-foreground">
      <span>Nenhuma senha adicionada.</span>
    </div>
  );
}

function CredentialCard({ credential }: { credential: Credential }) {
  const [showPassword, setShowPassword] = useState(false);
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (credential.iconPath) {
      getFaviconSrc(credential.iconPath).then(setSrc);
    }
  }, [credential.iconPath]);

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-start items-center">
          <img src={src} alt="favicon" width={32} height={32} />
          <CardTitle>
            <span className="text-lg">{credential.name}</span>
          </CardTitle>
        </div>
        <CardDescription>{credential.target.type}</CardDescription>
        <CardAction>
          <Toggle
            aria-label="Toggle password visibility"
            size="sm"
            variant="default"
            pressed={showPassword}
            onPressedChange={setShowPassword}
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </Toggle>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="w-full flex gap-2 items-center">
          <Button
            size="icon"
            onClick={() => navigator.clipboard.writeText(credential.identifier)}
          >
            <Copy />
          </Button>
          <span className="text-sm">{credential.identifier}</span>
        </div>
      </CardContent>
    </Card>
  );
}
