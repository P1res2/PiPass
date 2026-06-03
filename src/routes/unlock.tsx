import { useState } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { useNavigate } from "react-router-dom";
import { useVaultStore } from "@/stores/vaultStore";
import { LockIcon } from "@/components/LockIcon";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon, LockKeyholeOpen } from "lucide-react";

export function UnlockPage() {
  const { unlock } = useVaultStore();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async () => {
    setIsLoading(true);
    const isUnlocked = await unlock(password);
    const currentWindow = getCurrentWindow();

    if (!isUnlocked) {
      setIsLoading(false);
      return;
    }

    if (isUnlocked) {
      setIsLocked(false);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      currentWindow.setSize(new LogicalSize(1280, 720));
      currentWindow.center();
      currentWindow.setAlwaysOnTop(false);

      navigate("/vault", { replace: true });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleUnlock();
      }}
      className="w-full"
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center justify-center rounded-md">
            <LockIcon isLocked={isLocked} />
          </div>
          <span className="sr-only">PiPass logo</span>
          <h1 className="text-xl font-bold">PiPass</h1>
        </div>
        <Field>
          <FieldLabel htmlFor="inline-end-input">Senha</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="inline-end-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
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
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Button type="submit" className="w-full" disabled={isLoading}>
          <LockKeyholeOpen />
          {isLoading ? "Desbloqueando..." : "Desbloquear"}
        </Button>
      </FieldGroup>
    </form>
  );
}
