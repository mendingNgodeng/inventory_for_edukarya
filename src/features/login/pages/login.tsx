// src/features/Login.tsx

console.log("LOGIT route hit")

import React, { useMemo, useState } from "react";
import { Package, LogIn } from "lucide-react";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";

type LoginForm = {
  username: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

const DEMO = { username: "admin", password: "admin123" };

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return form.username.trim() && form.password.trim();
  }, [form]);

  const clearError = (name: keyof LoginForm) => {
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: LoginErrors = {};
    if (!form.username.trim()) newErrors.username = "Username wajib diisi";
    if (!form.password.trim()) newErrors.password = "Password wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsLoading(true);

      // Simulasi API call
      await new Promise((r) => setTimeout(r, 800));

      console.log("Login success:", form);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setErrors({});
    setForm(DEMO);
  };

  return (
    // <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <div className="fixed inset-0 z-[9999] bg-slate-50 flex items-center justify-center p-4 overflow-y-auto">  
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-8 py-10">
          
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="mt-5 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              Sistem Inventaris Edukarya
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Masuk sebagai admin untuk mengelola inventaris
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Username"
              name="username"
              placeholder="Masukkan username"
              value={form.username}
              error={errors.username}
            //   clearError={clearError}
              onChange={(e) =>
                setForm((p) => ({ ...p, username: e.target.value }))
              }
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Masukkan password"
              value={form.password}
              error={errors.password}
            //   clearError={clearError}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!canSubmit || isLoading}
              className="rounded-xl"
            >
              <LogIn className="h-4 w-4" />
              Masuk
            </Button>
          </form>

          {/* Demo Login */}
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm text-blue-700">
                <p className="font-semibold">Demo Login:</p>
                <p>
                  Username: <span className="font-medium">{DEMO.username}</span>
                </p>
                <p>
                  Password: <span className="font-medium">{DEMO.password}</span>
                </p>
              </div>

              <Button
                type="button"
                variant="outline_blue"
                size="sm"
                onClick={fillDemo}
              >
                Pakai Demo
              </Button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Edukarya
        </p>
      </div>
    </div>
  );
}