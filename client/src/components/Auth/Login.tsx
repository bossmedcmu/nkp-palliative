import React, { useState } from 'react';
import { Stethoscope, Lock, User, AlertCircle, Heart, Building2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: { username: string; name: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'nkp' && password === 'Palli@nkp2026') {
      const userData = {
        username: 'nkp',
        name: 'กลุ่มงานเวชกรรมสังคม รพ.นครพิงค์',
        role: 'Social Medicine Palliative Network',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('nkp_palli_auth', JSON.stringify(userData));
      onLoginSuccess(userData);
    } else {
      setError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง (Username หรือ Password ผิดพลาด)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-teal-100">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-700 p-8 text-center text-white relative">
          <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shadow-inner mb-3 border border-white/20">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-teal-100">
            กลุ่มงานเวชกรรมสังคม โรงพยาบาลนครพิงค์
          </span>
          <h1 className="text-2xl font-black mt-2 tracking-tight">NKP PALLIATIVE CARE</h1>
          <p className="text-xs text-teal-100 mt-1 font-medium">
            ระบบบันทึกและเชื่อมโยงเครือข่ายบริการบริบาลประคับประคอง
          </p>

          <div className="absolute top-3 right-3 text-white/30">
            <Heart className="w-6 h-6" />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-slate-900">เข้าสู่ระบบ (Sign In)</h2>
            <p className="text-xs text-slate-500 mt-0.5">กรุณาเข้าสู่ระบบเพื่อเข้าถึงข้อมูลและแผนการดูแลผู้ป่วย</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all active:scale-[0.98] mt-2"
            >
              เข้าสู่ระบบ Palliative Care
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 py-3.5 px-6 border-t border-slate-100 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>กลุ่มงานเวชกรรมสังคม โรงพยาบาลนครพิงค์ & ศูนย์บริบาลประคับประคองขอนตาล</span>
        </div>
      </div>
    </div>
  );
};
