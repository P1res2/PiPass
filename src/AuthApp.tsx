import { useEffect, useState } from "react";
import { emit } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useTranslation } from "react-i18next";
import { useVaultStore } from "@/stores/vaultStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { applyTheme } from "@/lib/theme";
import i18n from "@/lib/i18n";
import { UnlockLayout } from "@/components/layouts";
import { LockIcon } from "@/components/LockIcon";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon, LockKeyholeOpen } from "lucide-react";

const mode =
  new URLSearchParams(window.location.search).get("mode") ?? "unlock";

export function AuthApp() {
  const { unlock } = useVaultStore();
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    useSettingsStore
      .getState()
      .load()
      .then((settings) => {
        if (settings?.language) i18n.changeLanguage(settings.language);
        if (settings?.theme) applyTheme(settings.theme);
        getCurrentWebviewWindow().show();
      });
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(false);

    if (mode === "confirm") {
      const ok = await unlock(password);
      if (ok) {
        await emit("confirm-result", "success");
        await getCurrentWebviewWindow().close();
      } else {
        setError(true);
      }
      setIsLoading(false);
      setPassword("");
      return;
    }

    // mode === "unlock"
    const ok = await unlock(password);

    if (!ok) {
      setError(true);
      setIsLoading(false);
      return;
    }

    setIsLocked(false);
    await new Promise((r) => setTimeout(r, 800));

    // Emite a senha pro main carregar o vault
    await emit("vault-unlocked", password);
    await getCurrentWebviewWindow().close();

    setIsLoading(false);
    setPassword("");
    setIsLocked(true);
  };

  return (
    <UnlockLayout>
      <div className="flex items-center justify-center h-screen w-full">
        <form
          className="w-full max-w-sm px-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <LockIcon isLocked={isLocked} />
              <h1 className="text-xl font-bold">
                {mode === "confirm" ? t("confirm.title") : t("unlock.title")}
              </h1>
            </div>
            <Field>
              <FieldLabel>{t("unlock.password")}</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  autoFocus
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <Toggle
                    size="sm"
                    pressed={showPassword}
                    onPressedChange={setShowPassword}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </Toggle>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            {error && (
              <p className="text-destructive text-sm">{t("unlock.error")}</p>
            )}
            <div className="flex gap-2">
              {mode === "confirm" && (
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={async () => {
                    await emit("confirm-result", "cancelled");
                    await getCurrentWebviewWindow().close();
                  }}
                >
                  {t("common.cancel")}
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <LockKeyholeOpen />
                {isLoading ? <Spinner /> : t("unlock.submit")}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </UnlockLayout>
  );
}
