"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import type { UserSettingsResponse } from "@/types/profile";
import { updateAccountSettings } from "@/lib/api/users.client";
import { Field, settingsInputClass, Toggle, SaveButton } from "../ui/SettingsControls";

export default function AccountForm({ initial }: { initial: UserSettingsResponse }) {
    const a = initial.accountSettings;
    const supabase = createClient();
    const [email, setEmail] = useState(a.emailAddress ?? "");
    const [password, setPassword] = useState(a.password ?? "");
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (saving) return;
        setSaving(true);
        try {
            await updateAccountSettings({ emailAddress: email, password });

            if (email && email !== a?.emailAddress) {
                const { error } = await supabase.auth.updateUser({ email });
                if (error) throw error;
                toast.success("Check your inbox to confirm the new email");
            }

            if (password && password !== a?.password) {
                const { error } = await supabase.auth.updateUser({ password });
                if (error) throw error;
                toast.success("Password updated");
            }

            toast.success("Account updated");
        } catch {
            toast.error("Couldn't save changes.");
        } finally {
            setSaving(false);
        }
    }


    async function handleChangePassword() {
        if (!email) return toast.error("No email on file.");
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) toast.error("Couldn't start password reset.");
        else toast.success("Password reset link sent");
    }

    return (
        <div className="mt-8">
            <Field label="Email address" hint="Used for sign-in and notifications.">
                <input
                    type="email"
                    className={settingsInputClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />
            </Field>

            <Field label="Password" hint="Manage your sign-in password.">
                <input
                    type="password"
                    className={settingsInputClass}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                />
                <button
                    type="button"
                    onClick={handleChangePassword}
                    className="rounded-md border border-brand-gold/30 px-4 py-2 font-manrope text-[12px] uppercase tracking-[0.14em] text-brand-light transition-colors hover:border-brand-gold/60"
                >
                    Change password
                </button>
            </Field>


            <SaveButton saving={saving} onClick={handleSave} />
        </div>
    );
}