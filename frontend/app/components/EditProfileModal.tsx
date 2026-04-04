"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useLanguageStore } from "@/app/lib/stores";
import { getT } from "@/app/lib/i18n";

interface EditProfileModalProps {
    isOpen: boolean;
    currentDisplayName: string;
    currentAvatarUrl?: string | null;
    onClose: () => void;
    onSaved: () => void; // called after successful save so parent can re-sync
}

export default function EditProfileModal({
    isOpen,
    currentDisplayName,
    currentAvatarUrl,
    onClose,
    onSaved,
}: EditProfileModalProps) {
    const { lang } = useLanguageStore();
    const t = getT(lang);

    const [displayName, setDisplayName] = useState(currentDisplayName || "");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(currentAvatarUrl || null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [status, setStatus] = useState<"idle" | "uploading" | "saving" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (file.size > 2 * 1024 * 1024) return t.editErrBig;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return t.editErrType;
        return null;
    };

    const handleFile = useCallback((file: File) => {
        const err = validateFile(file);
        if (err) { setError(err); return; }
        setError(null);
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setAvatarPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lang]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleSave = async () => {
        if (!displayName.trim()) { setError(t.editName + " required"); return; }
        setError(null);

        let newAvatarUrl: string | undefined;

        // Step 1: Upload avatar if a new file was selected
        if (avatarFile) {
            setStatus("uploading");
            const ext = avatarFile.type === "image/png" ? "png" : avatarFile.type === "image/webp" ? "webp" : "jpg";
            try {
                const presignRes = await fetch("/api/upload/presign", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "user-avatar", ext }),
                });
                const presignData = await presignRes.json();
                if (!presignData.uploadUrl) throw new Error("No upload URL");

                const putRes = await fetch(presignData.uploadUrl, {
                    method: "PUT",
                    body: avatarFile,
                    headers: { "Content-Type": avatarFile.type },
                });
                if (!putRes.ok) throw new Error("PUT failed");

                newAvatarUrl = presignData.publicUrl;
            } catch {
                setStatus("idle");
                setError(t.editErrUpload);
                return;
            }
        }

        // Step 2: Save profile
        setStatus("saving");
        try {
            const body: Record<string, string> = { displayName: displayName.trim() };
            if (newAvatarUrl) body.avatarUrl = newAvatarUrl;

            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Save failed");

            setStatus("done");
            setTimeout(() => {
                onSaved();
                onClose();
                setStatus("idle");
            }, 800);
        } catch {
            setStatus("idle");
            setError(t.editErrSave);
        }
    };

    if (!isOpen) return null;

    const busy = status === "uploading" || status === "saving";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}
        >
            <div className="relative w-full max-w-md mx-4 glass-card border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-ghost-white tracking-wide">{t.editProfile}</h2>
                    {!busy && (
                        <button
                            onClick={onClose}
                            className="text-ghost-muted hover:text-white text-2xl leading-none transition-colors"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Avatar Upload */}
                <div className="mb-6">
                    <p className="text-xs text-ghost-muted uppercase tracking-widest mb-3">{t.editAvatar}</p>
                    <div
                        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer h-40 overflow-hidden
                            ${dragging ? "border-terminal-green bg-terminal-green/10" : "border-white/20 hover:border-terminal-green/50 hover:bg-white/5"}`}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => !busy && fileInputRef.current?.click()}
                    >
                        {avatarPreview ? (
                            <>
                                <Image
                                    src={avatarPreview}
                                    alt="avatar preview"
                                    fill
                                    className="object-cover"
                                    unoptimized={avatarPreview.startsWith("data:")}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <span className="text-white text-sm font-medium">🔄 {t.editChange}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-2 px-4 text-center pointer-events-none">
                                <span className="text-3xl">🖼️</span>
                                <p className="text-xs text-ghost-muted leading-relaxed">{t.editAvatarHint}</p>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                    />
                </div>

                {/* Display Name */}
                <div className="mb-6">
                    <label className="block text-xs text-ghost-muted uppercase tracking-widest mb-2">
                        {t.editName}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value.slice(0, 30))}
                            placeholder={t.editNamePlaceholder}
                            disabled={busy}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-ghost-white placeholder-ghost-muted/50 text-sm focus:outline-none focus:border-terminal-green/50 transition-colors disabled:opacity-50"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-ghost-muted font-mono">
                            {displayName.length}/30
                        </span>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-neon-red text-xs mb-4 bg-neon-red/10 border border-neon-red/20 px-3 py-2 rounded-lg">
                        ⚠️ {error}
                    </p>
                )}

                {/* Success */}
                {status === "done" && (
                    <p className="text-terminal-green text-xs mb-4 bg-terminal-green/10 border border-terminal-green/20 px-3 py-2 rounded-lg">
                        {t.editSuccess}
                    </p>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={busy}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-ghost-muted hover:text-white hover:border-white/30 text-sm transition-all disabled:opacity-40"
                    >
                        {t.editCancel}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={busy || !displayName.trim()}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-terminal-green/10 border border-terminal-green/30 text-terminal-green hover:bg-terminal-green hover:text-black text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {status === "uploading" ? t.editUploading
                            : status === "saving" ? t.editSaving
                            : t.editSave}
                    </button>
                </div>
            </div>
        </div>
    );
}
