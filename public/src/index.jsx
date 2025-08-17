import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

function RegistrationForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [loading, setLoading] = useState(false);

  const onChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Erro desconhecido');
      }
      setStatus({ type: 'success', message: `Usuário registrado: ${data.user.name} (ID ${data.user.id})` });
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header>
        <h1>Marketplace - Cadastro</h1>
        <p>Crie sua conta para começar a comprar e vender.</p>
      </header>
      <main>
        {status && (
          <div className={`alert ${status.type} fade-in`} role="alert">
            <span>{status.message}</span>
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Seu nome" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={form.email} onChange={onChange} placeholder="voce@exemplo.com" required />
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <input id="password" type="password" name="password" value={form.password} onChange={onChange} placeholder="••••••••" required />
            <small className="helper">Mínimo 6 caracteres.</small>
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
        </form>
      </main>
      <footer>
        &copy; {new Date().getFullYear()} Marketplace Demo.
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<RegistrationForm />);
