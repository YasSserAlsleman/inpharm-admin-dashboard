import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, i18n } = useTranslation();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      alert(err.message || t('login.failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    i18n.changeLanguage(selected);
    localStorage.setItem('inpharm_lang', selected);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handle} className="w-96 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">{t('login.title')}</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">{t('language.label')}</label>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="w-full border rounded p-2"
          >
            <option value="en">{t('language.english')}</option>
            <option value="ar">{t('language.arabic')}</option>
            <option value="de">{t('language.german')}</option>
          </select>
        </div>
        <label className="block mb-2">{t('login.email')}</label>
        <input
          className="w-full mb-3 border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block mb-2">{t('login.password')}</label>
        <input
          type="password"
          className="w-full mb-4 border rounded p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? t('login.signing') : t('button.signIn')}
        </button>
      </form>
    </div>
  );
}