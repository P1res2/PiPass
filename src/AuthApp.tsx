import { useEffect, useState } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { emit, listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";
import { useVaultStore } from "@/stores/vaultStore";
import { useSettingsStore } from "@/stores/settingsStore";
import i18n from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { applyTheme } from "@/lib/theme";
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

export function AuthApp() {
  const { unlock } = useVaultStore();
  const { t } = useTranslation();
  const [mode, setMode] = useState<"unlock" | "confirm">("unlock");
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

  // Change to confirm page
  useEffect(() => {
    const setup = async () => {
      const unlisten = await listen<string>("navigate", (event) => {
        setMode(event.payload as "unlock" | "confirm");
      });

      return unlisten;
    };

    setup();
  }, []);

  // If it is closed, switch to the unlock page
  useEffect(() => {
    const win = getCurrentWebviewWindow();
    const unlisten = win.onCloseRequested(async () => {
      await invoke("cancel_confirmation");
      setMode("unlock");
      setPassword("");
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(false);

    if (mode === "confirm") {
      const ok = await unlock(password);
      if (ok) {
        await invoke("confirm_action", {
          result: true,
        });
        setPassword("");
        await getCurrentWebviewWindow().close();
        setMode("unlock");
      } else {
        setError(true);
      }
      setIsLoading(false);
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
                {mode === "confirm" ? t("unlock.title") : t("unlock.title")}
              </h1>
            </div>
            <Field>
              <FieldLabel>{t("unlock.password")}</FieldLabel>
              <InputGroup className={cn(error && "border-red-500")}>
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
            <div className="flex gap-2">
              {mode === "confirm" && (
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={async () => {
                    setPassword("");
                    await invoke("cancel_confirmation");
                    await getCurrentWebviewWindow().close();
                    setMode("unlock");
                  }}
                >
                  <span>{t("common.cancel")}</span>
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={isLoading}>
                <LockKeyholeOpen />
                {isLoading ? <Spinner /> : <span>{t("unlock.submit")}</span>}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </UnlockLayout>
  );
}
