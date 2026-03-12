"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import type {
  ButtonHTMLAttributes,
  ChangeEventHandler,
  FormEvent,
} from "react";
import { toast } from "sonner";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import { cn } from "@/lib/utils";

type ProfileFormState = {
  displayName: string;
  nickname: string;
  email: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type PreferencesState = {
  translation: string;
  sermonSuggestions: boolean;
  historicalReferences: boolean;
  emailUpdates: boolean;
  twoFactor: boolean;
};

type ProfileErrors = Partial<Record<keyof ProfileFormState, string>>;
type PasswordErrors = Partial<Record<keyof PasswordFormState, string>>;

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const } },
};

const collapseVariants = {
  hidden: { height: 0, opacity: 0 },
  show: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
};

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    displayName: "",
    nickname: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [preferences, setPreferences] = useState<PreferencesState>({
    translation: "NIV",
    sermonSuggestions: true,
    historicalReferences: true,
    emailUpdates: true,
    twoFactor: false,
  });
  const [profileErrors, setProfileErrors] = useState<ProfileErrors>({});
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      displayName: user.fullName ?? [user.firstName, user.lastName].filter(Boolean).join(" "),
      nickname: user.username ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
    });
    setImagePreview(user.imageUrl ?? null);
    setPreferences((prev) => ({
      ...prev,
      twoFactor: user.twoFactorEnabled ?? false,
    }));
  }, [user]);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const verificationLabel = useMemo(() => {
    if (!user) return "Email not verified";
    return user.hasVerifiedEmailAddress ? "Email verified" : "Email not verified";
  }, [user]);

  const handleProfileChange = (field: keyof ProfileFormState, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: keyof PasswordFormState, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateProfile = () => {
    const errors: ProfileErrors = {};
    if (!profileForm.displayName.trim()) {
      errors.displayName = "Display name is required.";
    }
    if (profileForm.nickname.trim().length > 0 && profileForm.nickname.trim().length < 3) {
      errors.nickname = "Nickname should be at least 3 characters.";
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors: PasswordErrors = {};
    if (!passwordForm.newPassword.trim() || passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters.";
    }
    if (!passwordForm.confirmPassword.trim()) {
      errors.confirmPassword = "Confirm your new password.";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!passwordForm.currentPassword.trim()) {
      errors.currentPassword = "Current password is required.";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateProfile()) return;

    setProfileLoading(true);
    try {
      if (user) {
        const nameParts = profileForm.displayName.trim().split(" ");
        const firstName = nameParts.shift() ?? profileForm.displayName.trim();
        const lastName = nameParts.length ? nameParts.join(" ") : user.lastName ?? "";
        await user.update({
          firstName,
          lastName: lastName || undefined,
          username: profileForm.nickname || undefined,
        });
        if (imageFile) {
          await user.setProfileImage({ file: imageFile });
          setImageFile(null);
        }
      }
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error("Unable to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validatePassword()) return;

    setPasswordLoading(true);
    try {
      if (user) {
        await user.updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        });
      }
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated.");
    } catch (error) {
      toast.error("Password update failed.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePreferencesSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPreferencesLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Preferences saved.");
    } catch (error) {
      toast.error("Unable to save preferences.");
    } finally {
      setPreferencesLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={cardVariants}
      className="space-y-6"
    >
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Settings
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">Account Settings</h1>
        <p className="text-sm text-slate-500">
          Manage your profile, security, and workspace preferences.
        </p>
      </header>

      <div className="grid gap-6">
        <SectionCard
          title="Profile Info"
          description="Update your identity details and profile photo."
          defaultOpen
        >
          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-white">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-400">
                      SA
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Profile Photo</p>
                  <p className="text-xs text-slate-500">Upload a square image up to 5MB.</p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <FileUpload
                  onFileSelect={(file) => setImageFile(file)}
                  disabled={!isLoaded || profileLoading}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Display Name"
                name="displayName"
                placeholder="Enter your display name"
                value={profileForm.displayName}
                onChange={(event) => handleProfileChange("displayName", event.target.value)}
                error={profileErrors.displayName}
              />
              <Input
                label="Nickname"
                name="nickname"
                placeholder="Optional nickname"
                value={profileForm.nickname}
                onChange={(event) => handleProfileChange("nickname", event.target.value)}
                error={profileErrors.nickname}
              />
              <Input
                label="Email"
                name="email"
                value={profileForm.email}
                readOnly
                className="bg-slate-100 text-slate-500"
              />
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    user?.hasVerifiedEmailAddress ? "bg-emerald-500" : "bg-amber-500"
                  )}
                />
                {verificationLabel}
              </div>
            </div>

            <Button type="submit" loading={profileLoading} className="w-full sm:w-auto">
              Save Profile
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Security" description="Change your password and security settings.">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <PasswordInput
                label="Current Password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(event) => handlePasswordChange("currentPassword", event.target.value)}
                error={passwordErrors.currentPassword}
              />
              <div className="hidden sm:block" />
              <PasswordInput
                label="New Password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={(event) => handlePasswordChange("newPassword", event.target.value)}
                error={passwordErrors.newPassword}
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(event) => handlePasswordChange("confirmPassword", event.target.value)}
                error={passwordErrors.confirmPassword}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleRow
                label="Two-factor authentication"
                description="Add an extra layer of security for sign-ins."
                enabled={preferences.twoFactor}
                onToggle={() =>
                  setPreferences((prev) => ({ ...prev, twoFactor: !prev.twoFactor }))
                }
              />
              <ToggleRow
                label="Email security alerts"
                description="Receive notifications for new sign-ins."
                enabled={preferences.emailUpdates}
                onToggle={() =>
                  setPreferences((prev) => ({ ...prev, emailUpdates: !prev.emailUpdates }))
                }
              />
            </div>

            <Button type="submit" loading={passwordLoading} className="w-full sm:w-auto">
              Update Password
            </Button>
          </form>
        </SectionCard>

        <SectionCard title="Preferences" description="Personalize the ScriptureAI workspace.">
          <form onSubmit={handlePreferencesSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Preferred translation"
                value={preferences.translation}
                onChange={(event) =>
                  setPreferences((prev) => ({ ...prev, translation: event.target.value }))
                }
                options={["NIV", "ESV", "KJV", "Other"]}
              />
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Workspace focus</p>
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Personal Bible Study
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleRow
                label="Sermon outline suggestions"
                description="Enable sermon drafting assistance."
                enabled={preferences.sermonSuggestions}
                onToggle={() =>
                  setPreferences((prev) => ({
                    ...prev,
                    sermonSuggestions: !prev.sermonSuggestions,
                  }))
                }
              />
              <ToggleRow
                label="Historical references"
                description="Include theologians and church history."
                enabled={preferences.historicalReferences}
                onToggle={() =>
                  setPreferences((prev) => ({
                    ...prev,
                    historicalReferences: !prev.historicalReferences,
                  }))
                }
              />
            </div>

            <Button type="submit" loading={preferencesLoading} className="w-full sm:w-auto">
              Save Preferences
            </Button>
          </form>
        </SectionCard>
      </div>
    </motion.div>
  );
}

function SectionCard({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.section
      variants={cardVariants}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 text-left"
        aria-expanded={isOpen}
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              d="M6 9l6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={collapseVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="mt-6 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

function Button({
  children,
  loading,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70",
        className
      )}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
      )}
      {children}
    </button>
  );
}

function FileUpload({
  onFileSelect,
  disabled,
}: {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(event) => onFileSelect(event.target.files?.[0] ?? null)}
      />
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          d="M12 5v14M5 12h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      Upload
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={cn(
          "relative h-6 w-11 rounded-full transition",
          enabled ? "bg-slate-900" : "bg-slate-200"
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow",
            enabled ? "left-5" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}
