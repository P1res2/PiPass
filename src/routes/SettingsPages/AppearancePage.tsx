import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/stores/settingsStore";
import { themes, type Theme } from "@/lib/theme";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AppearancePage() {
  const { t } = useTranslation();
  const { settings, update } = useSettingsStore();

  const handleOnChange = async (v: Theme) => {
    await update({ theme: v });
  };

  return (
    <div>
      <Field>
        <FieldLabel htmlFor="appearance-input">
          {t("settings.appearance")}
        </FieldLabel>
        <FieldDescription>
          {t("appearance-page.select-theme-description")}
        </FieldDescription>
        <Select value={settings?.theme} onValueChange={handleOnChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("settings.appearance")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {themes.map((theme) => {
                return (
                  <SelectItem value={theme.code}>
                    {t(theme.label)}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}
