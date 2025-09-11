"use client"; // Menandakan ini Client Component, karena menggunakan useState dan useEffect
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation"; // Hook untuk navigasi programatik
import { toast } from "react-toastify";

// Definisi tipe konteks otentikasi
interface AuthContextType {
  token: string | null; // Token autentikasi
  login: (username: string, password: string) => Promise<void>; // Fungsi login
  register: (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => Promise<void>; // Fungsi register
  logout: () => void; // Fungsi logout
}

// Inisialisasi context dengan default kosong
const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Provider komponen yang membungkus seluruh aplikasi
export function AuthProvider({ children }: { children: ReactNode }) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/`;
  const [token, setToken] = useState<string | null>(null); // State menyimpan token
  const router = useRouter(); // Hook navigasi

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  // Cek jika user belum login, arahkan ke halaman signin
  useEffect(() => {
    const fetchDataWithAuth = async () => {
      // 1. Ambil token dari localStorage
      const token = localStorage.getItem("token");

      // 2. Periksa apakah token ada
      if (!token) {
        toast.info("Silahkan Login Terlebih Dahulu", {
          theme: "dark",
        });
        router.push("/signin");
        return; // Hentikan proses jika tidak ada token
      }

      try {
        // 3. Tambahkan Authorization header ke permintaan fetch
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        // Tangani jika respons tidak ok (misal 401 Unauthorized)
        if (response.status == 201 || response.status == 200) {
          console.log("Data berhasil terautentikasi");
        } else {
          toast.info("Silahkan Login Terlebih Dahulu", {
            theme: "dark",
          });
          router.push("/signin");
        }
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    };

    fetchDataWithAuth();
  }, [router]);

  // useEffect(() => {
  //   if (!isLoading && !token) {
  //     toast.info("Silahkan Login Terlebih Dahulu", {
  //       theme: "dark",
  //     });
  //     router.push("/signin");
  //   }
  // }, [isLoading, token, router]);
  // ...existing code...

  // Fungsi login: kirim email/password ke API, simpan token, redirect
  const login = async (email: string, password: string) => {
    const res = await fetch(`${url}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log("Status:", res.status); // <- Tambahkan ini
    console.log("Data:", data);
    console.log(data.user.id);
    if (res.status === 201 || res.status === 200) {
      setToken(data.token); // Simpan token di state
      localStorage.setItem("token", data.token); // Simpan token di localStorage
      router.push("/"); // Arahkan ke halaman utama
    } else {
      throw new Error(data.message || "Login failed"); // Lempar error jika gagal
    }
  };

  // Fungsi register: kirim data, lalu otomatis login jika sukses
  const register = async (
    name: string,
    email: string,
    password: string,
    role: string,
  ) => {
    const res = await fetch(`${url}register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (res.status === 201 || res.status === 200) {
      // Jika pendaftaran sukses, panggil login untuk autentikasi otomatis
      await login(email, password);
    } else {
      throw new Error(data.message || "Register failed");
    }
  };

  // Fungsi logout: hapus token dan redirect ke halaman login
  const logout = async () => {
    const res = await fetch(`${url}logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status == 200 || res.status == 201) {
      toast.success("Berhasil Logout", {
        theme: "dark",
      });
      setToken(null);
      localStorage.removeItem("token");
      // Hapus dari localStorage
      router.push("/signin"); // Arahkan ke login
    }
    // Tangani error jika perlu
    else {
      const data = await res.json();
      throw new Error(data.message || "Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children} {/* Render aplikasi di dalam provider */}
    </AuthContext.Provider>
  );
}

// Custom Hook untuk mengakses konteks dengan mudah
export const useAuth = () => useContext(AuthContext);
