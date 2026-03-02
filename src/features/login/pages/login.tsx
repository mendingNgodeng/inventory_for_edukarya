import React, { useMemo, useState } from "react";
import { Package, LogIn,UserCircle } from "lucide-react";
import {Toaster} from 'sonner'
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import { useAuth } from "../../../api/auth/hooks";
import { useNavigate } from "react-router-dom";

type LoginForm = {
  username: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ username: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const navigate = useNavigate()
  const { login, loading, error } = useAuth();

  const canSubmit = useMemo(() => {
    return form.username.trim() && form.password.trim();
  }, [form]);

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

    await login({
      identifier: form.username,
      password: form.password,
    });
  };

  return (
    // temporary fix
    <><Toaster position="top-right" richColors />
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
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
            />

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              disabled={!canSubmit || loading}
              className="rounded-xl"
            >
              <LogIn className="h-4 w-4" />
              Masuk
            </Button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-red-600 text-center">
              {error}
            </p>
          )}
  <br />
          {/* <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3"> */}
          <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="rounded-xl"
              onClick={() => navigate("/borrow-assets")} 
              // path: '/borrow-assets'
            >
              <UserCircle className="h-4 w-4" />
              Sebagai Tamu
            </Button>
          {/* </div> */}
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Edukarya
        </p>
      </div>
    </div>
    </>
  );
}