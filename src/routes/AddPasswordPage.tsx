import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useTranslation } from "react-i18next";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVaultStore } from "@/stores/vaultStore";
import { CREDENTIAL_TYPES, type CredentialTargetType } from "@/lib/credential";
import {
  addCredentialFormSchema,
  type AddCredentialFormType,
} from "@/lib/schemas";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Plus, Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Toggle } from "@/components/ui/toggle";

export function AddPasswordPage() {
  const { t } = useTranslation();
  const { credentials, addCredential } = useVaultStore();
  const [targetType, setTargetType] = useState<CredentialTargetType>("app");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,
    formState: { isValid },
  } = useForm<AddCredentialFormType>({
    resolver: zodResolver(addCredentialFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      identifier: "",
      password: "",
      target: {
        type: "app",
        path: "",
      },
    },
  });

  const targetPath = useWatch({
    control,
    name: "target.path",
  });

  const handlePickApp = async () => {
    const path = await open({
      multiple: false,
      filters: [{ name: "Executável", extensions: ["exe"] }],
    });

    if (path) {
      setValue(
        "target",
        { type: "app", path: path as string },
        { shouldValidate: true },
      );
    }
  };

  function onSubmit(data: AddCredentialFormType) {
    const c = credentials.find((a) => a.target === data.target);
    if (c) return;

    const { password, ...cred } = data;

    addCredential(cred, password);
    reset();
    setTargetType("app");
    trigger();
  }

  return (
    <div className="flex flex-col mt-16">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("add-password-page.title")}</h1>
          <p className="text-sm">{t("add-password-page.description")}</p>
        </div>
      </div>

      <form className="w-full max-w-sm pt-12" onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Name field */}
          <Field>
            <FieldLabel htmlFor="name">
              {t("add-password-page.name-field.title")}
            </FieldLabel>
            <Input {...register("name")} id="name" type="text" />
            <FieldDescription>
              {t("add-password-page.name-field.description")}
            </FieldDescription>
          </Field>

          {/* Identifier field */}
          <Field>
            <FieldLabel htmlFor="identifier">
              {t("add-password-page.identifier-field.title")}
            </FieldLabel>
            <Input {...register("identifier")} id="identifier" type="text" />
            <FieldDescription>
              {t("add-password-page.identifier-field.description")}
            </FieldDescription>
          </Field>

          {/* Password field */}
          <Field>
            <FieldLabel htmlFor="password">
              {t("add-password-page.password-field.title")}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
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
            {/* <FieldDescription>
              {t("add-password-page.password-field.url-description")}
            </FieldDescription> */}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            {/* Target type field */}
            <Field>
              <FieldLabel htmlFor="target-type">
                {t("add-password-page.target-field.target-type-title")}
              </FieldLabel>
              <Select
                value={targetType}
                onValueChange={(type) => {
                  setTargetType(type as CredentialTargetType);

                  if (type === "web") {
                    setValue(
                      "target",
                      { type: "web", url: "" },
                      { shouldValidate: true },
                    );
                  } else {
                    setValue(
                      "target",
                      { type: "app", path: "" },
                      { shouldValidate: true },
                    );
                  }
                }}
              >
                <SelectTrigger id="target-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CREDENTIAL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`add-password-page.target-field.targets.${type}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Target field */}
            {/* App */}
            {targetType === "app" && (
              <Field>
                <FieldLabel htmlFor="target">
                  {t("add-password-page.target-field.target-title")}
                </FieldLabel>
                <div className="flex gap-1 items-center">
                  <Input
                    className="pt-1.5"
                    id="target"
                    value={targetPath ?? ""}
                    readOnly
                    placeholder={t(
                      "add-password-page.target-field.none-selected",
                    )}
                  />
                  <Button
                    id="target"
                    type="button"
                    variant="secondary"
                    onClick={handlePickApp}
                  >
                    <Search />
                    <span>{t("common.search")}</span>
                  </Button>
                </div>
                <FieldDescription>
                  {t("add-password-page.target-field.path-description")}
                </FieldDescription>
              </Field>
            )}

            {/* Web */}
            {targetType === "web" && (
              <Field>
                <FieldLabel htmlFor="target">
                  {t("add-password-page.target-field.target-title")}
                </FieldLabel>
                <Input
                  {...register("target.url")}
                  className="pt-1.5"
                  id="target"
                  type="text"
                  placeholder={t(
                    "add-password-page.target-field.none-selected",
                  )}
                />
                <FieldDescription>
                  {t("add-password-page.target-field.url-description")}
                </FieldDescription>
              </Field>
            )}
          </div>

          <Field orientation="horizontal">
            <Button type="submit" size={"lg"} disabled={!isValid}>
              <Plus /> <span>{t("add-password-page.add")}</span>
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
