// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import { auth } from "@/lib/firebase";
// import {
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   User,
// } from "firebase/auth";

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = async (email: string, password: string) => {
//     await signInWithEmailAndPassword(auth, email, password);
//   };

//   const logout = async () => {
//     await signOut(auth);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };
